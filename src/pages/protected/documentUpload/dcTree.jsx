import { useState, useEffect } from "react";
import { List, ListSubheader, Tooltip, IconButton } from "@mui/material";
import { RefreshIcon } from "../../../component/PubIcon/PubIcon";
import PubTree from "../../../component/ScInput/ScPub/PubTree";
import { InitDocCache, GetLocalCache } from "../../../storage/db/db";
import useContentHeight from "../../../hooks/useContentHeight";

// Document Category Tree View
const DcTree = ({ selectOk,t }) => {
    const [dcs, setDcs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState(undefined);

    const contentHeight = useContentHeight();
    useEffect(() => {
        async function initDcs() {
            await InitDocCache("dc");
            const newDcs = await GetLocalCache("dc");
            setDcs(newDcs);
        }
        initDcs();
    }, []);
    // Convert the current selcted DCs into a ID array
    const transferDocIDs = (doc) => {
        let selectedDocIDs = [];
        if (doc !== undefined) {
            selectedDocIDs.push(doc.id);
        }
        return selectedDocIDs;
    }
    // Get Document Category from front end cache
    const handleGetLocalDCs = async () => {
        const newDcs = await GetLocalCache("dc");
        setDcs(newDcs);
    };
    // Request the latest Document Category list from backend
    const handleRefresh = async () => {
        await InitDocCache("dc");
        handleGetLocalDCs();
    };

    // Actions after choose Document Category
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
                oriDocs={dcs}
                onDocClick={handleOnDocClick}
                selectDocIDs={transferDocIDs(currentDoc)}
                onDocDoubleClick={handleOnDocClick}
            />
        </List>
    );
};

export default DcTree;