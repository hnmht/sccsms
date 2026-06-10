import { useState, useMemo } from "react";
import {
    Card,
    CardContent,
    Box,
    Dialog
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Divider } from "../../../component/ScMui/ScMui";
import { message } from "mui-message";
import { getDynamicMessages } from "../../../store/pub";

import { QueryPanel, transConditionsToString } from "../../../component/QueryPanel";
import PageTitle from "../../../component/PageTitle/PageTitle";
import MessageToolBar from "./messageToolBar";
import UnReadMessage from "./unReadMessage";
import ReadMessage from "./readMessage";
import { reqToReadMsg, reqReadComments } from "../../../api/message";
import { generateMSGQueryFields, generateMsgDefaultCons } from "./constructor";
import useContentHeight from "../../../hooks/useContentHeight";

const Message = () => {
    const [viewIndex, setViewIndex] = useState(0);
    // Message
    const [readMsgs, setReadMsgs] = useState([]);
    const [diagOpen, setDiagOpen] = useState(false);
    const [conditions, setConditions] = useState(generateMsgDefaultCons());
    const queryFields = useMemo(generateMSGQueryFields, []);
    const { t } = useTranslation();
    const contentHeight = useContentHeight();
    // Table
    const handleViewIndexChange = (newValue) => {
        setViewIndex(newValue);
    };
    // Refresh Unread message
    const handleRefreshUnReadMsg = async () => {
        getDynamicMessages(true);
    };
    // Mark message as read
    const handleToReadMessage = async (msg) => {
        const res = await reqToReadMsg(msg);
        if (res.status) {
            message.success(t("markedMessagesReadSuccessful"));
        }
        // Refresh unread messages
        handleRefreshUnReadMsg();
    };

    // Actions after click ok button in the QueryPanel
    const handleQueryOk = (cons) => {
        setConditions(cons);
        setDiagOpen(false);
        // Request read messages from backend
        handleReqReadMsgs(cons);
    };

    // Request read messages from backend
    const handleReqReadMsgs = async (cons = conditions) => {
        let queryString = transConditionsToString(cons);
        let res = await reqReadComments({ queryString: queryString });
        let newRows = [];
        if (res.status) {
            newRows = res.data;
        }
        setReadMsgs(newRows);
    };

    return (<>
        <PageTitle pageName={t("MenuMessage")} displayHelp={false} helpUrl="#" />
        <Divider my={2} />
        <Card sx={{ height: contentHeight }}>
            <CardContent sx={{ m: 0 }}>
                <Box sx={{ width: "100%", mb: 2, height: 60 }}>
                    <MessageToolBar
                        viewIndex={viewIndex}
                        viewChangeAction={handleViewIndexChange}
                        refreshAciton={handleRefreshUnReadMsg}
                        filterAction={() => setDiagOpen(true)}
                        t={t}
                    />
                </Box>
                <Divider my={2} />
                <Box sx={{ flex: 1 }}>
                    {viewIndex === 0
                        ? <UnReadMessage toReadAction={handleToReadMessage} t={t} />
                        : <ReadMessage messages={readMsgs} t={t} />
                    }
                </Box>
            </CardContent>
        </Card>
        <Dialog
            open={diagOpen}
            fullWidth
            maxWidth={"lg"}
            onClose={() => setDiagOpen(false)}
            closeAfterTransition={false}
        >
            <QueryPanel
                title={t("messagesFilterCondition")}
                queryFields={queryFields}
                initalConditions={conditions}
                onOk={handleQueryOk}
                onCancel={() => setDiagOpen(false)}
            />
        </Dialog>
    </>);
};

export default Message;