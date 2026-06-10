import React, { useState, useEffect } from "react";
import {
    Dialog,
    Grid,
    List,
    ListSubheader,
    Tooltip,
    IconButton
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { RefreshIcon } from "../../../component/PubIcon/PubIcon";
import { message } from "mui-message";
import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import EditDClass from "./editDC";
import PubTree from "../../../component/ScInput/ScPub/PubTree";

import { treeToArr } from "../../../utils/tree";
import { reqGetDCList, reqDeleteDC, reqDeleteDCs } from "../../../api/dc";

import { GetLocalCache, InitDocCache } from "../../../storage/db/db";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";
import useContentHeight from "../../../hooks/useContentHeight";

// Document Category
function DocumengCategory() {
    const [rows, setRows] = useState([]);
    const [simpDcs, setSimpDcs] = useState([]);
    const [selectedDcIds, setSelectedDcIds] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        currentDoc: undefined,
        diagOpen: false,
        isNew: false,
        isModify: false
    });
    const filterDcs = rows.filter(dc => selectedDcIds.includes(dc.id));
    const contentHeight = useContentHeight();
    const { t } = useTranslation();

    useEffect(() => {
        async function getData() {
            // Get simplified document category list from local cache
            await InitDocCache("dc");
            let newSimpDcs = await GetLocalCache("dc");
            let newSelectedDcIds = [];
            newSimpDcs.forEach(simpDc => {
                newSelectedDcIds.push(simpDc.id);
            });
            setSimpDcs(newSimpDcs);
            setSelectedDcIds(newSelectedDcIds);
            handleReqDocList();
        }
        getData();
    }, []);

    // Request document category list from server
    const handleReqDocList = async () => {
        const docResp = await reqGetDCList();
        let docList = [];
        if (docResp.status) {
            docList = docResp.data;
        }
        setRows(docList);
    };
    // Get simplified document categories from local cache
    const handleGetSimpDcs = async (isGetAllIds = true) => {
        await InitDocCache("dc");
        // Get simplified document category list from local cache
        let newSimpDcs = await GetLocalCache("dc");
        let newSelectedDcIds = [];
        if (isGetAllIds) {
            newSimpDcs.forEach(simpDc => {
                newSelectedDcIds.push(simpDc.id);
            })
        } else {
            newSelectedDcIds = selectedDcIds;
        }
        setSimpDcs(newSimpDcs);
        setSelectedDcIds(newSelectedDcIds);
    };
    // Close the dialog
    const handleDiagClose = () => {
        setDiagStatus({
            currentDoc: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
    };

    // Actions after clicking the add button in the header
    const handleAddDoc = () => {
        setDiagStatus({
            currentDoc: undefined,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };

    // Actions after clicking the bulk delete button in the header
    const handleDelMultipleAction = async (docs) => {
        const delRes = await reqDeleteDCs(docs);
        if (delRes.status) {
            message.success(t("batchDeleteSuccessful"));           
        }
        // Refresh
        handleGetSimpDcs();
        handleReqDocList();
    };
    // Actions after clicking OK in the add/edit dialog
    const handelAddDocOk = () => {
        setDiagStatus({
            currentDoc: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
        // Refresh
        handleReqDocList();
        handleGetSimpDcs();
    };
    // Actions after clicking the copy add button in the body
    const handleRowCopyAdd = (doc) => {
        setDiagStatus({
            currentDoc: doc,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };
    // Actions after clicking the detail button in the body
    const handleRowDetail = (doc) => {
        setDiagStatus({
            currentDoc: doc,
            diagOpen: true,
            isNew: false,
            isModify: false
        });

    };
    // Actions after clicking the edit button in the body
    const handleRowEdit = (doc) => {
        setDiagStatus({
            currentDoc: doc,
            diagOpen: true,
            isNew: false,
            isModify: true
        });

    };
    // Actions after clicking the delete button in the body
    const handleRowDelete = async (doc) => {
        const delRes = await reqDeleteDC(doc);
        if (delRes.status) {
            message.success(t("deleteSuccessful"));           
        } 
        // Refresh
        handleGetSimpDcs();
        handleReqDocList();
    };
    // Actions after clicking a node in the tree
    const handleEicsTreeClick = async (item, type) => {
        let dcids = [];
        if (type === 0) { // Final level
            dcids.push(item.id);
        } else if (type === 1) { // Parent level
            const tree = [];
            tree.push(item);
            let allChilds = treeToArr(tree);
            allChilds.forEach(item1 => {
                dcids.push(item1.id);
            })
        } else if (type === 3) { // All
            item.forEach(item3 => {
                dcids.push(item3.id);
            })
        }
        setSelectedDcIds(dcids);
    };

    return (
        <React.Fragment>
            <PageTitle pageName={t("MenuDC")} displayHelp={false} helpUrl="#" />
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
                                {t("chooseCategory")}
                                <Tooltip title={t("refresh")} placement="top">
                                    <IconButton onClick={handleGetSimpDcs}>
                                        <RefreshIcon color="primary" />
                                    </IconButton>
                                </Tooltip>
                            </ListSubheader>
                        }
                        sx={{ width: "100%", height: contentHeight, overflow: "auto", p: 0, ml: 1, borderStyle: "solid", borderWidth: 0, borderColor: "divider", bgcolor: "background.paper" }}
                    >
                        <PubTree
                            docName={t("category")}
                            isDisplayAll={true}
                            oriDocs={simpDcs}
                            onDocClick={handleEicsTreeClick}
                            selectDocIDs={selectedDcIds}
                            onDocDoubleClick={handleEicsTreeClick}
                            isEdit={true}
                        />
                    </List>
                </Grid>
                <Grid item xs={10}>
                    <DocList
                        rows={filterDcs}
                        columns={columns}
                        rowActionsDefine={rowActionsDefine}
                        addAction={handleAddDoc}
                        refreshAction={handleReqDocList}
                        delMultipleDisabled={delMultipleDisabled}
                        delMultipleAction={handleDelMultipleAction}
                        rowEdit={handleRowEdit}
                        rowCopyAdd={handleRowCopyAdd}
                        rowDelete={handleRowDelete}
                        rowViewDetail={handleRowDetail}
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
                <EditDClass
                    isOpen={diagStatus.diagOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriDoc={diagStatus.currentDoc}
                    onCancel={handleDiagClose}
                    onOk={handelAddDocOk}
                />
            </Dialog>
        </React.Fragment>
    );
}

export default DocumengCategory;