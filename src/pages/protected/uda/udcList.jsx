import React, { useState, useEffect } from "react";
import {
    List,
    ListSubheader,
    ListItemButton,
    ListItem,
    ListItemText,
    ListItemIcon,
    Tooltip,
    IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { UDCIcon, RefreshIcon, LevelIcon } from "../../../component/PubIcon/PubIcon";
import { InitDocCache, GetLocalCache } from "../../../storage/db/db";
import useContentHeight from "../../../hooks/useContentHeight";

function UDCList({ isEdit, selectOk }) {
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [UDCs, setUDCs] = useState([]);
    const { t } = useTranslation();
    const contentHeight = useContentHeight();

    useEffect(() => {
        handleGetUDCs();
    }, []);
    // Actions after click the item
    const handleSelect = (index) => {
        if (currentIndex !== index) {
            selectOk(UDCs[index]);
        }
        setCurrentIndex(index);
    };
    // Get UDC list from the front-end cache
    const handleGetUDCs = async () => {
        const udcsCache = await GetLocalCache("udc");
        // const udcs = udcsCache.length > 0 ? udcsCache : [];
        setUDCs(udcsCache);
    };
    // Actions after click the refresh button.
    const handleRefresh = async () => {
        await InitDocCache("udc");
        handleGetUDCs();
    };

    return (
        <List
            dense
            subheader={
                <ListSubheader component="div" id="nested-list-subheader"
                    sx={{
                        borderBottomStyle: "solid", borderBottomWidth: 1, borderBottomColor: "divider",
                        fontWeight: "bold", fontSize: "1.125em", bgcolor: "background.paper",
                        display: "flex", flexDirection: "row", justifyContent: "space-between"
                    }}
                >
                    {t("chooseCategory")}
                    <Tooltip title={t("refresh")} placement="top">
                        <IconButton onClick={handleRefresh}>
                            <RefreshIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                </ListSubheader>
            }
            sx={{ width: "100%", height: contentHeight, overflow: "auto", p: 0, borderStyle: "solid", borderWidth: 0, borderColor: "divider", bgcolor: "background.paper" }}
        >
            {UDCs.map((udc, index) => {
                const status = udc.status ? udc.status : 0;
                const disabled = status === 1;
                const name = disabled ? `${udc.name}(${t("disable")})` : udc.name;
                return <ListItem
                    key={index}
                    disablePadding
                >
                    <ListItemButton
                        onClick={() => handleSelect(index)}
                        disabled={isEdit}
                    >
                        <ListItemIcon>
                            <UDCIcon color={currentIndex === index ? "primary" : "transparent"} />
                        </ListItemIcon>
                        <ListItemText
                            primary={name}
                            sx={{ ".MuiListItemText-primary": { color: udc.status === 0 ? currentIndex === index ? "primary.main" : "primary" : "warning.main" } }}
                        />
                        {udc.level === 1
                            ? <ListItemIcon>
                                <LevelIcon color={currentIndex === index ? "primary" : "transparent"} />
                            </ListItemIcon>
                            : null
                        }
                    </ListItemButton>
                </ListItem>
            })}
        </List>
    );
}

export default UDCList;