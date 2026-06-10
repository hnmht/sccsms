import { useState, useEffect, useCallback, Fragment } from "react";
import {
    Dialog,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { message } from "mui-message";
import { reqGetRoles, reqDeleteRole, reqDeleteRoles } from "../../../api/role";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import EditRole from "./editRole";
import DocList from "../../../component/DocList/DocList";
import { rowActionsDefine, columns, delMultipleDisabled } from "./constructor";
// Role list
const Role = () => {
    const [rows, setRows] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        currentRole: undefined,
        diagOpen: false,
        isNew: false,
        isModify: false
    });
    const { t } = useTranslation();

    useEffect(() => {
        async function getData() {
            await handleReqRoleList();
        }
        getData();
    }, []);
    // Get Role list from server
    const handleReqRoleList = async () => {
        const res = await reqGetRoles();
        let newRoles = [];
        if (res.status) {
            newRoles = res.data;
        }
        setRows(newRoles);
    };
    // Actions after clicking the Add button in the table header.
    const handleAddRole = () => {
        setDiagStatus({
            currentRole: undefined,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };
    // Actions After clicking the batch delete button in the table header.
    const handleDelMultiple = async (items) => {
        const delRes = await reqDeleteRoles(items);
        if (delRes.status) {
            message.success(t("batchDeleteSuccessful"));
        } else {
            message.error(t("batchDeleteFailed") + delRes.msg);
        }
        handleReqRoleList();
    };
    // Actions After clicking the CopyAdd button in the table body.
    const handleRowCopyAdd = (item) => {
        setDiagStatus({
            currentRole: item,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };
    // Actions after clicking the View button in the table body.
    const handleRowView = (item) => {
        setDiagStatus({
            currentRole: item,
            diagOpen: true,
            isNew: false,
            isModify: false
        });
    };
    // Actions after clicking the Edit button in the table body.
    const handleRowEdit = (item) => {
        setDiagStatus({
            currentRole: item,
            diagOpen: true,
            isNew: false,
            isModify: true
        });
    };
    // Actions after clicking the Delete button in the table body.
    const handleRowDelete = async (item) => {
        const delRes = await reqDeleteRole(item);
        if (delRes.status) {
            message.success(t("deleteSuccessful"));
        } else {
            message.error(t("deleteFailed") + delRes.msg);
        }
        handleReqRoleList();
    };
    // Close dialog.
    const handleDiagClose = () => {
        setDiagStatus({
            currentRole: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
    };
    // Actions after clicking the Ok button in the dialog.
    const handleAddRoleOk = useCallback(() => {
        setDiagStatus({
            currentRole: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
        // Refresh roles list.
        handleReqRoleList();
    }, []);    
    return (
        <Fragment>
            <PageTitle pageName="MenuRole" displayHelp={true} helpUrl="/helps/role" />
            <Divider my={2} />
            <DocList
                rows={rows}
                columns={columns}
                addAction={handleAddRole}
                refreshAction={handleReqRoleList}
                rowActionsDefine={rowActionsDefine}
                delMultipleDisabled={delMultipleDisabled}
                delMultipleAction={handleDelMultiple}
                docListTitle="roleList"
                rowCopyAdd={handleRowCopyAdd}
                rowViewDetail={handleRowView}
                rowEdit={handleRowEdit}
                rowDelete={handleRowDelete}
            />
            <Dialog
                onClose={handleDiagClose}
                open={diagStatus.diagOpen}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 1024 } }}
                closeAfterTransition={false}
            >
                <EditRole
                    isOpen={diagStatus.diagOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriRole={diagStatus.currentRole}
                    onCancel={handleDiagClose}
                    onOk={handleAddRoleOk}
                />
            </Dialog>
        </Fragment>
    );
};


export default Role;