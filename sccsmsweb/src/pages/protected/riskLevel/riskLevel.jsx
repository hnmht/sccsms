import { useState, useCallback, useEffect, Fragment } from "react";
import { Dialog } from "@mui/material";
import { message } from "mui-message";
import { useTranslation } from "react-i18next";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import EditRL from "./editRL";
import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";
import { reqGetRLList, reqDeleteRL, reqDeleteRLs } from "../../../api/riskLevel";
import { InitDocCache } from "../../../storage/db/db";

// Risk Level
const RiskLevel = () => {
    const [rows, setRows] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        oriRL: undefined,
        isOpen: false,
        isNew: false,
        isModify: false
    });
    const { t } = useTranslation()

    useEffect(() => {
        async function getData() {
            handleReqRLList();
        }
        getData();
    }, []);

    // Request Risk Level list
    const handleReqRLList = async () => {
        const resp = await reqGetRLList();
        let newRls = [];
        if (resp.status) {
            newRls = resp.data;
        }
        setRows(newRls);
    };

    // Actions after click copyAdd button in the body
    const handleCopyAdd = (item) => {
        setDiagStatus({
            oriRL: item,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click Edit button in the body
    const handleRLEdit = (item) => {
        setDiagStatus({
            oriRL: item,
            isOpen: true,
            isNew: false,
            isModify: true
        });
    }
    // Actions after click delete button in the body
    const handleRowDelete = async (item) => {
        const delRes = await reqDeleteRL(item);
        if (delRes.status) {
            message.success(t("deleteSuccessful"));
            // Refresh data
            handleReqRLList();
        }
        // Refresh front-end cache
        await InitDocCache("risklevel");
    }
    // Action after click delete button in body
    const handleRLDetail = (item) => {
        setDiagStatus({
            oriRL: item,
            isOpen: true,
            isNew: false,
            isModify: false
        });
    }

    // Close dialog
    const handleDiagClose = useCallback(() => {
        setDiagStatus({
            oriRL: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
    }, []);

    // Actions after click add button in head
    const handleAddRLlass = () => {
        setDiagStatus({
            oriRL: undefined,
            isOpen: true,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click batch delete button in header
    const handleDelMultiple = async (udcs) => {
        const delRes = await reqDeleteRLs(udcs);
        if (delRes.status) {
            message.success(t("batchDeleteSuccessful"));
            // Refresh
            handleReqRLList();
        }
        // Refresh local cache
        await InitDocCache("risklevel");
    }
    // Actions after click ok button in the dialog
    const handelAddRLOk = useCallback(() => {
        setDiagStatus({
            oriRL: undefined,
            isOpen: false,
            isNew: false,
            isModify: false
        });
        // Refresh
        handleReqRLList();
    }, []);


    return (
        <Fragment>
            <PageTitle pageName={t("MenuRL")} displayHelp={false} helpUrl="#" />
            <Divider my={2} />
            <DocList
                rows={rows}
                columns={columns}
                addAction={handleAddRLlass}
                refreshAction={handleReqRLList}
                rowActionsDefine={rowActionsDefine}
                delMultipleDisabled={delMultipleDisabled}
                delMultipleAction={handleDelMultiple}
                rowCopyAdd={handleCopyAdd}
                rowEdit={handleRLEdit}
                rowDelete={handleRowDelete}
                rowViewDetail={handleRLDetail}
            />
            <Dialog
                maxWidth="sm"
                fullWidth
                onClose={handleDiagClose}
                open={diagStatus.isOpen}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 800 } }}
                closeAfterTransition={false}
            >
                <EditRL
                    diagStatus={diagStatus}
                    onCancel={handleDiagClose}
                    onOk={handelAddRLOk}
                />
            </Dialog>
        </Fragment>
    );
}

export default RiskLevel;