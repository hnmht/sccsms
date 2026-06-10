import React, { useState } from "react";
import styled from "@emotion/styled";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { useTranslation } from "react-i18next";

import { Box, CssBaseline, Paper as MuiPaper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { spacing } from "@mui/system";

import GlobalStyle from "./components/GlobalStyle";
import Navbar from "./components/navbar/Navbar";
import transItems from "./components/sidebar/transItems";
import Sidebar from "./components/sidebar/Sidebar";
import Footer from "./components/Footer";
import Settings from "./components/Settings";
import Loader from "../component/Loader/Loader";

const drawerWidth = 258;
const Root = styled.div`
  display: flex;
  min-height: 100vh; 
`;

const Drawer = styled.div`
  ${(props) => props.theme.breakpoints.up("md")} {
    width: ${drawerWidth}px;
    flex-shrink: 0;
  }
`;

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Paper = styled(MuiPaper)(spacing);

const MainContent = styled(Paper)`
  flex: 1;
  background: ${(props) => props.theme.palette.background.default}; 
 
  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
  }
`;

const Dashboard = ({  children }) => {
  const user = useSelector(state => state.user);
  const reqLoading = useSelector(state => state.reqStatus.reqLoading);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation();
  const menuItems = transItems(user.menuList, t);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      <Drawer>
        <Box sx={{ display: { xs: "block", lg: "none" } }}>
          <Sidebar
            PaperProps={{ style: { width: drawerWidth } }}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            items={menuItems}
          />
        </Box>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Sidebar
            PaperProps={{ style: { width: drawerWidth } }}
            items={menuItems}
          />
        </Box>
      </Drawer>
      <AppContent style={{ maxWidth: isLgUp ? "calc(100vw - 258px)" : "100vw" }}>
        <Navbar onDrawerToggle={handleDrawerToggle} />
        <MainContent p={isLgUp ? 6 : 2}>
          {reqLoading
            ? <Loader />
            : null
          }
          {children}
          <Outlet />
        </MainContent>
        <Footer />
      </AppContent>
      <Settings />
    </Root>
  );
};



export default Dashboard;
