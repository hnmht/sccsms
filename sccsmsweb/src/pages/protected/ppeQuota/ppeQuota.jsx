import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { message } from "mui-message";
import { useTranslation } from "react-i18next";
import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import EditPPEQuota from "./editPPEQuota";

import { QueryPanel, transConditionsToString } from "../../../component/QueryPanel";
import { columns, rowActionsDefine, generateConditions, QueryFields } from "./constructor";
import { reqGetPPEQuotaList, reqGetPPEQuotaDetail, reqDeletePPEQuota, reqConfirmPPEQuota, reqUnconfirmPPEQuota } from "../../../api/ppeQuota";

// Personal Protective Equipment (Position) Quota
const PPEQuota = () => {
    const [rows, setRows] = useState([]);
    const [conditions, setConditions] = useState(generateConditions());
    const [diagStatus, setDiagStatus] = useState({
        isOpen: false,
        content: "edit",
        currentPPEQuota: undefined,
        isNew: false,
        isModify: false
    });
    const { t } = useTranslation();

    useEffect(() => {
        async function getPPEQuotas() {
            let queryString = transConditionsToString(generateConditions());
            let lqsRes = await reqGetPPEQuotaList({ queryString: queryString });
            let newLqs = [];
            if (lqsRes.status) {
                newLqs = lqsRes.data;
            }
            setRows(newLqs);
        }
        getPPEQuotas();
    }, []);
    // Close dialog
    const handelDiagClose = () => {
        setDiagStatus({
            isOpen: false,
            content: "edit",
            currentPPEQuota: undefined,
            isNew: false,
            isModify: false
        })
    };
    // Actions after click the ok button in the dialog
    const handleDiagOk = (cons) => {
        let newDiagStatus = {
            isOpen: false,
            content: "edit",
            currentPPEQuota: undefined,
            isNew: false,
            isModify: false
        };
        let newConditions = conditions;
        if (diagStatus.content !== "edit") {
            newConditions = cons;
        }
        setDiagStatus(newDiagStatus);
        setConditions(newConditions);
        // Request PPE Quota list from backend
        handleRefreshList(newConditions);
    };
    // Request PPE Quota list from backend
    const handleRefreshList = async (cons = conditions) => {
        let queryString = transConditionsToString(cons);
        let lqsRes = await reqGetPPEQuotaList({ queryString: queryString });
        let newLqs = [];
        if (lqsRes.status) {
            newLqs = lqsRes.data;
        }
        setRows(newLqs);
    };
    // Actions after click the filter button in the header
    const handleFilterAction = () => {
        setDiagStatus({
            isOpen: true,
            content: "conditions",
            currentPPEQuota: undefined,
            isNew: false,
            isModify: false
        });
    };
    // Actions after click the add button in the header
    const handleAddAction = () => {
        setDiagStatus({
            isOpen: true,
            content: "edit",
            currentPPEQuota: undefined,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click the view button in the body row
    const handleViewAction = async (item) => {
        let res = await reqGetPPEQuotaDetail(item);
        let newDiagStatus = {};
        if (res.status) {
            let pqDetail = res.data;
            newDiagStatus = {
                isOpen: true,
                content: "edit",
                currentPPEQuota: pqDetail,
                isNew: false,
                isModify: false,
            };
        } else {
            newDiagStatus = {
                isOpen: false,
                content: "edit",
                currentPPEQuota: undefined,
                isNew: false,
                isModify: false,
            };
        }
        setDiagStatus(newDiagStatus);
    };
    // Actions after click the Edit button in the body row
    const handleEditAction = async (item) => {
        let res = await reqGetPPEQuotaDetail(item);
        let newDiagStatus = {};
        if (res.status) {
            let pqDetail = res.data;
            newDiagStatus = {
                isOpen: true,
                content: "edit",
                currentPPEQuota: pqDetail,
                isNew: false,
                isModify: true,
            };
        } else {
            message.warning(res.data.statusMsg);
            newDiagStatus = {
                isOpen: false,
                content: "edit",
                currentPPEQuota: undefined,
                isNew: false,
                isModify: false,
            };
        }
        setDiagStatus(newDiagStatus);
    };
    // Actions after the copyAdd button in the body row
    const handleRowCopyAdd = async (item) => {
        let res = await reqGetPPEQuotaDetail(item);
        let newDiagStatus = {};
        if (res.status) {
            let pqDetail = res.data;
            newDiagStatus = {
                isOpen: true,
                content: "edit",
                currentPPEQuota: pqDetail,
                isNew: true,
                isModify: false,
            };
        } else {
            newDiagStatus = {
                isOpen: false,
                content: "edit",
                currentPPEQuota: undefined,
                isNew: false,
                isModify: false,
            };
        }
        setDiagStatus(newDiagStatus);
    };
    // Actions after click delete button in the body row
    const handleRowDelete = async (item) => {
        let res = await reqDeletePPEQuota(item);
        if (res.status) {
            message.success(t("deleteSuccessful"));
            // Request the latest PPE Quota list from backend
            handleRefreshList();
        }        
    };
    // Actions after click confirm button in the body row
    const handleConfirmRow = async (item) => {
        let res = await reqConfirmPPEQuota(item);
        if (res.status) {
            message.success(t("confirmSuccessful"));
            // Request the latest PPE Quota list from backend
            handleRefreshList();
        }       
    };
    // Actions after click unconfirm button in the body row
    const handleCancelConfirmRow = async (item) => {
        let res = await reqUnconfirmPPEQuota(item);
        if (res.status) {
            message.success(t("unconfirmSuccessful"));
            // Request the latest PPE Quota list from backend
            handleRefreshList();
        } 
    };


    return (
        <>
            <PageTitle pageName={t("MenuPQ")} displayHelp={false} helpUrl="#" />
            <Divider my={2} />
            <DocList
                columns={columns}
                rows={rows}
                selectColumnVisible={false}
                headRefreshVisible={false}
                headFilterVisible={true}
                headConfirmVisible={false}
                headCancelConfirmVisible={false}
                headDelMultipleVisible={false}
                filterAction={handleFilterAction}
                rowActionsDefine={rowActionsDefine}
                addAction={handleAddAction}
                rowViewDetail={handleViewAction}
                rowEdit={handleEditAction}
                rowCopyAdd={handleRowCopyAdd}
                rowDelete={handleRowDelete}
                rowStart={handleConfirmRow}
                rowStop={handleCancelConfirmRow}
            />
            <Dialog
                open={diagStatus.isOpen}
                fullWidth
                fullScreen={diagStatus.content === "edit"}
                maxWidth={"md"}
                onClose={handelDiagClose}
                closeAfterTransition={false}
            >
                {diagStatus.content === "edit"
                    ? <EditPPEQuota
                        isOpen={diagStatus.isOpen}
                        isNew={diagStatus.isNew}
                        isModify={diagStatus.isModify}
                        oriPPEQuota={diagStatus.currentPPEQuota}
                        onCancel={handelDiagClose}
                        onOk={handleDiagOk}
                        t={t}
                    />
                    : <QueryPanel
                        title="ppeQutaFilterConditions"
                        queryFields={QueryFields}
                        initalConditions={conditions}
                        onOk={handleDiagOk}
                        onCancel={handelDiagClose}
                    />
                }
            </Dialog>
        </>
    );
}
export default PPEQuota;
