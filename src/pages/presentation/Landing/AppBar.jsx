import { Box, AppBar, Toolbar, Button, Container, Tooltip, IconButton, Typography } from '@mui/material';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { LoginIcon, LogoutIcon } from "../../../component/PubIcon/PubIcon";
import { logout } from "../../../store/pub";
import NavbarLanguagesDropdown from '../../../layouts/components/navbar/NavbarLanguagesDropdown';

const logoStyle = {
    width: '32px',
    height: 'auto',
    cursor: 'pointer',
};

const AIAppBar = ({ user, isLogin }) => {
    const { t } = useTranslation();

    const handleSignout = async () => {
        logout();
    };

    return (
        <div>
            <AppBar
                position="fixed"
                sx={{
                    boxShadow: 0,
                    bgcolor: 'transparent',
                    backgroundImage: 'none',
                    mt: 2,
                }}
            >
                <Container >
                    <Toolbar
                        variant="regular"
                        sx={(theme) => ({
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexShrink: 0,
                            borderRadius: '999px',
                            bgcolor:
                                theme.palette.mode === 'light'
                                    ? 'rgba(255, 255, 255, 0.4)'
                                    : 'rgba(0, 0, 0, 0.4)',
                            backdropFilter: 'blur(24px)',
                            maxHeight: 40,
                            border: '1px solid',
                            borderColor: 'divider',
                            boxShadow:
                                theme.palette.mode === 'light'
                                    ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                                    : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
                        })}
                    >
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: 'flex',
                                ml: 0,
                                alignItems: 'center',
                            }}
                        >
                            <img
                                src={"/static/img/brands/seacloud_round.png"}
                                style={logoStyle}
                                alt="logo of sitemark"
                            />
                            <Typography color={"primary"} p={2} sx={{ display: { xs: "none", md: "flex" }, fontSize: "18px" }}>
                                SeaCloud
                            </Typography>
                        </Box>
                        <NavbarLanguagesDropdown />
                        <Box
                            sx={{
                                display: { md: 'flex' },
                                gap: 0.5,
                                alignItems: 'center',
                                mr: "18px"
                            }}
                        >
                            {isLogin
                                ? <Box sx={{ display: "flex", direction: "row", alignItems: "center" }} p={2}>
                                    <Typography color={"primary"} p={2} sx={{ display: { xs: "none", md: "flex" } }}>
                                        {t("welcome") + "," + user.name}
                                    </Typography>
                                    <Tooltip title={t("goBackend")}>
                                        <IconButton
                                            component={Link}
                                            to="/private/dashboard"
                                        >
                                            <LoginIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={t("logout")}>
                                        <IconButton
                                            onClick={handleSignout}
                                        >
                                            <LogoutIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                : <Button
                                    ml={2}
                                    color="primary"
                                    size="small"
                                    variant="contained"
                                    component={Link}
                                    to="/auth/signin"
                                    target="_self"
                                >
                                    {t("login")}
                                </Button>
                            }
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </div>
    );
}
export default AIAppBar;