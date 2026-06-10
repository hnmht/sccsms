import { useState, Fragment } from "react";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import {
  Tooltip,
  Menu,
  MenuItem,
  IconButton as MuiIconButton,
} from "@mui/material";
const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;
const Flag = styled.img`
  border-radius: 50%;
  width: 22px;
  height: 22px;
`;
const languageOptions = {
  "en-US": {
    icon: "/static/img/flags/us.png",
    name: "American English",
  },
  "zh-CN": {
    icon: "/static/img/flags/cn.png",
    name: "简体中文",
  },
};

const NavbarLanguagesDropdown = () => {
  const { i18n } = useTranslation();
  const [anchorMenu, setAnchorMenu] = useState(null);

  const selectedLanguage = languageOptions[i18n.language];

  const toggleMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    closeMenu();
  };

  return (
    <Fragment>
      <Tooltip title="Languages">
        <IconButton
          aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
          aria-haspopup="true"
          onClick={toggleMenu}
          color="inherit"
          size="large"
        >
          <Flag src={selectedLanguage.icon} alt={selectedLanguage.name} />
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
      >
        {Object.keys(languageOptions).map((language) => (
          <MenuItem
            key={language}
            onClick={() => handleLanguageChange(language)}
          >
            {languageOptions[language].name}
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  );
};

export default NavbarLanguagesDropdown;
