import { Fragment, useState, useEffect } from "react";
import { message } from "mui-message";
import { useTranslation } from "react-i18next";
import { Divider } from "../../../component/ScMui/ScMui";
import DocList from "../../../component/DocList/DocList";
import PageTitle from "../../../component/PageTitle/PageTitle";
import { reqGetOnlineUsers, reqRemoveOnlineUser } from "../../../api/onlineUser";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";


const OnlineUser = () => {
    const [rows, setRows] = useState([]);
    const { t } = useTranslation();
    useEffect(() => {
        async function getData() {
            handleGetOnlineUsers();
        }
        getData();
    }, []);
    // Request the Online user list from the server.
    const handleGetOnlineUsers = async () => {
        const resp = await reqGetOnlineUsers();
        let newRows = [];
        if (resp.status) {
            newRows = resp.data;
        }
        setRows(newRows);
    };
    // Destory Online user login credentials .
    const handleKickOutUser = async (item) => {
        const delRes = await reqRemoveOnlineUser(item);
        if (delRes.status) {
            message.success("successful");
        }
        // Get Online user list from backend
        await handleGetOnlineUsers();
    };

    return (
        <Fragment>
            <PageTitle pageName={t("MenuOU")} displayHelp={false} />
            <Divider my={2} />
            <DocList
                columns={columns}
                rows={rows}
                refreshAction={handleGetOnlineUsers}
                rowActionsDefine={rowActionsDefine}
                selectColumnVisible={false}
                headAddVisible={false}
                headDelMultipleVisible={false}
                delMultipleDisabled={delMultipleDisabled}
                docListTitle="onlineUser"
                rowDelete={handleKickOutUser}
            />
        </Fragment>
    );
};

export default OnlineUser;