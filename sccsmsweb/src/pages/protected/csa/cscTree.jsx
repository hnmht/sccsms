import { useState, useEffect } from "react";
import { List, ListSubheader, Tooltip, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { RefreshIcon } from "../../../component/PubIcon/PubIcon";
import PubTree from "../../../component/ScInput/ScPub/PubTree";
import { InitDocCache, GetLocalCache } from "../../../storage/db/db";
import useContentHeight from "../../../hooks/useContentHeight";

// Construction Site Category Tree Selection Component
function CSCTree({ selectOk }) {
    const [cscs, setCscs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState(undefined);
    const { t } = useTranslation();

    const contentHeight = useContentHeight();
    useEffect(() => {
        async function initCscs() {
            await InitDocCache("csc");
            const newCscs = await GetLocalCache("csc");
            setCscs(newCscs);
        }
        initCscs();
    }, []);
    // Convert the currently selected CSCs into an ID array
    const transferDocIDs = (doc) => {
        let selectedDocIDs = [];
        if (doc !== undefined) {
            selectedDocIDs.push(doc.id);
        }
        return selectedDocIDs;
    }
    // Request latest CSC from indexedb
    const handleGetLocalSICs = async () => {
        const newCscs = await GetLocalCache("csc");
        setCscs(newCscs);
    };
    // Request the latest CSCs from server
    const handleRefresh = async () => {
        await InitDocCache("csc");
        handleGetLocalSICs();
    };

    // Actions after click item
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
                docName="csc"
                isDisplayAll={false}
                oriDocs={cscs}
                onDocClick={handleOnDocClick}
                selectDocIDs={transferDocIDs(currentDoc)}
                onDocDoubleClick={handleOnDocClick}
            />
        </List>
    );
}

export default CSCTree;