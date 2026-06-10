import { useState, useCallback, useEffect, Fragment } from "react";
import { Dialog } from "@mui/material";
import { message } from "mui-message";
import { useTranslation } from "react-i18next";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import EditOperatingPost from "./editPosition";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";
import { reqGetPositionList, reqDeletePosition, reqDeletePositions } from "../../../api/position";
import { InitDocCache } from "../../../storage/db/db";

const Position = () => {
    const [rows, setRows] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        oriPosition: undefined,
        isOpen: false,
        isNew: false,
        isModify: false
    });
    const { t } = useTranslation()

    useEffect(() => {
        async function getData() {
            handleReqPositionList();
        }
        getData();
    }, []);

    // Request the positon list from the Server
    const handleReqPositionList = async () => {
        const resp = await reqGetPositionList();       
        let newOPs = [];
        if (resp.status) {
            newOPs = resp.data;
        }
        setRows(newOPs);
    };
    // Actions after click the copyAdd button in the body
    const handleCopyAdd = (item) => {
        setDiagStatus({
            oriPosition: item,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click the edit button in the body
    const handleEdit = (item) => {
        setDiagStatus({
            oriPosition: item,
            isOpen: true,
            isNew: false,
            isModify: true
        });
    }
    // Actions after click the delete button in the body
    const handleRowDelete = async (item) => {
        const delRes = await reqDeletePosition(item);
        if (delRes.status) {
            message.success(t("deleteSuccessful"));
            handleReqPositionList();
        }
        // Get latest position front-end cache
        await InitDocCache("position");
    }

    // Actions after click the detail button in the body
    const handleDetail = (item) => {
        setDiagStatus({
            oriPosition: item,
            isOpen: true,
            isNew: false,
            isModify: false
        });
    }

    // Close dialog
    const handleDiagClose = useCallback(() => {
        setDiagStatus({
            oriPosition: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
    }, []);

    // Actions after click the add button in the table header
    const handleAdd = () => {
        setDiagStatus({
            oriPosition: undefined,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click the batch delete button in the table header
    const handleDelMultiple = async (ops) => {
        const delRes = await reqDeletePositions(ops);
        if (delRes.status) {
            message.success(t("batchDeleteSuccessful"));
            // Requste position list
            handleReqPositionList();
        } 
        // Get latest position front-end cache
        await InitDocCache("position");
    }
    // Actions after click the ok button in the dialog
    const handleAddOk = useCallback(() => {
        setDiagStatus({
            oriPosition: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
        // Request position list
        handleReqPositionList();
    }, []);

    return (
        <Fragment>
            <PageTitle pageName={t("MenuPosition")} displayHelp={false} helpUrl="#" />
            <Divider my={2} />
            <DocList
                rows={rows}
                columns={columns}
                addAction={handleAdd}
                refreshAction={handleReqPositionList}
                rowActionsDefine={rowActionsDefine}
                delMultipleDisabled={delMultipleDisabled}
                delMultipleAction={handleDelMultiple}
                rowCopyAdd={handleCopyAdd}
                rowEdit={handleEdit}
                rowDelete={handleRowDelete}
                rowViewDetail={handleDetail}
            />
            <Dialog
                maxWidth="sm"
                fullWidth
                onClose={handleDiagClose}
                open={diagStatus.isOpen}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 800 } }}
                closeAfterTransition={false}
            >
                <EditOperatingPost
                    diagStatus={diagStatus}
                    onCancel={handleDiagClose}
                    onOk={handleAddOk}
                />
            </Dialog>
        </Fragment>
    );
}

export default Position;