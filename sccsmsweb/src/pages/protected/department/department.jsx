import { Fragment, useEffect, useState } from "react";
import {
    Dialog,
    Grid,
    List,
    ListSubheader,
    Tooltip,
    IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { RefreshIcon } from "../../../component/PubIcon/PubIcon";
import { reqGetDepts, reqDelDept, reqDeleteDepts } from "../../../api/department";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import PubTree from "../../../component/ScInput/ScPub/PubTree";
import EditDept from "./editDept";
import { treeToArr } from "../../../utils/tree";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";
import { message } from "mui-message";
import { InitDocCache, GetLocalCache } from "../../../storage/db/db";
import useContentHeight from "../../../hooks/useContentHeight";

const Department = () => {
    const [depts, setDepts] = useState([]);
    const [simpDepts, setSimpDepts] = useState([]);
    const [selectedDeptIds, setSelectedDeptIds] = useState([]);
    const { t } = useTranslation();
    const [diagStatus, setDiagStatus] = useState({
        currentDept: undefined,
        diagOpen: false,
        isNew: false,
        isModify: false
    });

    const filterDepts = depts.filter(dept => selectedDeptIds.includes(dept.id));
    const contentHeight = useContentHeight();

    useEffect(() => {
        async function getData() {
            // Get  department list from local cache
            await InitDocCache("department");
            let newSimpDepts = await GetLocalCache("department");
            // Get all department IDs
            let newSelectedIds = [];
            newSimpDepts.forEach(simpDept => {
                newSelectedIds.push(simpDept.id);
            });
            setSimpDepts(newSimpDepts);
            setSelectedDeptIds(newSelectedIds);
            // Request latest Department list from server            
            handleGetDepts();
        }
        getData();
    }, []);

    // Request Department list from server
    const handleGetDepts = async () => {
        const resp = await reqGetDepts();
        let newDepts = [];
        if (resp.status) {
            newDepts = resp.data;
        }
        setDepts(newDepts);
    };

    // Get simple department list from front-end cache
    const handlegetSimpDepts = async (isGetAllIds = true) => {
        await InitDocCache("department");   
        const newSimpDepts = await GetLocalCache("department");
        let newIds = [];
        if (isGetAllIds) {
            newSimpDepts.forEach(simpDept => {
                newIds.push(simpDept.id);
            })
        } else {
            newIds = selectedDeptIds;
        }
        setSimpDepts(newSimpDepts);
        setSelectedDeptIds(newIds);
    };

    // Actions after click the Add button in the header
    const handleAddDept = () => {
        setDiagStatus({
            isNew: true,
            isModify: false,
            currentDept: undefined,
            diagOpen: true
        });
    };

    // Actions after click Add button in the body
    const handelAddDeptOk = () => {
        setDiagStatus({
            diagOpen: false,
            isModify: false,
            isNew: false,
            currentDept: undefined
        });

        // Request latest department list
        handleGetDepts();
        handlegetSimpDepts(true);
    };

    // Close Dialog
    const handleDiagClose = () => {
        setDiagStatus({
            currentDept: undefined,
            isModify: false,
            isNew: false,
            diagOpen: false
        });
    };

    // Actions after click the edit button in the body
    const handleDeptEdit = (item) => {
        setDiagStatus({
            isNew: false,
            isModify: true,
            currentDept: item,
            diagOpen: true
        });
    };
    // Actions after click the copy add button in the body
    const handleCopyAdd = (item) => {
        setDiagStatus({
            isNew: true,
            isModify: false,
            currentDept: item,
            diagOpen: true
        });
    };
    // Actions after click the delete button in the body
    const handleRowDelete = async (item) => {
        const delRes = await reqDelDept(item);
        if (delRes.status) {
            message.success(t("deleteSuccessful"));
        } 
        // Request latest department from server
        handleGetDepts();
        // Request latest department using froent-end cache
        handlegetSimpDepts(true);
    };
    // Actions after click the batch delete button in the heaser
    const handleDelMultipleAction = async (depts) => {
        const delRes = await reqDeleteDepts(depts);
        if (delRes.status) {
            message.success(t("batchDeleteSuccessful"));
        } else {
            message.error(t("batchDeletefailed") + delRes.msg);
        }
        // Request latest department from server
        handleGetDepts();
        // Request latest department using froent-end cache
        handlegetSimpDepts(true);
    };

    // Actions after click the detail button in the body
    const handleDeptDetail = (item) => {
        setDiagStatus({
            isNew: false,
            isModify: false,
            currentDept: item,
            diagOpen: true
        });
    };

    // Actions after department click in the pubTree component
    const handleDeptClick = async (item, type) => {
        let deptIds = [];
        if (type === 0) { // Final level
            deptIds.push(item.id);
        } else if (type === 1) { // Parent level
            const tree = [];
            tree.push(item);
            let allChilds = treeToArr(tree);
            allChilds.forEach(item1 => {
                deptIds.push(item1.id);
            })
        } else if (type === 3) { // All
            item.forEach(item3 => {
                deptIds.push(item3.id);
            })
        }
        setSelectedDeptIds(deptIds);
    };

    return (
        <Fragment>
            <PageTitle pageName={t("MenuDepartment")} displayHelp={false} />
            <Divider my={2} />
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
                                    <IconButton onClick={handlegetSimpDepts}>
                                        <RefreshIcon color="primary" />
                                    </IconButton>
                                </Tooltip>
                            </ListSubheader>
                        }
                        sx={{ width: "100%", height: contentHeight, overflow: "auto", p: 0, ml: 1, borderStyle: "solid", borderWidth: 0, borderColor: "divider", bgcolor: "background.paper" }}
                    >
                        <PubTree
                            docName={t("department")}
                            isDisplayAll={true}
                            oriDocs={simpDepts}
                            onDocClick={handleDeptClick}
                            selectDocIDs={selectedDeptIds}
                            onDocDoubleClick={handleDeptClick}
                            isEdit={true}
                        />
                    </List>
                </Grid>
                <Grid item xs={10}>
                    <DocList
                        rows={filterDepts}
                        columns={columns}
                        rowActionsDefine={rowActionsDefine}
                        delMultipleDisabled={delMultipleDisabled}
                        delMultipleAction={handleDelMultipleAction}
                        addAction={handleAddDept}
                        rowEdit={handleDeptEdit}
                        refreshAction={handleGetDepts}
                        rowCopyAdd={handleCopyAdd}
                        rowDelete={handleRowDelete}
                        rowViewDetail={handleDeptDetail}
                    />
                </Grid>
            </Grid>
            <Dialog
                maxWidth="sm"
                fullWidth
                onClose={handleDiagClose}
                open={diagStatus.diagOpen}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 800 } }}
                closeAfterTransition={false}
            >
                <EditDept
                    isOpen={diagStatus.diagOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriDept={diagStatus.currentDept}
                    onCancel={handleDiagClose}
                    onOk={handelAddDeptOk}
                />
            </Dialog>
        </Fragment>
    );
}

export default Department;