import React, { useEffect, useState } from "react";
import {
    Dialog,
} from "@mui/material";
import { message } from "mui-message";
import { useTranslation } from "react-i18next";
import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import EditUser from "./editUser";

import { InitDocCache } from "../../../storage/db/db";
import { reqGetUsers, reqDeleteUser, reqDeleteUsers } from "../../../api/user";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";

const User = () => {
    const { t } = useTranslation();
    const [rows, setRows] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        currentUser: undefined,
        isOpen: false,
        isNew: false,
        isModify: false
    });

    useEffect(() => {
        async function getData() {
            handleGetUsers();
        }
        getData();
    }, []);
    // Get user list
    const handleGetUsers = async () => {
        const resp = await reqGetUsers();
        let newRows = [];
        if (!resp.status) {
            return
        }
        newRows = resp.data;
        setRows(newRows);
    };
    // Actions after click the add button in the table header
    const handleAddUser = () => {
        setDiagStatus({
            currentUser: undefined,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    };

    // Actions after click the ok button in the dialog
    const handelAddUserOk = () => {
        setDiagStatus({
            currentUser: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
        // Get user list
        handleGetUsers();
    };

    // Close dialog
    const handleDiagClose = () => {
        setDiagStatus({
            currentUser: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
    };

    // Action after click the batch delete button in the table header
    const handleDelMultipleAction = async (users) => {
        const delMultipleRes = await reqDeleteUsers(users);
        if (delMultipleRes.status) {
            message.success(t("batchDeleteSuccessful"));            
        } else {
            message.error(t("batchDeletefailed")+ delMultipleRes.msg);
        }
        await InitDocCache("person");
        handleGetUsers();
    };
    // Actions after click the copy add button in the table body.
    const handelCopyAddUser = (item) => {
        setDiagStatus({
            currentUser: item,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    }
    // Actions after click the edit button in the table body.
    const handleUserEdit = (item) => {
        setDiagStatus({
            currentUser: item,
            isOpen: true,
            isNew: false,
            isModify: true
        });
    }
    // Actions after click the delete button in the table body.
    const handleUserDelete = async (item) => {
        const delRes = await reqDeleteUser(item);
        if (delRes.status) {
            message.success(t("deleteSuccessful"));
            handleGetUsers();
        } else {
            message.error(t("deleteFailed") + delRes.msg);
        }
        // Get latest front-end cache
        await InitDocCache("person");
    }
    // Actions after click the view button in the table body.
    const handleUserDetail = (item) => {
        setDiagStatus({
            currentUser: item,
            isOpen: true,
            isNew: false,
            isModify: false
        });
    }

    return (
        <React.Fragment>
            <PageTitle pageName={t("user")} displayHelp={false} />
            <Divider my={2} />
            <DocList
                columns={columns}
                rows={rows}
                addAction={handleAddUser}
                refreshAction={handleGetUsers}
                rowActionsDefine={rowActionsDefine}
                delMultipleDisabled={delMultipleDisabled}
                delMultipleAction={handleDelMultipleAction}
                docListTitle="userList"
                rowCopyAdd={handelCopyAddUser}
                rowViewDetail={handleUserDetail}
                rowEdit={handleUserEdit}
                rowDelete={handleUserDelete}
            />
            <Dialog
                maxWidth="sm"
                fullWidth
                onClose={handleDiagClose}
                open={diagStatus.isOpen}
                closeAfterTransition={false}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 1024 } }}
            >
                <EditUser
                    isOpen={diagStatus.isOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriUser={diagStatus.currentUser}
                    onCancel={handleDiagClose}
                    onOk={handelAddUserOk}
                />
            </Dialog>
        </React.Fragment>
    )
}

export default User;