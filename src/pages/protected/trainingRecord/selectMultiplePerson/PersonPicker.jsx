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
import { RefreshIcon } from "../../../../component/PubIcon/PubIcon";
import { InitDocCache, GetLocalCache, GetCacheAnyOf } from "../../../../storage/db/db";
import PubTree from "../../../../component/ScInput/ScPub/PubTree";
import DocTable from "../../../../component/DocTable/DocTable";
import { treeToArr } from "../../../../utils/tree";
import { columns } from "./tableConstructor";

const personName = "person";
const deptName = "department";

const PersonPicker = ({ cancelClickAction, okClickAction, t }) => {
    const [persons, setPersons] = useState([]);
    const [depts, setDepts] = useState([]);
    const [selectedDeptIds, setSelectedDeptIds] = useState([]);
    const [currentItems, setCurrentItems] = useState([]);

    useEffect(() => {
        async function getLocalDepts() {
            const newDepts = await GetLocalCache(deptName);
            setDepts(newDepts);
        }
        getLocalDepts();
    }, []);

    // Actions after clicking Department
    const handleDeptClick = async (item, type) => {
        //type meanings: 0 Leaf; 1 Parent; 3 All
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
        // Get Persons data from front end cache
        const localPersons = await GetCacheAnyOf(personName, "deptID", deptIds);
        setPersons(localPersons);
        setSelectedDeptIds(deptIds);
    };
    // Refresh department tree
    const handleRefreshDepts = async () => {
        // Request the latest department list from backend
        await InitDocCache(deptName);
        // Get department list from front end cache
        const newDepts = await GetLocalCache(deptName);
        setDepts(newDepts);
    };
    // Refresh person list 
    const handleRefreshPersons = async () => {
        // Request the latest person list from backend
        await InitDocCache(personName);
        // Get Persons list from front end cache
        const newPersons = await GetCacheAnyOf(personName, "deptID", selectedDeptIds);
        // refresh
        setPersons(newPersons);
    };
    // Actions after choose items
    const handleSelectItems = (items) => {
        setCurrentItems(items);
    };

    return (
        <>
            <DialogTitle>{`${t("choosePerson")}(${t("selectMultiplePeople", { count: currentItems.length })})`}</DialogTitle>
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
                                {t("chooseDept")}
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
                            docName={t("department")}
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
                        docListTitle="choosePerson"
                        isMultiple={true}
                        selectItem={handleSelectItems}
                        tableContainerHeight={596}
                    />
                </Grid>
            </Grid>
            <DialogActions sx={{ m: 1 }}>
                <Button color="error" onClick={cancelClickAction} >{t("cancel")}</Button>
                <Button variant="contained" disabled={currentItems.length === 0} onClick={() => okClickAction(currentItems)}>{t("ok")}</Button>
            </DialogActions>
        </>
    );
};

export default PersonPicker;