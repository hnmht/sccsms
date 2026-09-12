package main

import (
	"context"
	"crypto/tls"
	"fmt"
	"net"
	"net/http"
	"os"
	"os/signal"
	"sccsmsserver/cache"
	"sccsmsserver/db/pg"
	"sccsmsserver/logger"
	"sccsmsserver/pkg/aws"
	"sccsmsserver/pkg/environment"
	"sccsmsserver/pkg/mysf"
	"sccsmsserver/route"
	"sccsmsserver/setting"
	"strconv"
	"syscall"
	"time"

	"github.com/quic-go/quic-go"
	"github.com/quic-go/quic-go/http3"
	"go.uber.org/zap"
)

func main() {

	// ============================================================
	// Step 1: Read global configuration
	// ============================================================

	if err := setting.Init(); err != nil {
		fmt.Println("Read global configuration failed:", err)
		return
	}

	// ============================================================
	// Step 2: Logger component initialization
	// ============================================================

	if err := logger.Init(
		setting.Conf.LogConfig,
		setting.Conf.Mode,
	); err != nil {

		fmt.Println(
			"logger component initialization failed:",
			err,
		)

		return
	}

	defer func() {
		_ = zap.L().Sync()
	}()

	// ============================================================
	// Step 3: Snowflake ID Generator initialization
	// ============================================================

	if err := mysf.Init(
		setting.Conf.StartTime,
		setting.Conf.MachineID,
	); err != nil {

		zap.L().Error(
			"snowflake Generator component initialization failed",
			zap.Error(err),
		)

		return
	}

	// ============================================================
	// Step 4: Database connection initialization
	// ============================================================

	if err := pg.Init(setting.Conf.PqConfig); err != nil {

		zap.L().Error(
			"Database connection initialization failed",
			zap.Error(err),
		)

		return
	}

	defer pg.Close()

	// ============================================================
	// Step 5: Cache component initialization
	// ============================================================

	if err := cache.Init(
		setting.Conf.RedisConfig.Enabled,
	); err != nil {

		zap.L().Error(
			"Cache component initialization failed",
			zap.Error(err),
		)

		return
	}

	defer cache.Close()

	// ============================================================
	// Step 6: AWS S3 / Object Storage initialization
	// ============================================================

	if err := aws.Init(
		setting.Conf.S3Storage.Endpoint,
		setting.Conf.S3Storage.AccessKeyID,
		setting.Conf.S3Storage.SecretAccessKey,
		setting.Conf.S3Storage.Secure,
		setting.Conf.SelfSigned,
		setting.Conf.S3Storage.DefaultBucket,
		setting.Conf.S3Storage.Location,
	); err != nil {

		zap.L().Error(
			"S3 Object Storage Init failed",
			zap.Error(err),
		)

		return
	}

	// ============================================================
	// Step 7: Route Setup
	// ============================================================

	r := route.Setup(setting.Conf.Mode)

	// ============================================================
	// Step 8: Start HTTP / HTTP2 / HTTP3 servers
	// ============================================================

	httpServer, http3Server, err := startHTTPServers(r)

	if err != nil {

		zap.L().Error(
			"Start HTTP servers failed",
			zap.Error(err),
		)

		return
	}

	// ============================================================
	// Step 9: Wait for SIGINT / SIGTERM
	// ============================================================

	quit := make(chan os.Signal, 1)

	signal.Notify(
		quit,
		syscall.SIGINT,
		syscall.SIGTERM,
	)

	<-quit

	zap.L().Info("Shutdown Server...")

	// ============================================================
	// Step 10: Graceful shutdown
	// ============================================================

	shutdownHTTPServers(
		httpServer,
		http3Server,
	)

	zap.L().Info("Server exiting")
}

// ================================================================
// startHTTPServers
//
// TLS enabled:
//
//     TCP -> HTTP/1.1 + HTTP/2
//     UDP -> HTTP/3
//
// TLS disabled:
//
//     TCP -> HTTP/1.1
//
// Both HTTP/2 and HTTP/3 use the same Gin Handler.
// ================================================================

