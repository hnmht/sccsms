import React, { useState, useEffect } from "react";
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
import { columns } from "./tableConstructor";

const personName = "person";
const deptName = "department";

const PersonPicker = ({ clickItemAction, doubleClickItemAction, cancelClickAction, okClickAction, currentItem }) => {
    const { t } = useTranslation();
    const [persons, setPersons] = useState([]);
    const [depts, setDepts] = useState([]);
    const [selectedDeptIds, setSelectedDeptIds] = useState([]);

    useEffect(() => {
        async function getLocalDepts() {
            const newDepts = await GetLocalCache(deptName);
            setDepts(newDepts);
        }
        getLocalDepts();
    }, []);

    // Actions after clicking Department
    const handleDeptClick = async (item, type) => {
        // type mmeanings:
        // 0: Leaf
        // 1: Parent 
        // 3: All
        let deptIds = [];
        if (type === 0) {
            deptIds.push(item.id);
        } else if (type === 1) {
            const tree = [];
            tree.push(item);
            let allChilds = treeToArr(tree);
            allChilds.forEach(item1 => {
                deptIds.push(item1.id);
            })
        } else if (type === 3) {
            item.forEach(item3 => {
                deptIds.push(item3.id);
            })
            deptIds.push(0);
        }
        // Get Local Person Master Data cache
        const localPersons = await GetCacheAnyOf(personName, "deptID", deptIds);
        setPersons(localPersons);
        setSelectedDeptIds(deptIds);
    };
    // Refresh department tree.
    const handleRefreshDepts = async () => {
        // Request the latest Person Master Data from the server
        await InitDocCache(deptName);
        // Get Local Person Master Data
        const newDepts = await GetLocalCache(deptName);       
        setDepts(newDepts);
    };
    // Refresh Person Master Data List
    const handleRefreshPersons = async () => {
        // Request the latest Person Master Data from the server
        await InitDocCache(personName);
        // Get Local Person Master Data.
        const newPersons = await GetCacheAnyOf(personName, "deptID", selectedDeptIds);  
        setPersons(newPersons);
    };

    return (
        <>
            <DialogTitle>{t("choosePerson")}</DialogTitle>
            <Grid container spacing={2} >
                <Grid item xs={2}>
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
                                {t("chooseDepartment")}
                                <Tooltip title={t("refresh")} placement="top">
                                    <IconButton onClick={handleRefreshDepts}>
                                        <RefreshIcon color="primary" />
                                    </IconButton>
                                </Tooltip>
                            </ListSubheader>
                        }
                        sx={{ width: "100%", height: 700, overflow: "auto", p: 0, ml: 1, borderStyle: "solid", borderWidth: 1, borderColor: "divider", bgcolor: "background.paper" }}
                    >
                        <PubTree
                            docName={t("allDept")}
                            isDisplayAll={true}
                            oriDocs={depts}
                            onDocClick={handleDeptClick}
                            selectDocIDs={selectedDeptIds}
                            onDocDoubleClick={handleDeptClick}
                            isEdit={true}
                        />
                    </List>
                </Grid>
                <Grid item xs={10}>
                    <DocTable
                        columns={columns}
                        refreshAction={handleRefreshPersons}
                        rows={persons}
                        docListTitle="selectPerson"
                        clickItem={clickItemAction}
                        doubleClickItem={doubleClickItemAction}
                        isMultiple={false}
                        tableContainerHeight={596}
                    />
                </Grid>
            </Grid>
            <DialogActions sx={{ m: 1 }}>
                <Button key="personPickerCancel" color="error" onClick={cancelClickAction} id="personPickerCancel">{t("cancel")}</Button>
                <Button key="personPickerOk" variant="contained" disabled={currentItem.id === 0} onClick={okClickAction}>{t("ok")}</Button>
            </DialogActions>
        </>
    );
};

export default PersonPicker;