import React, { useState } from "react";
import {
    Grid,
    Dialog,
} from "@mui/material";
import { message } from "mui-message";

import { Divider } from "../../../component/ScMui/ScMui";
import DocList from "../../../component/DocList/DocList";
import EpcTree from "./epcTree";
import EditEP from "./editEPA";
import PageTitle from "../../../component/PageTitle/PageTitle";

import { GetEPCacheByCategoryId, InitDocCache, transEPsToBackend, transEPToBackend } from "../../../storage/db/db";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";
import { reqDeleteEP, reqDeleteEPs } from "../../../api/epa";
import { useTranslation } from "react-i18next";

// Execution Project 
const EPA = () => {
    const [epas, setEpas] = useState([]);
    const [epc, setEpc] = useState(undefined);
    const [diagStatus, setDiagStatus] = useState({
        currentEP: undefined,
        diagOpen: false,
        isNew: false,
        isModify: false
    });
    const {t} = useTranslation();

    // Close Dialog
    const handleDiagClose = () => {
        setDiagStatus({
            currentEP: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
    };

    // Get Excution Project Archive by EPC id
    const handleGetCurrentEpc = async (item) => {
        setEpc(item);
        const newEpas = await GetEPCacheByCategoryId(item.id);
        setEpas(newEpas);
    };
    // Refresh EP list
    const handleGetEPList = async (item = epc) => {
        // Request latest EP fromt-end cache
        await InitDocCache("epa");
        // Get EP list by EPC id from cache
        const newEpas = await GetEPCacheByCategoryId(item.id);
        setEpas(newEpas);
    };
    // Actions after click ok button in the dialog
    const handelAddEPOk = () => {
        setDiagStatus({
            currentEP: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
        // Refresh EP list
        handleGetEPList(epc);
    };
    // Actions after click Add button in the head
    const handleAddEPoc = () => {
        setDiagStatus({
            currentEP: undefined,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click batch delete button in the head
    const handleDelMultipleAction = async (docs) => {
        const delDocs = await transEPsToBackend(docs);
        const delRes = await reqDeleteEPs(delDocs);
        if (delRes.status) {
            message.success(t("batchDeleteSuccessful"));
        } 
        // Refresh EP list
        handleGetEPList();
    };
    // Actions after click Copy Add Action in the body
    const handleRowCopyAdd = (doc) => {
        setDiagStatus({
            currentEP: doc,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click Detail button in the body
    const handleRowDetail = (doc) => {
        setDiagStatus({
            currentEP: doc,
            diagOpen: true,
            isNew: false,
            isModify: false
        });
    };
    // Actions after click Edit buttion in the body
    const handleRowEdit = async (doc) => {
        setDiagStatus({
            currentEP: doc,
            diagOpen: true,
            isNew: false,
            isModify: true
        });
    };
    // Actions after click Delete button in the body
    const handleRowDelete = async (doc) => {
        // Convert the data into a format usable by the backend 
        const backendDoc = await transEPToBackend(doc);
        // Requst the backend to delete this data
        const delRes = await reqDeleteEP(backendDoc);
        if (delRes.status) {
            message.success(t("deleteSuccessful"));
        } 
        // Refresh EP list
        handleGetEPList();
    }

    return (
        <React.Fragment>
            <PageTitle pageName={t("MenuEP")} displayHelp={false} helpUrl="#" />
            <Divider my={2} />
            <Grid container spacing={2}>
                <Grid item xs={2} >
                    <EpcTree
                        selectOk={handleGetCurrentEpc}
                    />
                </Grid>
                <Grid item xs={10}>
                    <DocList
                        headAddDisabled={!epc || epc.status !== 0}
                        headRefreshDisabled={!epc}
                        delMultipleDisabled={delMultipleDisabled}
                        delMultipleAction={handleDelMultipleAction}
                        columns={columns}
                        rows={epas}
                        rowActionsDefine={rowActionsDefine}
                        addAction={handleAddEPoc}
                        refreshAction={() => handleGetEPList(epc)}
                        rowCopyAdd={handleRowCopyAdd}
                        rowViewDetail={handleRowDetail}
                        rowEdit={handleRowEdit}
                        rowDelete={handleRowDelete}
                    />
                </Grid>
            </Grid>
            <Dialog
                maxWidth="sm"
                onClose={handleDiagClose}
                open={diagStatus.diagOpen}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 800, minHeight: 512 } }}
                closeAfterTransition={false}
            >
                <EditEP
                    isOpen={diagStatus.diagOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriEP={diagStatus.currentEP}
                    EPC={epc}
                    onCancel={handleDiagClose}
                    onOk={handelAddEPOk}
                />
            </Dialog>
        </React.Fragment>
    );
}

export default EPA;