import { useState, useCallback, useEffect, Fragment } from "react";
import { Dialog } from "@mui/material";
import { useTranslation } from "react-i18next";
import { message } from "mui-message";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import EditPPE from "./editPPE";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";

import { reqGetPPEList, reqDeletePPE, reqDeletePPEs } from "../../../api/ppe";
import { InitDocCache } from "../../../storage/db/db";

// Personal Protective Equipment
const PPE = () => {
    const [rows, setRows] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        oriPPE: undefined,
        isOpen: false,
        isNew: false,
        isModify: false
    });
    const {t} = useTranslation();

    useEffect(() => {
        async function getData() {
            handleReqPPEList();
        }
        getData();
    }, []);

    // Request PPE list from server
    const handleReqPPEList = async () => {
        const resp = await reqGetPPEList();
        let newPPEs = [];
        if (resp.status) {
            newPPEs = resp.data;
        }
        setRows(newPPEs);
    };

    // Actions after click the copyAdd button in the body
    const handleCopyAdd = (item) => {
        setDiagStatus({
            oriPPE: item,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click the Edit button in the body
    const handlePPEEdit = (item) => {
        setDiagStatus({
            oriPPE: item,
            isOpen: true,
            isNew: false,
            isModify: true
        });
    }
    // Actions after click the Delete button in the body
    const handleRowDelete = async (item) => {
        const delRes = await reqDeletePPE(item);
        if (delRes.status) {
            message.success(t("delSuccessfule"));
            // Refresh
            handleReqPPEList();
        } 
        // Sync the front-end cache with server
        await InitDocCache("ppe");
    }
    // Actions after click the Detail button in the body
    const handleOPDetail = (item) => {
        setDiagStatus({
            oriPPE: item,
            isOpen: true,
            isNew: false,
            isModify: false
        });
    }

    // Close dialog
    const handleDiagClose = useCallback(() => {
        setDiagStatus({
            oriPPE: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
    }, []);

    // Actions after click the add button in the header
    const handleAddPPE = () => {
        setDiagStatus({
            oriPPE: undefined,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click the batch delete button in the header
    const handleDelMultiple = async (lps) => {
        const delRes = await reqDeletePPEs(lps);
        if (delRes.status) {
            message.success(t("batchDelSuccessful"));
            // Refresh
            handleReqPPEList();
        } 
        // Sync the front-end cache with server
        await InitDocCache("ppe");
    }
    // Actions after click ok button in the dialog
    const handleAddPPEOk = useCallback(() => {
        setDiagStatus({
            oriPPE: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
        // Request the latest PPE list
        handleReqPPEList();
    }, []);


    return (
        <Fragment>
            <PageTitle pageName={t("MenuPPE")} displayHelp={false} helpUrl="#" />
            <Divider my={2} />
            <DocList
                rows={rows}
                columns={columns}
                addAction={handleAddPPE}
                refreshAction={handleReqPPEList}
                rowActionsDefine={rowActionsDefine}
                delMultipleDisabled={delMultipleDisabled}
                delMultipleAction={handleDelMultiple}
                rowCopyAdd={handleCopyAdd}
                rowEdit={handlePPEEdit}
                rowDelete={handleRowDelete}
                rowViewDetail={handleOPDetail}
            />
            <Dialog
                maxWidth="sm"
                fullWidth
                onClose={handleDiagClose}
                open={diagStatus.isOpen}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 800 } }}
                closeAfterTransition={false}
            >
                <EditPPE
                    diagStatus={diagStatus}
                    onCancel={handleDiagClose}
                    onOk={handleAddPPEOk}
                />
            </Dialog>
        </Fragment>
    );
}

export default PPE;