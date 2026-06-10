import { useState, useEffect } from "react";
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
import { InitDocCache, GetLocalCache, GetCacheAnyOf } from "../../../storage/db/db";
import PubTree from "../ScPub/PubTree";
import DocTable from "../../DocTable/DocTable";
import { treeToArr } from "../../../utils/tree";

const CSCName = "csc";
const CSAName = "csa";

const CSAPicker = ({ clickItemAction, doubleClickItemAction, cancelClickAction, okClickAction, currentItem, columns }) => {
    const [csas, setCSAs] = useState([]);
    const [cscs, setCSCs] = useState([]);
    const [selectedCSCIds, setSelectedCSCIds] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        async function getLocalDatas() {
            const newCSCs = await GetLocalCache(CSCName);
            setCSCs(newCSCs);
        }
        getLocalDatas();
    }, []);

    // Acitons after Click CSC item
    const handleCSCClick = async (item, type) => {
        let cscIDs = [];
        if (type === 0) { // Leaf
            cscIDs.push(item.id);
        } else if (type === 1) { // Parent
            const tree = [];
            tree.push(item);
            let allChilds = treeToArr(tree);
            allChilds.forEach(item1 => {
                cscIDs.push(item1.id);
            })
        } else if (type === 3) { // All
            item.forEach(item3 => {
                cscIDs.push(item3.id);
            })
            cscIDs.push(0);
        }
        // Get CSA list from front-end cache
        const localCSAs = await GetCacheAnyOf(CSAName, "csc.id", cscIDs);

        setCSAs(localCSAs);
        setSelectedCSCIds(cscIDs);
    };
    // Refresh CSC
    const handleRefreshCSCs = async () => {
        // Request latest CSC archive from backend server
        await InitDocCache(CSCName);
        // Get CSC list from front-end cache
        const newCSCs = await GetLocalCache(CSCName);
        setCSCs(newCSCs);
    };
    // Refresh CSA
    const handleRefreshCSAs = async () => {
        // Request latest CSA archive from backend server
        await InitDocCache(CSAName);
        // Get CSA list from front-end cache
        const newCSAs = await GetCacheAnyOf(CSAName, "csc.id", selectedCSCIds);
        // Refresh
        setCSAs(newCSAs);
    };

    return (
        <>
            <DialogTitle>{t("chooseCSA")}</DialogTitle>
            <Grid container spacing={2} >
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
                                    <IconButton onClick={handleRefreshCSCs}>
                                        <RefreshIcon color="primary" />
                                    </IconButton>
                                </Tooltip>
                            </ListSubheader>
                        }
                        sx={{ width: "100%", height: 700, overflow: "auto", p: 0, ml: 1, borderStyle: "solid", borderWidth: 1, borderColor: "divider", bgcolor: "background.paper" }}
                    >
                        <PubTree
                            docName={t("csc")}
                            isDisplayAll={true}
                            oriDocs={cscs}
                            onDocClick={handleCSCClick}
                            selectDocIDs={selectedCSCIds}
                            onDocDoubleClick={handleCSCClick}
                            isEdit={true}
                        />
                    </List>
                </Grid>
                <Grid item xs={9}>
                    <DocTable
                        columns={columns}
                        refreshAction={handleRefreshCSAs}
                        rows={csas}
                        docListTitle="SelectCSA"
                        clickItem={clickItemAction}
                        doubleClickItem={doubleClickItemAction}
                        isMultiple={false}
                        tableContainerHeight={596}
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

export default CSAPicker;