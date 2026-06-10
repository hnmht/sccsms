import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "@mui/material";
import { message } from "mui-message";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import EditWorkOrder from "./editWorkOrder";

import { QueryPanel, transConditionsToString } from "../../../component/QueryPanel";
import { columns, rowActionsDefine, generateConditions, QueryFields, transWoDetailToFronted, delMultipleDisabled } from "./constructor";
import { reqGetWOList, reqGetWODetail, reqDeleteWO, reqDeleteWOs, reqConfirmWO, reqCancelConfirmWO } from "../../../api/workOrder";

// Work Order List
const WorkOrder = () => {
    const [rows, setRows] = useState([]);
    const [conditions, setConditions] = useState(generateConditions());
    const [diagStatus, setDiagStatus] = useState({
        isOpen: false,
        content: "edit",
        currentWO: undefined,
        isNew: false,
        isModify: false
    });
    const { t } = useTranslation();

    useEffect(() => {
        async function getWOs() {
            // Convert the query conditions to a string
            let queryString = transConditionsToString(generateConditions());
            let wosRes = await reqGetWOList({ queryString: queryString });

            let newWos = [];
            if (wosRes.status) {
                newWos = wosRes.data;
            }
            setRows(newWos);
        }
        getWOs();
    }, []);
    // Close dialog
    const handelDiagClose = () => {
        setDiagStatus({
            isOpen: false,
            content: "edit",
            currentWO: undefined,
            isNew: false,
            isModify: false
        })
    };
    // Actions after click ok button in the dialog
    const handleDiagOk = (cons) => {
        let newDiagStatus = {
            isOpen: false,
            content: "edit",
            currentWO: undefined,
            isNew: false,
            isModify: false
        };
        let newConditions = conditions;
        if (diagStatus.content !== "edit") {
            newConditions = cons;
        }
        setDiagStatus(newDiagStatus);
        setConditions(newConditions);
        // Refresh 
        handleRefreshList(newConditions);
    };
    // Request Work date list from backend by condifitons
    const handleRefreshList = async (cons = conditions) => {
        let queryString = transConditionsToString(cons);
        let wosRes = await reqGetWOList({ queryString: queryString });
        let newWos = [];
        if (wosRes.status) {
            newWos = wosRes.data;
        }
        setRows(newWos);
    };
    // Actions after filter button click in the header
    const handleFilterAction = () => {
        setDiagStatus({
            isOpen: true,
            content: "conditions",
            currentWO: undefined,
            isNew: false,
            isModify: false
        });
    };
    // Actions after click add button in the header
    const handleAddAction = () => {
        setDiagStatus({
            isOpen: true,
            content: "edit",
            currentWO: undefined,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click detail button in the row
    const handleViewAction = async (item) => {
        let res = await reqGetWODetail(item);
        let newDiagStatus = {};
        if (res.status) {
            let woDetail = await transWoDetailToFronted(res.data);
            newDiagStatus = {
                isOpen: true,
                content: "edit",
                currentWO: woDetail,
                isNew: false,
                isModify: false,
            };
        } else {
            message.warning(res.data.msg);
            newDiagStatus = {
                isOpen: false,
                content: "edit",
                currentWO: undefined,
                isNew: false,
                isModify: false,
            };
        }
        setDiagStatus(newDiagStatus);
    };
    // Actions after click edit button in the row
    const handleEditAction = async (item) => {
        let res = await reqGetWODetail(item);
        let newDiagStatus = {};
        if (res.status) {
            let woDetail = await transWoDetailToFronted(res.data);
            newDiagStatus = {
                isOpen: true,
                content: "edit",
                currentWO: woDetail,
                isNew: false,
                isModify: true,
            };
        } else {
            message.warning(res.data.msg);
            newDiagStatus = {
                isOpen: false,
                content: "edit",
                currentWO: undefined,
                isNew: false,
                isModify: false,
            };
        }
        setDiagStatus(newDiagStatus);
    };
    // Actions after click copy add button in the row
    const handleRowCopyAdd = async (item) => {
        let res = await reqGetWODetail(item);
        let newDiagStatus = {};
        if (res.status) {
            let woDetail = await transWoDetailToFronted(res.data);
            newDiagStatus = {
                isOpen: true,
                content: "edit",
                currentWO: woDetail,
                isNew: true,
                isModify: false,
            };
        } else {
            message.warning(res.data.statusMsg);
            newDiagStatus = {
                isOpen: false,
                content: "edit",
                currentWO: undefined,
                isNew: false,
                isModify: false,
            };
        }
        setDiagStatus(newDiagStatus);
    };
    // Actions after click delete button in the row
    const handleRowDelete = async (item) => {
        let res = await reqDeleteWO(item);
        if (res.status) {
            message.success(t("deleteSuccessful"));
            // refresh
            handleRefreshList();
        }
    };
    // Actions after click confirm button in the row
    const handleConfirmRow = async (item) => {
        let res = await reqConfirmWO(item);
        if (res.status) {
            message.success(t("confirmSuccessful"));
            // refresh
            handleRefreshList();
        }
    };
    // Actions after click unconfirm button it the row
    const handleCancelConfirmRow = async (item) => {
        let res = await reqCancelConfirmWO(item);
        if (res.status) {
            message.success(t("unconfirmSuccessful"));
            // refresh
            handleRefreshList();
        }
    };
    // Actions after click batch delete button in the header
    const handleDelMultipleAction = async (docs) => {
        const delsRes = await reqDeleteWOs(docs);
        if (delsRes.status) {
            message.success(t("batchDeleteSuccessful"));
            handleRefreshList(conditions);
        } 
    };

    return (
        <>
            <PageTitle pageName="MenuWO" displayHelp={false} helpUrl="#" />
            <Divider my={2} />
            <DocList
                columns={columns}
                rows={rows}
                headRefreshVisible={false}
                headFilterVisible={true}
                headConfirmVisible={false}
                headCancelConfirmVisible={false}
                filterAction={handleFilterAction}
                rowActionsDefine={rowActionsDefine}
                delMultipleDisabled={delMultipleDisabled}
                delMultipleAction={handleDelMultipleAction}
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
                    ? <EditWorkOrder
                        isOpen={diagStatus.isOpen}
                        isNew={diagStatus.isNew}
                        isModify={diagStatus.isModify}
                        oriWO={diagStatus.currentWO}
                        onCancel={handelDiagClose}
                        onOk={handleDiagOk}
                    />
                    : <QueryPanel
                        title="queryConditions"
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
export default WorkOrder;
