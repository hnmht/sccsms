# Configuration Reference ( config.yaml)
This section details the configuration parameters required for the SCCSMS server.

## 1. General Settings
| Parameter | Description |
| :---: | :--- |
| `addr` | The IP address the server binds to (use **""** for all interfaces ).|
| `name` | The name of the server instance. |
| `mode` | The application's run mode (`release` or `debug`)|
| `port` | The port the server listens on for HTTP requests. |
| `machine_id`| A unique ID for the server. If you're using multiple application servers, you can use this field to record the machine identifier for each one |
| `userlockth` | Maximum failed login attempts before locking a user account. |
| `iplockth` | Maximum failed login attempts from a single IP before blocking. |
| `iplockedminutes` | Duration (in minutes) an IP remains blocked after triggered |
| `tls`| Set to `true` to enable HTTPS |
| `certificatefile` | Path to your SSL certificate (.pem) |
| `privatekeyfile`| Path to you private key ( .pem) |

## 2. Log Settings
| Parameter | Description |
| :---: | :---|
| `level` | Logging verbosity (`debug` or `normal`) |
| `filename` | Path/name of the log file. |
| `max_size` | Maximum size of a log file in MB before rotation |
| `max_age` | Number of days to retain old log files |
| `max_backups` | Maximum number of old log files to keep |

## 3. PostgreSQL Database Settings
| Parameter | Description |
| :---: | :---|
| `host`/`port` | PostgreSQL connection host and port |
| `dbname` | The database name for SCCSMS |
| `username`/ `password` | Authentication credentials for the databases|
| `max_open_conns` | Maximum number of open connections to the database. |
| `max_idle_conns` | Maximum number of idle to the databases. |
| `max_record` | Maximum number of rows returned per query |

## 4. S3-compatible Storage Settings
| Parameter | Description |
| :---: | :---|
| `endpoint` | The URL of your S3-compatible storage service. |
| `accesskeyid` / `secretaccesskey` | Credentials for the S3 storage |
| `secure` | Set to `true` if useing HTTPS for storage |
| `selfsigned`| Whether the S3-compatible storage service uses a self-signed certificate |
| `defaultbucket` | The target bucket name for storing files |
| `location` | S3 storage region  **Note: This setting has no effect when using MinIO or RustFS |

## 5. Redis Settings
| Parameter | Description |
| :---: | :---|
| `enabled` | Enable Redis for centralized caching. **Note: For single-node SCCSMS deployments, the system uses an internal cache by default. Redis is only required for centralized caching in clustered deployments.** |
| `host`/`port` | Redis connection host and port |
| `db` | The database to be selected after connecting to the server.|
| `password` | Password is an optional password. Must match the password specified in the `requirepass` server configuration option (if connecting to a Redis 5.0 instance, or lower), or the User Password when connecting to a Redis 6.0 instance, or greater, that is using the Redis ACL system.|
| `pool_size` | The base number of socket connections. |