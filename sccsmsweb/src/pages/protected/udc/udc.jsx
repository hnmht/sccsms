import { useState, useCallback, useEffect, Fragment } from "react";
import { Dialog } from "@mui/material";
import { message } from "mui-message";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import EditUDC from "./editUDC";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";
import { reqGetUDCList, reqDeleteUDC, reqDeleteUDCs } from "../../../api/udc";
import { InitDocCache } from "../../../storage/db/db";
import { useTranslation } from "react-i18next";

function UserDefineCategory() {
    const [rows, setRows] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        oriUDC: undefined,
        isOpen: false,
        isNew: false,
        isModify: false
    });
    const { t } = useTranslation();

    useEffect(() => {
        async function getData() {
            handleReqUDCList();
        }
        getData();
    }, []);

    // Request UDC list from server.
    const handleReqUDCList = async () => {
        const resp = await reqGetUDCList();
        let newUdcs = [];
        if (resp.status) {
            newUdcs = resp.data;
        }
        setRows(newUdcs);
    };

    // Actions after click the copyAdd button in the body.
    const handleCopyAdd = (item) => {
        setDiagStatus({
            oriUDC: item,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click the add button in the body.
    const handleUDCEdit = (item) => {
        setDiagStatus({
            oriUDC: item,
            isOpen: true,
            isNew: false,
            isModify: true
        });
    }
    // Actions after click the delete button in the body.
    const handleRowDelete = async (item) => {
        const delRes = await reqDeleteUDC(item);
        console.log("delRes:",delRes);
        if (delRes.status) {
            message.success("deleteSuccessful");
            // Get the latest udc list
            handleReqUDCList();
        }
        // Update the front-end cache
        await InitDocCache("udc");
    }
    // Actions after click the view button in the body.
    const handleUDCDetail = (item) => {
        setDiagStatus({
            oriUDC: item,
            isOpen: true,
            isNew: false,
            isModify: false
        });
    }

    // Close dialog
    const handleDiagClose = useCallback(() => {
        setDiagStatus({
            oriUDC: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
    }, []);

    // Actions after click the Add button in the head.
    const handleAddUDClass = () => {
        setDiagStatus({
            oriUDC: undefined,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click the Batch delete button in the head.
    const handleDelMultiple = async (udcs) => {
        const delRes = await reqDeleteUDCs(udcs);
        if (delRes.status) {
            message.success(t("batchDeleteSuccessful"));
            // Get latest UDC list
            handleReqUDCList();
        }
        // Update the front-end cache
        await InitDocCache("udc");
    }
    // Actions after click ok button in the dialog.
    const handelAddUDCOk = useCallback(() => {
        setDiagStatus({
            oriUDC: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
        // Get latest UDC list.
        handleReqUDCList();
    }, []);


    return (
        <Fragment>
            <PageTitle pageName={t("MenuUDC")} displayHelp={false} helpUrl="#" />
            <Divider my={2} />
            <DocList
                rows={rows}
                columns={columns}
                addAction={handleAddUDClass}
                refreshAction={handleReqUDCList}
                rowActionsDefine={rowActionsDefine}
                delMultipleDisabled={delMultipleDisabled}
                delMultipleAction={handleDelMultiple}
                rowCopyAdd={handleCopyAdd}
                rowEdit={handleUDCEdit}
                rowDelete={handleRowDelete}
                rowViewDetail={handleUDCDetail}
            />
            <Dialog
                maxWidth="sm"
                fullWidth
                onClose={handleDiagClose}
                open={diagStatus.isOpen}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 800 } }}
                closeAfterTransition={false}
            >
                <EditUDC
                    diagStatus={diagStatus}
                    onCancel={handleDiagClose}
                    onOk={handelAddUDCOk}
                />
            </Dialog>
        </Fragment>
    );
}

export default UserDefineCategory;