func startHTTPServers(
	handler http.Handler,
) (*http.Server, *http3.Server, error) {

	addr := fmt.Sprintf(
		":%d",
		setting.Conf.Port,
	)

	// ------------------------------------------------------------
	// Check TLS configuration
	// ------------------------------------------------------------

	isTLS := setting.Conf.TLS

	if isTLS {

		if _, err := os.Stat(
			setting.Conf.CertificateFile,
		); err != nil {

			zap.L().Error(
				"Certificate file not found",
				zap.String(
					"file",
					setting.Conf.CertificateFile,
				),
				zap.Error(err),
			)

			isTLS = false
		}

		if _, err := os.Stat(
			setting.Conf.PrivateKeyFile,
		); err != nil {

			zap.L().Error(
				"Private key file not found",
				zap.String(
					"file",
					setting.Conf.PrivateKeyFile,
				),
				zap.Error(err),
			)

			isTLS = false
		}

		if !isTLS {

			zap.L().Warn(
				"TLS is enabled in configuration, " +
					"but certificate or private key is unavailable. " +
					"Fallback to HTTP.",
			)
		}
	}

	// ------------------------------------------------------------
	// HTTP Server
	// ------------------------------------------------------------

	httpServer := &http.Server{
		Addr:    addr,
		Handler: handler,
	}

	// ------------------------------------------------------------
	// HTTP only
	// ------------------------------------------------------------

	if !isTLS {

		go func() {

			zap.L().Info(
				"HTTP server starting",
				zap.String("addr", addr),
			)

			err := httpServer.ListenAndServe()

			if err != nil &&
				err != http.ErrServerClosed {

				zap.L().Error(
					"HTTP server failed",
					zap.Error(err),
				)
			}

		}()

		printServerInfo(false)

		return httpServer, nil, nil
	}

	// ============================================================
	// TLS mode
	//
	// TCP -> HTTP/1.1 + HTTP/2
	// UDP -> HTTP/3
	// ============================================================

	// ------------------------------------------------------------
	// Load certificate
	// ------------------------------------------------------------

	cert, err := tls.LoadX509KeyPair(
		setting.Conf.CertificateFile,
		setting.Conf.PrivateKeyFile,
	)

	if err != nil {

		return nil, nil, fmt.Errorf(
			"load TLS certificate failed: %w",
			err,
		)
	}

	// ------------------------------------------------------------
	// TLS configuration for HTTP/1.1 + HTTP/2
	// ------------------------------------------------------------

	httpTLSConfig := &tls.Config{
		Certificates: []tls.Certificate{
			cert,
		},

		MinVersion: tls.VersionTLS12,

		NextProtos: []string{
			"h2",
			"http/1.1",
		},
	}

	httpServer.TLSConfig = httpTLSConfig

	// ------------------------------------------------------------
	// Create TCP listener
	// ------------------------------------------------------------

	tcpListener, err := net.Listen(
		"tcp",
		addr,
	)

	if err != nil {

		return nil, nil, fmt.Errorf(
			"listen TCP %s failed: %w",
			addr,
			err,
		)
	}

	// ------------------------------------------------------------
	// Create TLS listener
	// ------------------------------------------------------------

	tlsListener := tls.NewListener(
		tcpListener,
		httpTLSConfig,
	)

	// ------------------------------------------------------------
	// HTTP/3 server
	// ------------------------------------------------------------

	http3Server := &http3.Server{
		Addr:    addr,
		Handler: handler,
	}

	// ------------------------------------------------------------
	// Create UDP listener for QUIC
	// ------------------------------------------------------------

	udpAddr, err := net.ResolveUDPAddr(
		"udp",
		addr,
	)

	if err != nil {

		_ = tlsListener.Close()

		return nil, nil, fmt.Errorf(
			"resolve UDP address %s failed: %w",
			addr,
			err,
		)
	}

	udpConn, err := net.ListenUDP(
		"udp",
		udpAddr,
	)

	if err != nil {

		_ = tlsListener.Close()

		return nil, nil, fmt.Errorf(
			"listen UDP %s failed: %w",
			addr,
			err,
		)
	}

	// ------------------------------------------------------------
	// Configure TLS for HTTP/3
	// ------------------------------------------------------------

	http3TLSConfig := &tls.Config{
		Certificates: []tls.Certificate{
			cert,
		},

		MinVersion: tls.VersionTLS13,

		NextProtos: []string{
			http3.NextProtoH3,
		},
	}

	// ------------------------------------------------------------
	// Create QUIC listener
	// ------------------------------------------------------------

	quicListener, err := quic.Listen(
		udpConn,
		http3TLSConfig,
		nil,
	)

	if err != nil {

		_ = udpConn.Close()
		_ = tlsListener.Close()

		return nil, nil, fmt.Errorf(
			"create QUIC listener failed: %w",
			err,
		)
	}

	// ------------------------------------------------------------
	// Advertise HTTP/3 to HTTP/1.1 / HTTP/2 clients
	//
	// Browser will receive:
	//
	// Alt-Svc: h3=":443"; ma=2592000
	// ------------------------------------------------------------

	originalHandler := handler

	handlerWithHTTP3 := http.HandlerFunc(
		func(
			w http.ResponseWriter,
			req *http.Request,
		) {

			port := setting.Conf.Port

			w.Header().Set(
				"Alt-Svc",
				fmt.Sprintf(
					`h3=":%d"; ma=2592000`,
					port,
				),
			)

			originalHandler.ServeHTTP(
				w,
				req,
			)
		},
	)

	httpServer.Handler = handlerWithHTTP3
	http3Server.Handler = handlerWithHTTP3

	// ------------------------------------------------------------
	// Start HTTP/1.1 + HTTP/2
	// ------------------------------------------------------------

	go func() {

		zap.L().Info(
			"HTTP/1.1 + HTTP/2 server starting",
			zap.String("addr", addr),
		)

		err := httpServer.Serve(
			tlsListener,
		)

		if err != nil &&
			err != http.ErrServerClosed {

			zap.L().Error(
				"HTTP/1.1 + HTTP/2 server failed",
				zap.Error(err),
			)
		}

	}()

	// ------------------------------------------------------------
	// Start HTTP/3
	// ------------------------------------------------------------

	go func() {

		zap.L().Info(
			"HTTP/3 server starting",
			zap.String("addr", addr),
		)

		err := http3Server.ServeListener(
			quicListener,
		)

		if err != nil &&
			err != http.ErrServerClosed {

			zap.L().Error(
				"HTTP/3 server failed",
				zap.Error(err),
			)
		}

	}()

	printServerInfo(true)

	return httpServer, http3Server, nil
}

