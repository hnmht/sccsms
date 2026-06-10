import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { useTranslation } from "react-i18next";
import { message } from "mui-message";

import { Divider } from "../../../../component/ScMui/ScMui";
import PageTitle from "../../../../component/PageTitle/PageTitle";
import DocList from "../../../../component/DocList/DocList";
import { QueryPanel, transConditionsToString } from "../../../../component/QueryPanel";
import WORefer from "./woRefer";
import EditEO from "./editEO";
import { reqGetEOList, reqGetEODetail, reqDeleteEO, reqConfirmEO, reqUnConfirmEO } from "../../../../api/executionOrder";
import { columns, generateWOConditions, woQueryFields, generateEOConditions, eoQueryFields, rowActionsDefine, transEODetailToFrontEnd } from "./constructor";

const emptyArray = [];

// Execution Order List
const ExecutionOrder = () => {
    const [woConditions, setWoConditions] = useState(generateWOConditions());
    const [eoConditions, setEoConditions] = useState(generateEOConditions());
    const [eos, setEos] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        isOpen: false,
        content: 0, //1  Execution Order 2 Execution Order Query Panel 3 Pending reference Worker Order 4 Work Order Query Panel
        selectedWOR: undefined,
        selectedEO: undefined,
        isNew: false,
        isModify: false
    });
    const { t } = useTranslation();

    // Query the Execution Order list using default conditions when the component is loaded
    useEffect(() => {
        async function getEOs() {
            let queryString = transConditionsToString(generateEOConditions());
            let eosRes = await reqGetEOList({ queryString: queryString });
            let newEos = emptyArray;
            if (eosRes.status) {
                newEos = eosRes.data;
            }
            setEos(newEos);
        }
        getEOs();
    }, []);
    // Close Dialog
    const handleDiagClose = () => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedWOR: undefined,
            selectedEO: undefined,
            isNew: false,
            isModify: false
        });
    };

    // Actions after click Add by Reference button in the header
    const handleAddRefAction = () => {
        setDiagStatus({
            isOpen: true,
            content: 4,
            selectedWOR: undefined,
            selectedEO: undefined,
            isNew: false,
            isModify: false
        })
    };
    // Actions after click ok button in the Work Order query panel 
    const handleWoQueryOk = (cons) => {
        setWoConditions(cons);
        setDiagStatus({
            isOpen: true,
            content: 3,
            selectedWOR: undefined,
            selectedEO: undefined,
            isNew: false,
            isModify: false
        });
    };

    // Actions after click ok button in the Execution Order query panel
    const handleEdQueryOk = async (cons) => {
        setEoConditions(cons);
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedWOR: undefined,
            selectedEO: undefined,
            isNew: false,
            isModify: false
        });
        // Request Execution Order list from backend
        handleRefreshEOList(cons);
    };

    // Actions after click filter button in the header 
    const handleFilterAction = () => {
        setDiagStatus({
            isOpen: true,
            content: 2,
            selectedWOR: undefined,
            selectedEO: undefined,
            isNew: false,
            isModify: false
        });
    };
    // Actions after click ok button in the Pedding Referenced Work Order Dialog
    const handleWoReferOk = (item) => {
        setDiagStatus({
            isOpen: true,
            content: 1,
            selectedWOR: item,
            selectedEO: undefined,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click add button in the header
    const handleAddAction = () => {
        setDiagStatus({
            isOpen: true,
            content: 1,
            selectedWOR: undefined,
            selectedEO: undefined,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click ok button in the Execution Order Edit/Add dialog
    const handleEditOk = () => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedWOR: undefined,
            selectedEO: undefined,
            isNew: false,
            isModify: false
        });
        // Request the Execution Order list from backend
        handleRefreshEOList();
    };
    // Request the latest Execution Order list from backend
    const handleRefreshEOList = async (cons = eoConditions) => {
        let queryString = transConditionsToString(cons);
        let eosRes = await reqGetEOList({ queryString: queryString });
        let newEos = [];
        if (eosRes.status) {
            newEos = eosRes.data;
        }
        setEos(newEos);
    };

    // Actions after click the View button in the table row
    const handleViewAction = async (item) => {
        const detailRes = await reqGetEODetail(item);
        let edDetail = {};
        if (detailRes.status) {
            edDetail = await transEODetailToFrontEnd(detailRes.data);
        }
        setDiagStatus({
            isOpen: true,
            content: 1,
            selectedWOR: undefined,
            selectedEO: edDetail,
            isNew: false,
            isModify: false
        });
    };

    // Actions after click the edit button in the table row
    const handleRowEdit = async (item) => {
        const detailRes = await reqGetEODetail(item);
        let edDetail = {};
        if (detailRes.status) {
            edDetail = await transEODetailToFrontEnd(detailRes.data);
        }
        setDiagStatus({
            isOpen: true,
            content: 1,
            selectedWOR: undefined,
            selectedEO: edDetail,
            isNew: false,
            isModify: true
        });
    };

    // Actions after click the delete button in the table row
    const handleRowDelete = async (item) => {
        const delRes = await reqDeleteEO(item);
        if (delRes.status) {
            message.success(t("deleteSuccessful"));
            // Request the latest Execution Order list from backend
            handleRefreshEOList();
        }         
    };
    // Actions after click the confirm button in the table row
    const handleRowConfirm = async (item) => {
        const confirmRes = await reqConfirmEO(item);
        if (confirmRes.status) {
            message.success(t("confirmSuccessful"));
            // Request the latest Execution Order list from backend
            handleRefreshEOList();
        } 
      
    };
    // Actions after click the un-confirm button in the table row
    const handleRowCancelConfirm = async (item) => {
        const cancelRes = await reqUnConfirmEO(item);
        if (cancelRes.status) {
            message.success(t("unconfirmSuccessful"));
            // Request the latest Execution Order list from backend
            handleRefreshEOList();
        } 
    };

    // Dialog display content Component
    const DiagContent = ({ content }) => {
        switch (content) {
            case 1:
                return <EditEO
                    isOpen={diagStatus.isOpen}
                    oriWOR={diagStatus.selectedWOR}
                    oriEO={diagStatus.selectedEO}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    onCancel={handleDiagClose}
                    onOk={handleEditOk}
                    t={t}
                />;
            case 2:
                return <QueryPanel
                    title="eoFilterCondition"
                    queryFields={eoQueryFields}
                    initalConditions={eoConditions}
                    onOk={handleEdQueryOk}
                    onCancel={handleDiagClose}
                    id="woQueryPanel" />;
            case 3:
                return <WORefer
                    title="generateRefWO"
                    conditions={woConditions}
                    cancelClickAction={handleDiagClose}
                    okClickAction={handleWoReferOk}
                    filterAction={handleAddRefAction}
                    id="refWorkOrder"
                    t={t}
                />;
            case 4:
                return <QueryPanel
                    title="woFilterCondition"
                    queryFields={woQueryFields}
                    initalConditions={woConditions}
                    onOk={handleWoQueryOk}
                    onCancel={handleDiagClose}
                    id="woQureyPanel" />;
            default:
                return null;
        }
    };

    return (
        <>
            <PageTitle pageName={t("MenuEO")} displayHelp={false} helpUrl="#" />
            <Divider my={2} />
            <DocList
                columns={columns}
                rows={eos}
                selectColumnVisible={false}
                headRefreshVisible={false}
                headFilterVisible={true}
                headRefAddVisible={true}
                headDelMultipleVisible={false}
                rowActionsDefine={rowActionsDefine}
                addAction={handleAddAction}
                addRefAction={handleAddRefAction}
                filterAction={handleFilterAction}
                rowViewDetail={handleViewAction}
                rowEdit={handleRowEdit}
                rowDelete={handleRowDelete}
                rowStart={handleRowConfirm}
                rowStop={handleRowCancelConfirm}
            />
            <Dialog
                open={diagStatus.isOpen}
                fullWidth
                fullScreen={diagStatus.content === 1}
                maxWidth={"lg"}
                onClose={handleDiagClose}
                closeAfterTransition={false}
            >
                <DiagContent content={diagStatus.content} />
            </Dialog>
        </>
    );
};

export default ExecutionOrder;