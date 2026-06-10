import { useState, useEffect } from "react";
import {
    List,
    ListSubheader,
    Tooltip,
    IconButton,
    DialogActions,
    Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { RefreshIcon } from "../../PubIcon/PubIcon";
import { InitDocCache, GetLocalCache } from "../../../storage/db/db";
import PubTree from "../ScPub/PubTree";

const docName = "csc";
const CSCPicker = ({ clickItemAction, doubleClickItemAction, cancelClickAction, okClickAction, currentItem }) => {
    const [oriDocs, setOriDocs] = useState([]);
    const { t } = useTranslation();
    useEffect(() => {
        async function getLocalCSCs() {
            const eics = await GetLocalCache(docName);
            setOriDocs(eics);
        }
        getLocalCSCs();
    }, []);
    // Convert the current array of CSC objects into an array of CSC IDs.
    const transferDocIDs = (doc) => {
        let selectedDocIDs = [];
        selectedDocIDs.push(doc.id);
        return selectedDocIDs;
    };

    // Refresh CSC list
    const handleDocRefresh = async () => {
        await InitDocCache(docName);
        const newDocs = await GetLocalCache(docName);
        setOriDocs(newDocs);
    };


    return (
        <>
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
                            <IconButton onClick={handleDocRefresh}>
                                <RefreshIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                    </ListSubheader>
                }
                sx={{ width: 512, minHeight: 256, maxHeight: 512, overflow: "auto", p: 0, borderStyle: "solid", borderWidth: 1, borderColor: "divider", bgcolor: "background.paper" }}
            >
                <PubTree oriDocs={oriDocs} selectDocIDs={transferDocIDs(currentItem)} onDocClick={clickItemAction} onDocDoubleClick={doubleClickItemAction} />
            </List>
            <DialogActions sx={{ p: 2.5 }}>
                <Button color='error' onClick={cancelClickAction}>{t("cancel")}</Button>
                <Button variant='contained' disabled={currentItem.id === 0 ? true : false} onClick={okClickAction}>{t("ok")}</Button>
            </DialogActions>
        </>
    );
};

export default CSCPicker;