// ================================================================
// shutdownHTTPServers
// ================================================================

func shutdownHTTPServers(
	httpServer *http.Server,
	http3Server *http3.Server,
) {

	// ------------------------------------------------------------
	// 5-second graceful shutdown timeout
	// ------------------------------------------------------------

	ctx, cancel := context.WithTimeout(
		context.Background(),
		5*time.Second,
	)

	defer cancel()

	// ------------------------------------------------------------
	// Shutdown HTTP/1.1 + HTTP/2
	// ------------------------------------------------------------

	if httpServer != nil {

		zap.L().Info(
			"Shutting down HTTP/1.1 + HTTP/2 server...",
		)

		if err := httpServer.Shutdown(ctx); err != nil {

			zap.L().Error(
				"HTTP server shutdown failed",
				zap.Error(err),
			)

		} else {

			zap.L().Info(
				"HTTP/1.1 + HTTP/2 server shutdown successfully",
			)
		}
	}

	// ------------------------------------------------------------
	// Shutdown HTTP/3
	// ------------------------------------------------------------

	if http3Server != nil {

		zap.L().Info(
			"Shutting down HTTP/3 server...",
		)

		if err := http3Server.Shutdown(ctx); err != nil {

			zap.L().Error(
				"HTTP/3 server shutdown failed",
				zap.Error(err),
			)

		} else {

			zap.L().Info(
				"HTTP/3 server shutdown successfully",
			)
		}
	}
}

// ================================================================
// printServerInfo
// ================================================================

func printServerInfo(
	isTLS bool,
) {

	ipList := environment.GetLocalIPs()

	protocol := "http"

	if isTLS {
		protocol = "https"
	}

	portStr := strconv.FormatInt(
		int64(setting.Conf.Port),
		10,
	)

	if setting.Conf.Mode != "release" {
		return
	}

	fmt.Println(
		"...............................................................",
	)

	fmt.Println(" ")
	fmt.Println(
		"Sea&Cloud Construction Site Management System",
	)

	fmt.Println(" ")

	if isTLS {

		fmt.Println(
			"HTTP/1.1 + HTTP/2 + HTTP/3",
		)

	} else {

		fmt.Println(
			"HTTP/1.1",
		)
	}

	fmt.Println(" ")

	fmt.Println(
		"Enter the following address in your browser to access the system:",
	)

	for _, ip := range ipList {

		if ip.To4() != nil {

			fmt.Println(
				protocol +
					"://" +
					ip.String() +
					":" +
					portStr,
			)
		}
	}

	fmt.Println(" ")

	fmt.Println(
		"...............................................................",
	)

	fmt.Println(" ")

	fmt.Println(
		"Author: Haitao Meng",
	)

	fmt.Println(
		"https://github.com/hnmht",
	)

	fmt.Println(" ")

	fmt.Println(
		"...............................................................",
	)

	fmt.Println(" ")

	fmt.Println(
		"Sea&Cloud Construction Site Management System Backend Services running, Don't close this window...",
	)

	fmt.Println(" ")

	fmt.Println(
		"...............................................................",
	)

	fmt.Println(" ")
}
