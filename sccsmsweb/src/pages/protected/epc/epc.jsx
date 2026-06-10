import React, { useState, useEffect } from "react";
import {
    Dialog,
    Grid,
    List,
    ListSubheader,
    Tooltip,
    IconButton
} from "@mui/material";
import { RefreshIcon } from "../../../component/PubIcon/PubIcon";
import { message } from "mui-message";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import EditEPC from "./editEPC";
import PubTree from "../../../component/ScInput/ScPub/PubTree";

import { treeToArr } from "../../../utils/tree";
import { reqGetEPCList, reqDeleteEPC, reqDeleteEPCs } from "../../../api/epc";
import { GetLocalCache, InitDocCache } from "../../../storage/db/db";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";
import useContentHeight from "../../../hooks/useContentHeight";
import { useTranslation } from "react-i18next";

// Execution Project Category
function EPC() {
    const [rows, setRows] = useState([]);
    const [simpEpcs, setSimpEpcs] = useState([]);
    const [selectedEpcIds, setSelectedEpcIds] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        currentDoc: undefined,
        diagOpen: false,
        isNew: false,
        isModify: false
    });
    const filterEpcs = rows.filter(epc => selectedEpcIds.includes(epc.id));
    const contentHeight = useContentHeight();
    const { t } = useTranslation();

    useEffect(() => {
        async function getData() {
            // Get EPC list from front-end cache
            await InitDocCache("epc");
            let newSimpEpcs = await GetLocalCache("epc");
            let newSelectedEpcIds = [];
            newSimpEpcs.forEach(simpEpc => {
                newSelectedEpcIds.push(simpEpc.id);
            });
            setSimpEpcs(newSimpEpcs);
            setSelectedEpcIds(newSelectedEpcIds);
            handleReqDocList();
        }
        getData();
    }, []);

    // Request EPC list from server
    const handleReqDocList = async () => {
        const docResp = await reqGetEPCList();
        let docList = [];
        if (docResp.status) {
            docList = docResp.data;
        }
        setRows(docList);
    };
    // Get SimpEPC list from front-end cache
    const handleGetSimpEpcs = async (isGetAllIds = true) => {
        // Request latest SimpEPC from server
        await InitDocCache("epc");
        // Get SimpEPC from front-end cache
        let newSimpEpcs = await GetLocalCache("epc");
        let newSelectedEpcIds = [];
        if (isGetAllIds) {
            newSimpEpcs.forEach(simpEpc => {
                newSelectedEpcIds.push(simpEpc.id);
            })
        } else {
            newSelectedEpcIds = selectedEpcIds;
        }
        setSimpEpcs(newSimpEpcs);
        setSelectedEpcIds(newSelectedEpcIds);
    };
    // Close dialog
    const handleDiagClose = () => {
        setDiagStatus({
            currentDoc: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
    };

    // Actions after click the Add button in the head
    const handleAddDoc = () => {
        setDiagStatus({
            currentDoc: undefined,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };

    // Actions after click the batch delete button in the head
    const handleDelMultipleAction = async (docs) => {
        const delRes = await reqDeleteEPCs(docs);
        if (delRes.status) {
            message.success(t("batchDeleteSuccessful"));
        } 
        // Refresh data
        handleGetSimpEpcs();
        handleReqDocList();
    };
    //Actions after click ok button in the dialog
    const handelAddDocOk = () => {
        setDiagStatus({
            currentDoc: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
        // Refresh data
        handleReqDocList();
        handleGetSimpEpcs();
    };
    // Actions after click copy add button in the body
    const handleRowCopyAdd = (doc) => {
        setDiagStatus({
            currentDoc: doc,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click detail button in the bdoby
    const handleRowDetail = (doc) => {
        setDiagStatus({
            currentDoc: doc,
            diagOpen: true,
            isNew: false,
            isModify: false
        });

    };
    // Actions after click edit button in the body
    const handleRowEdit = (doc) => {
        setDiagStatus({
            currentDoc: doc,
            diagOpen: true,
            isNew: false,
            isModify: true
        });

    };
    // Actions after click delete button in the body
    const handleRowDelete = async (doc) => {
        const delRes = await reqDeleteEPC(doc);
        if (delRes.status) {
            message.success(t("deleteSuccessful"));
        } 
        // refresh
        handleGetSimpEpcs();
        handleReqDocList();
    };
    // Actions after the tree view item selected
    const handleEicsTreeClick = async (item, type) => {
        let eicIds = [];
        if (type === 0) { // Final level
            eicIds.push(item.id);
        } else if (type === 1) { // Parent Level 
            const tree = [];
            tree.push(item);
            let allChilds = treeToArr(tree);
            allChilds.forEach(item1 => {
                eicIds.push(item1.id);
            })
        } else if (type === 3) { // All
            item.forEach(item3 => {
                eicIds.push(item3.id);
            })
        }
        setSelectedEpcIds(eicIds);
    };

    return (
        <React.Fragment>
            <PageTitle pageName={t("MenuEPC")} displayHelp={false} helpUrl="#" />
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
                                    <IconButton onClick={handleGetSimpEpcs}>
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
                            oriDocs={simpEpcs}
                            onDocClick={handleEicsTreeClick}
                            selectDocIDs={selectedEpcIds}
                            onDocDoubleClick={handleEicsTreeClick}
                            isEdit={true}
                        />
                    </List>
                </Grid>
                <Grid item xs={10}>
                    <DocList
                        rows={filterEpcs}
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
                <EditEPC
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

export default EPC;