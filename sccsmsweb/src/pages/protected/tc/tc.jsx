import { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "@mui/material";
import { message } from "mui-message";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import EditTC from "./editTC";
import { reqDeleteTC, reqDeleteTCs, reqGetTCList } from "../../../api/tc";

import { InitDocCache } from "../../../storage/db/db";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";


// Training Course 
const TC = () => {
    const [rows, setRows] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        currentDoc: undefined,
        diagOpen: false,
        isNew: false,
        isModify: false
    });
    const { t } = useTranslation();

    useEffect(() => {
        handleReqDocList();
    }, []);

    // Request Training Course list
    const handleReqDocList = async () => {
        const res = await reqGetTCList();
        let newTcs = [];
        if (res.status) {
            newTcs = res.data;
        }
        setRows(newTcs);
        InitDocCache("tc");
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

    // Actions after click Add button in header
    const handleAddDoc = () => {
        setDiagStatus({
            currentDoc: undefined,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };

    // Actions after click batch delete button in header
    const handleDelMultipleAction = async (docs) => {
        const delRes = await reqDeleteTCs(docs);
        if (delRes.status) {
            message.success(t("batchDeleteSuccessful"));
        }
        // refresh
        handleReqDocList();
    };
    // Actions after click OK button in dialog
    const handelAddDocOk = () => {
        setDiagStatus({
            currentDoc: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
        // refresh
        handleReqDocList();
    };
    // Actions after click copyAdd button in table body
    const handleRowCopyAdd = (doc) => {
        setDiagStatus({
            currentDoc: doc,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click detail button in table body
    const handleRowDetail = (doc) => {
        setDiagStatus({
            currentDoc: doc,
            diagOpen: true,
            isNew: false,
            isModify: false
        });

    };
    // Actions after click edit button in table body
    const handleRowEdit = (doc) => {
        setDiagStatus({
            currentDoc: doc,
            diagOpen: true,
            isNew: false,
            isModify: true
        });

    };
    // Actions after click delete button in table body
    const handleRowDelete = async (doc) => {
        const delRes = await reqDeleteTC(doc);
        if (delRes.status) {
            message.success(t("deleteSuccessful"));
        }
        // refresh
        handleReqDocList();
    };
    return (
        <Fragment>
            <PageTitle pageName="MenuTC" displayHelp={false} helpUrl="#" />
            <Divider my={2} />
            <DocList
                rows={rows}
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
            <Dialog
                maxWidth="sm"
                fullWidth
                onClose={handleDiagClose}
                open={diagStatus.diagOpen}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 800 } }}
                closeAfterTransition={false}
            >
                <EditTC
                    isOpen={diagStatus.diagOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriDoc={diagStatus.currentDoc}
                    onCancel={handleDiagClose}
                    onOk={handelAddDocOk}
                />
            </Dialog>
        </Fragment>
    );
}

export default TC;