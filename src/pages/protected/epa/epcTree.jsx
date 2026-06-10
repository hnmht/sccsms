import React, { useState, useEffect } from "react";

import { List, ListSubheader, Tooltip, IconButton } from "@mui/material";
import { RefreshIcon } from "../../../component/PubIcon/PubIcon";
import PubTree from "../../../component/ScInput/ScPub/PubTree";
import { InitDocCache, GetLocalCache } from "../../../storage/db/db";
import useContentHeight from "../../../hooks/useContentHeight";
import { useTranslation } from "react-i18next";

// Execution Project Category Tree View Component
const EpcTree = ({ selectOk }) => {
    const [epcs, setEpcs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState(undefined);
    const contentHeight = useContentHeight();
    const { t } = useTranslation();

    useEffect(() => {
        async function initEpcs() {
            await InitDocCache("epc");
            const newEpcs = await GetLocalCache("epc");
            setEpcs(newEpcs);
        }
        initEpcs();
    }, []);
    // Convert the current seledted EPCs into a ID array
    const transferDocIDs = (doc) => {
        let selectedDocIDs = [];
        if (doc !== undefined) {
            selectedDocIDs.push(doc.id);
        }
        return selectedDocIDs;
    }
    // Get EPC list from cache
    const handleGetLocalEPCs = async () => {
        const newEpcs = await GetLocalCache("epc");
        setEpcs(newEpcs);
    };
    // Actions after click Refresh Icon button
    const handleRefresh = async () => {
        await InitDocCache("epc");
        handleGetLocalEPCs();
    };

    // Acitons after Click the EPC item 
    const handleOnDocClick = (item, type) => {
        setCurrentDoc(item);
        selectOk(item);
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
            <PubTree
                docName="category"
                isDisplayAll={false}
                oriDocs={epcs}
                onDocClick={handleOnDocClick}
                selectDocIDs={transferDocIDs(currentDoc)}
                onDocDoubleClick={handleOnDocClick}
            />
        </List>
    );
}

export default EpcTree;