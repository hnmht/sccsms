import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import {dayjs,DateTimeFormat} from "../../../i18n/dayjs";
import {
  Avatar as MuiAvatar,
  Badge,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover as MuiPopover,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import Notifications from "@mui/icons-material/Notifications";
const Popover = styled(MuiPopover)`
  .MuiPaper-root {
    width: 300px;
    ${(props) => props.theme.shadows[1]};
    border: 1px solid ${(props) => props.theme.palette.divider};
  }
`;

const Indicator = styled(Badge)`
  .MuiBadge-badge {
    background: ${(props) => props.theme.header.indicator.background};
    color: ${(props) => props.theme.palette.common.white};
  }
`;

const Avatar = styled(MuiAvatar)`
  background: ${(props) => props.theme.palette.primary.main};
`;

const NotificationHeader = styled(Box)`
  text-align: center;
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
`;

function Notification({ title, description, avatar }) {
  return (
    <ListItem divider component={Link} to="#">
      <ListItemAvatar>
        <Avatar src={avatar.fileUrl} />
      </ListItemAvatar>
      <ListItemText
        primary={title}
        primaryTypographyProps={{
          variant: "subtitle2",
          color: "textPrimary",
        }}
        secondary={description}
      />
    </ListItem>
  );
}

const  NavbarNotificationsDropdown = () => {
  const ref = useRef(null);
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const eoRefs = useSelector(state => state.dynamicData.eoRefs);
  const woRefs = useSelector(state => state.dynamicData.woRefs);
  const taskNumber = eoRefs.length + woRefs.length;

  const filterEor = eoRefs.length > 2 ? eoRefs.slice(0, 2) : eoRefs;
  const filterWor = woRefs.length > 2 ? woRefs.slice(0, 2) : woRefs;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title={t("tasks")}>
        <IconButton color="inherit" ref={ref} onClick={handleOpen} size="large">
          <Indicator badgeContent={taskNumber}>
            <Notifications />
          </Indicator>
        </IconButton>
      </Tooltip>
      <Popover
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
      >
        {woRefs.length > 0
          ? <>
            <NotificationHeader p={2}>
              <Typography variant="subtitle1" color="textPrimary">
                {t("haveNewWO", woRefs.length)}
              </Typography>
            </NotificationHeader>
            <List disablePadding>
              {filterWor.map(wor => {
                let description = DateTimeFormat(wor.startTime,"LLL")  + " " + wor.ept.name;
                return <Notification
                  title={wor.csa.name}
                  description={description}
                  avatar={wor.creator.avatar}
                  key={wor.id}
                />
              })}
            </List>
          </>
          : null
        }
        {eoRefs.length > 0
          ? <>
            <NotificationHeader p={2}>
              <Typography variant="subtitle1" color="textPrimary">
                {t("haveNewIssue", eoRefs.length)}
              </Typography>
            </NotificationHeader>
            <List disablePadding>
              {filterEor.map(edr =>
                <Notification
                  title={edr.csa.name}
                  description={edr.epa.name + t("valueIs") + edr.executionValueDisp}
                  avatar={edr.executor.avatar}
                  key={edr.id}
                />
              )}
            </List>
          </>
          : null
        }
        <Box p={1} display="flex" justifyContent="center">
          <Button size="small" component={Link} to="/private/calendar" onClick={handleClose}>
            {t("viewSchedule")}
          </Button>
        </Box>
      </Popover>
    </>
  );
}
export default NavbarNotificationsDropdown;
