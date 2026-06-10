import React from "react";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { spacing } from "@mui/system";
import {
  Box as MuiBox,
  Drawer as MuiDrawer,
  ListItemButton,
} from "@mui/material";

import SidebarNav from "./SidebarNav";

const Box = styled(MuiBox)(spacing);

const Drawer = styled(MuiDrawer)`
  border-right: 0;
  > div {
    border-right: 0;
  }
`;

const Brand = styled(ListItemButton)`
  font-size: ${(props) => props.theme.typography.h5.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  color: ${(props) => props.theme.sidebar.header.color};
  background-color: ${(props) => props.theme.sidebar.header.background};
  font-family: ${(props) => props.theme.typography.fontFamily};
  min-height: 56px;
  padding-left: ${(props) => props.theme.spacing(6)};
  padding-right: ${(props) => props.theme.spacing(6)};
  justify-content: center;
  cursor: pointer;
  flex-grow: 0;

  ${(props) => props.theme.breakpoints.up("sm")} {
    min-height: 64px;
  }
  &:hover {
    background-color: ${(props) => props.theme.sidebar.header.background};
  }
`;

const Sidebar = ({ items, showFooter = true, ...rest }) => {
  return (
    <Drawer variant="permanent" {...rest}>
      <Brand component={NavLink} to="/">       
        <img
          src={"/static/img/brands/seacloud.png"}
          style={{
            width: '24px',
            height: 'auto',
            cursor: 'pointer',
            margin:"4px"
          }}
          alt="logo"
        />
        <Box ml={1}>
          SeaCloud
        </Box>
      </Brand>
      <SidebarNav items={items} />      
    </Drawer>
  );
};

export default Sidebar;
