import React, { useEffect, useState } from "react";
import {
    DialogTitle,
    Grid,
    List,
    ListSubheader,
    Tooltip,
    IconButton,
    DialogActions,
    Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { RefreshIcon } from "../../PubIcon/PubIcon";
import PubTree from "../ScPub/PubTree";
import DocTable from "../../DocTable/DocTable";
import { columns } from "./tableConstructor";
import { treeToArr } from "../../../utils/tree";
import { GetLocalCache, InitDocCache, GetCacheAnyOf } from "../../../storage/db/db";

const EPAName = "epa";
const EPCName = "epc";

const EPAPicker = ({ clickItemAction, doubleClickItemAction, cancelClickAction, okClickAction, currentItem }) => {
    const [epcs, setEpcs] = useState([]);
    const [epas, setEpas] = useState([]);
    const [selectedEPCids, setSelectedEPCids] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        handleGetEPCsCache();
    }, []);
    // Get Execution Project Category from front-end cache
    const handleGetEPCsCache = async () => {
        const localEPCs = await GetLocalCache(EPCName);
        setEpcs(localEPCs);
    };
    // Refresh Execution Project Category 
    const handleRefreshEics = async () => {
        // Request latest EPC list for front-end cache
        await InitDocCache(EPCName);
        // Get EPC list from front-end cache
        let newEics = await GetLocalCache(EPCName);
        // Refresh
        setEpcs(newEics);
    };
    // Refresh Execution Project Archaive 
    const handleRefreshEpas = async () => {
        // Request latest EPA list for front-end cache
        await InitDocCache(EPAName);
        // Get EPA list from front-end cache 
        let newEPAs = await GetCacheAnyOf(EPAName, "epc.id", selectedEPCids);
        setEpas(newEPAs);
    };
    // Actions after click EPC item
    const handleEicClick = async (item, type) => {
        let classIds = [];
        if (type === 0) { // Leaf
            classIds.push(item.id);
        } else if (type === 1) { // Parent
            const tree = [];
            tree.push(item);
            let allChilds = treeToArr(tree);
            allChilds.forEach(item1 => {
                classIds.push(item1.id);
            })
        } else if (type === 3) { // All
            item.forEach(item3 => {
                classIds.push(item3.id);
            })
        }
        // Get EPAs from front-end list by EPC id
        const localEPAs = await GetCacheAnyOf("epa", "epc.id", classIds);
        setEpas(localEPAs);
        setSelectedEPCids(classIds);
    };

    return (
        <>
            <DialogTitle>{t("chooseEPA")}</DialogTitle>
            <Grid container spacing={1}>
                <Grid item xs={3}>
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
                                    <IconButton onClick={handleRefreshEics}>
                                        <RefreshIcon color="primary" />
                                    </IconButton>
                                </Tooltip>
                            </ListSubheader>
                        }
                        sx={{ width: "100%", height: 700, overflow: "auto", p: 0, borderStyle: "solid", borderWidth: 1, borderColor: "divider", bgcolor: "background.paper" }}
                    >
                        <PubTree
                            docName={t("epc")}
                            isDisplayAll={true}
                            oriDocs={epcs}
                            onDocClick={handleEicClick}
                            selectDocIDs={selectedEPCids}
                            onDocDoubleClick={handleEicClick}
                            isEdit={true}
                        />
                    </List>
                </Grid>
                <Grid item xs={9} maxWidth={640}>
                    <DocTable
                        columns={columns}
                        refreshAction={handleRefreshEpas}
                        rows={epas}
                        docListTitle={"chooseEPA"}
                        clickItem={clickItemAction}
                        doubleClickItem={doubleClickItemAction}
                        isMultiple={false}
                    />
                </Grid>
            </Grid>
            <DialogActions sx={{ m: 1 }}>
                <Button color="error" onClick={cancelClickAction} >{t("cancel")}</Button>
                <Button variant="contained" disabled={currentItem.id === 0} onClick={okClickAction}>{t("ok")}</Button>
            </DialogActions>
        </>
    );
};

export default EPAPicker;