import { useState, Fragment } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { logout } from "../../../store/pub";

import {
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  IconButton as MuiIconButton,
  Dialog
} from "@mui/material";
import ChangePassword from "./changePassword";

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

function NavbarUserDropdown() {
  const user = useSelector(state => state.user);
  const { t } = useTranslation();
  const [anchorMenu, setAnchorMenu] = useState(null);
  const [diagStatus, setDiagStatus] = useState({
    isOpen: false
  });
  const navigate = useNavigate();
  const toggleMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  // Close menu 
  const closeMenu = () => {
    setAnchorMenu(null);
  };

  // Close dialog
  const handleDiagClose = () => {
    setDiagStatus({
      isOpen: false
    })
  };

  // Change password
  const handleChangePassword = () => {
    setDiagStatus({
      isOpen: true
    })
    closeMenu();
  };

  // Set profile
  const handleSetProfile = () => {
    navigate("/private/my/profile");
    closeMenu();
  }

  // Exit system
  const handleSignOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Fragment>
      <Tooltip title={user.name}>
        <IconButton
          aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
          aria-haspopup="true"
          onClick={toggleMenu}
          color="inherit"
          size="large"
        >
          <Avatar alt="user avatar" src={user.avatar.fileUrl} />
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
      >
        <MenuItem onClick={handleChangePassword}>{t("labelChangePassword")}</MenuItem>
        <MenuItem onClick={handleSetProfile}>{t("labelSetup")}</MenuItem>
        <MenuItem onClick={handleSignOut}>{t("logout")}</MenuItem>
      </Menu>
      <Dialog
        maxWidth="sm"
        fullWidth
        onClose={handleDiagClose}
        open={diagStatus.isOpen}
        aria-hidden={!diagStatus.isOpen}
      >
        <ChangePassword user={user} onCancel={handleDiagClose} />
      </Dialog>
    </Fragment>
  );
}

export default NavbarUserDropdown;
