import { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "@mui/material";
import { message } from "mui-message";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import EditEPT from "./editEPT";
import { InitDocCache, GetLocalCache } from "../../../storage/db/db";
import { columns, rowActionsDefine, delMultipleDisabled } from "./tableConstructor";
import { transEPTToBackend, transEPTsToBackend } from "../../../storage/db/db";
import { reqDeleteEPT, reqDeleteEPTs } from "../../../api/ept";
// Execution Project Template
const EPT = () => {
    const [rows, setRows] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        currentEPT: undefined,
        diagOpen: false,
        isNew: false,
        isModify: false
    });
    const { t } = useTranslation();

    useEffect(() => {
        async function getData() {
            handleGetEPTList();
        }
        getData();
    }, []);
    // Get EPT list
    const handleGetEPTList = async () => {
        // Refresh local cache
        await InitDocCache("ept");
        // Read from local cache
        const epts = await GetLocalCache("ept");
        setRows(epts);
    };
    // Close dialog
    const handleDiagClose = () => {
        setDiagStatus({
            currentEPT: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
    };

    // Actions after click OK button in dialog
    const handleDiagOk = () => {
        setDiagStatus({
            currentEPT: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
        // Refresh EPT list
        handleGetEPTList();
    };
    // Actions after click Add button in header
    const handleAddDoc = () => {
        setDiagStatus({
            currentEPT: undefined,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click batch delete button in header
    const handleDelMultipleAction = async (docs) => {
        const delDocs = await transEPTsToBackend(docs);
        const delRes = await reqDeleteEPTs(delDocs);
        if (delRes.status) {
            message.success(t("batchDeleteSuccessful"));
        }
        // refresh
        handleGetEPTList();
    };
    // Actions after click edit button in table body
    const handleRowEdit = (item) => {
        setDiagStatus({
            currentEPT: item,
            diagOpen: true,
            isNew: false,
            isModify: true
        });

    };
    // Actions after click delete button in table body
    const handleRowDelete = async (item) => {
        const delEPT = await transEPTToBackend(item);
        const delRes = await reqDeleteEPT(delEPT);
        if (delRes.status) {
            message.success(t("deleteSuccessful"));
            handleGetEPTList();
        }
    };
    // Actions after click copyAdd button in table body
    const handleRowCopyAdd = (item) => {
        setDiagStatus({
            currentEPT: item,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click detail button in table body
    const handleRowDetail = (item) => {
        setDiagStatus({
            currentEPT: item,
            diagOpen: true,
            isNew: false,
            isModify: false
        });
    };

    return (
        <Fragment>
            <PageTitle pageName={t("MenuEPT")} displayHelp={false} helpUrl="#" />
            <Divider my={2} />
            <DocList
                rows={rows}
                columns={columns}
                addAction={handleAddDoc}
                refreshAction={handleGetEPTList}
                delMultipleDisabled={delMultipleDisabled}
                delMultipleAction={handleDelMultipleAction}
                rowActionsDefine={rowActionsDefine}
                rowEdit={handleRowEdit}
                rowDelete={handleRowDelete}
                rowCopyAdd={handleRowCopyAdd}
                rowViewDetail={handleRowDetail}
            />
            <Dialog
                maxWidth="lg"
                fullWidth
                fullScreen
                onClose={handleDiagClose}
                open={diagStatus.diagOpen}
                closeAfterTransition={false}
            >
                <EditEPT
                    isOpen={diagStatus.diagOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriEPT={diagStatus.currentEPT}
                    onCancel={handleDiagClose}
                    onOk={handleDiagOk}
                />
            </Dialog>
        </Fragment>
    );
}

export default EPT;