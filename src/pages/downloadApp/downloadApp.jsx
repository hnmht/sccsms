import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { Button as MuiButton, Typography, Box } from "@mui/material";
import { spacing } from "@mui/system";
import { AndroidIcon, AppleIcon } from "../../component/PubIcon/PubIcon";
import { useTranslation } from "react-i18next";

const Button = styled(MuiButton)(spacing);

const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing(6)};
  text-align: center;
  background: transparent;

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function DownloadApp() {
    const isWeChat = navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1;
    const { t } = useTranslation();

    return (
        <Wrapper>
            <Typography component="h1" variant="h1" align="center" gutterBottom>
                {t("downloadApp")}
            </Typography>
            {isWeChat
                ? <>
                    <Typography variant="h4" gutterBottom align="left">
                        微信内置浏览器无法直接下载App,请按照如下步骤操作:
                    </Typography>
                    <Typography variant="h5" gutterBottom align="left">
                        1、点击右上角...图标;
                    </Typography>
                    <Typography variant="h5" gutterBottom align="left">
                        2、选择"在浏览器打开";
                    </Typography>
                    <Typography variant="h5" gutterBottom align="left">
                        3、在浏览器中点击按钮下载APP;
                    </Typography>
                </>
                : null
            }
            <Box style={{ margin: 16 }}>
                <Button
                    size="large"
                    disabled={isWeChat}
                    href={window.location.origin + "/static/apk/sccsmsmob.apk"}
                    variant="contained"
                    color="primary"
                    startIcon={<AndroidIcon />}
                    style={{ minWidth: 128 }}
                >
                    {t("downloadAndroid")}
                </Button>
            </Box>
            <Box style={{ margin: 16 }}>
                <Button
                    component={Link}
                    size="large"
                    href={window.location.origin + "/static/apk/a123.apk"}
                    disabled
                    variant="contained"
                    color="primary"
                    startIcon={<AppleIcon />}
                    style={{ minWidth: 128 }}
                >
                    {t("downloadIOS")}
                </Button>
            </Box>
        </Wrapper>
    );
}

export default DownloadApp;
