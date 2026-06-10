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
import { useTranslation } from "react-i18next";
import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import EditCSC from "./editCSC";
import PubTree from "../../../component/ScInput/ScPub/PubTree";

import { treeToArr } from "../../../utils/tree";
import { reqGetCSCList, reqDeleteCSC, reqDeleteCSCs } from "../../../api/csc";
import { GetLocalCache, InitDocCache } from "../../../storage/db/db";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";
import useContentHeight from "../../../hooks/useContentHeight";

// Construction Site Category
function CSC() {
    const [rows, setRows] = useState([]);
    const [simpCscs, setSimpCscs] = useState([]);
    const [selectedCscIds, setSelectedCscIds] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        currentDoc: undefined,
        diagOpen: false,
        isNew: false,
        isModify: false
    });
    const filterCscs = rows.filter(sic => selectedCscIds.includes(sic.id));
    const contentHeight = useContentHeight();
    const { t } = useTranslation();

    useEffect(() => {
        async function getData() {
            // Get the CSC list from the front-end cache
            await InitDocCache("csc");
            let newSimpCscs = await GetLocalCache("csc");
            let newSelectedCscIds = [];
            newSimpCscs.forEach(simpCsc => {
                newSelectedCscIds.push(simpCsc.id);
            });
            setSimpCscs(newSimpCscs);
            setSelectedCscIds(newSelectedCscIds);
            handleReqDocList();
        }
        getData();
    }, []);

    // Request the CSC list from the sever
    const handleReqDocList = async () => {
        const docResp = await reqGetCSCList();
        let docList = [];
        if (docResp.status) {
            docList = docResp.data;
        }
        setRows(docList);
    };
    // Get the simple CSC list from front-end cache
    const handleGetSimpCscs = async (isGetAllIds = true) => {
        await InitDocCache("csc");
        let newSimpCscs = await GetLocalCache("csc");
        let newSelectedCscIds = [];
        if (isGetAllIds) {
            newSimpCscs.forEach(simpCsc => {
                newSelectedCscIds.push(simpCsc.id);
            })
        } else {
            newSelectedCscIds = selectedCscIds;
        }
        setSimpCscs(newSimpCscs);
        setSelectedCscIds(newSelectedCscIds);
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

    // Actions after click the add button in the header.
    const handleAddDoc = () => {
        setDiagStatus({
            currentDoc: undefined,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };

    // Actions after click the batch delete button in the header.
    const handleDelMultipleAction = async (docs) => {
        const delRes = await reqDeleteCSCs(docs, true);
        if (delRes.status) {
            message.success(t('batchDeleteSuccessful'));
        }
        // Refresh
        handleGetSimpCscs();
        handleReqDocList();
    };
    // Actions after click the ok button in the dialog.
    const handelAddDocOk = () => {
        setDiagStatus({
            currentDoc: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
        // Refresh
        handleReqDocList();
        handleGetSimpCscs();
    };
    // Actions after click the copyAdd button in the body.
    const handleRowCopyAdd = (doc) => {
        setDiagStatus({
            currentDoc: doc,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click the detail button in the body.
    const handleRowDetail = (doc) => {
        setDiagStatus({
            currentDoc: doc,
            diagOpen: true,
            isNew: false,
            isModify: false
        });

    };
    // Actions after click the edit button in the body.
    const handleRowEdit = (doc) => {
        setDiagStatus({
            currentDoc: doc,
            diagOpen: true,
            isNew: false,
            isModify: true
        });

    };
    // Actions after click the delete button in the body.
    const handleRowDelete = async (doc) => {
        const delRes = await reqDeleteCSC(doc);
        if (delRes.status) {
            message.success(t("deleteSuccessful"));            
        } 
        // Refresh
        handleGetSimpCscs();
        handleReqDocList();
    };
    
    // Actions after the tree view item selected
    const handleCscsTreeClick = async (item, type) => {
        let sicIds = [];
        if (type === 0) { // Final level
            sicIds.push(item.id);
        } else if (type === 1) { // Parent level
            const tree = [];
            tree.push(item);
            let allChilds = treeToArr(tree);
            allChilds.forEach(item1 => {
                sicIds.push(item1.id);
            })
        } else if (type === 3) { // All
            item.forEach(item3 => {
                sicIds.push(item3.id);
            })
        }
        setSelectedCscIds(sicIds);
    };

    return (
        <React.Fragment>
            <PageTitle pageName={t("MenuCSC")} displayHelp={false} helpUrl="#" />
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
                                    <IconButton onClick={handleGetSimpCscs}>
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
                            oriDocs={simpCscs}
                            onDocClick={handleCscsTreeClick}
                            selectDocIDs={selectedCscIds}
                            onDocDoubleClick={handleCscsTreeClick}
                            isEdit={true}
                        />
                    </List>
                </Grid>
                <Grid item xs={10}>
                    <DocList
                        rows={filterCscs}
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
                <EditCSC
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

export default CSC;