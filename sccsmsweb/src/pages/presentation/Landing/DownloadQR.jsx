import { Box, Typography, useTheme, useMediaQuery, Container } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const displayTop = { display: "block", position: "fixed", right: 32, top: 80, zIndex: 9 };
const displayBottom = { display: "block", position: "fixed", right: 8, bottom: 64, zIndex: 9 };

function DownloadQR() {
    const { t } = useTranslation();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("md"));
    return (
        <Box sx={matches ? displayTop : displayBottom}>
            <Container sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
            }}>
                <QRCodeSVG
                    value={window.location.origin + "/downloadapp"}
                    size={96}
                    imageSettings={{
                        src: window.location.origin + "/static/img/brands/logo.png",
                        height: 24,
                        width: 24
                    }}
                />
                <Typography
                    component={Link}
                    to="/downloadapp"
                    color="secondary"
                    sx={{
                        width: 128,
                        textAlign: "center"
                    }}
                >
                    {t("tipDownloadQR")}
                </Typography>
            </Container>
        </Box>
    );
}
export default DownloadQR;