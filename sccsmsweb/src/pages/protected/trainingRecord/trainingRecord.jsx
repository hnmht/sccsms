import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { useTranslation } from "react-i18next";
import { message } from "mui-message";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import { QueryPanel, transConditionsToString } from "../../../component/QueryPanel";

import EditTrainingRecord from "./editTR";
import { reqGetTRList, reqGetTRDetail, reqDeleteTR, reqConfirmTR, reqUnConfirmTR } from "../../../api/trainingRecord";
import { columns, generateTRConditions, trQueryFields, rowActionsDefine } from "./constructor";

// Training Record List
const TrainingRecord = () => {
    const { t } = useTranslation();
    const [trConditions, setTrConditions] = useState(generateTRConditions());
    const [trs, setTrs] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        isOpen: false,
        content: 0, //1 Training Record 2 Queny Panel
        selectedTR: undefined,
        isNew: false,
        isModify: false
    });
    // Reusest the list using default conditions when the component loads
    useEffect(() => {
        async function getTRs() {
            let queryString = transConditionsToString(generateTRConditions());
            let trsRes = await reqGetTRList({ queryString: queryString });
            let newTrs = [];
            if (trsRes.status) {
                newTrs = trsRes.data;
            }
            setTrs(newTrs);
        }
        getTRs();
    }, []);
    // Close Dialog
    const handleDiagClose = () => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedTR: undefined,
            isNew: false,
            isModify: false
        });
    };

    // Actions after click ok button in the Query Panel
    const handleEdQueryOk = async (cons) => {
        setTrConditions(cons);
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedTR: undefined,
            isNew: false,
            isModify: false
        });
        // Request Training Record list from backend
        handleRefreshTRList(cons);
    };

    // Actions after click the filter button in the header
    const handleFilterAction = () => {
        setDiagStatus({
            isOpen: true,
            content: 2,
            selectedTR: undefined,
            isNew: false,
            isModify: false
        });
    };

    // Actions after click add button in the header
    const handleAddAction = () => {
        setDiagStatus({
            isOpen: true,
            content: 1,
            selectedTR: undefined,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click the ok button in the dialog
    const handleEditOk = () => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedTR: undefined,
            isNew: false,
            isModify: false
        });
        // Request Training Record list from backend
        handleRefreshTRList();
    };
    // Request Training Record list from backend
    const handleRefreshTRList = async (cons = trConditions) => {
        let queryString = transConditionsToString(cons);
        let trsRes = await reqGetTRList({ queryString: queryString });
        let newTrs = [];
        if (trsRes.status) {
            newTrs = trsRes.data;
        }
        setTrs(newTrs);
    };

    // Actions after click view button in the row
    const handleViewAction = async (item) => {
        const detailRes = await reqGetTRDetail(item);
        let trDetail = {};
        if (detailRes.status) {
            trDetail = detailRes.data;
        } else {
            return
        }
        setDiagStatus({
            isOpen: true,
            content: 1,
            selectedWOR: undefined,
            selectedTR: trDetail,
            isNew: false,
            isModify: false
        });
    };

    // Actions after click Edit button in the row
    const handleRowEdit = async (item) => {
        const detailRes = await reqGetTRDetail(item);
        let trDetail = {};
        if (detailRes.status) {
            trDetail = detailRes.data;
        } else {
            return
        }
        setDiagStatus({
            isOpen: true,
            content: 1,
            selectedTR: trDetail,
            isNew: false,
            isModify: true
        });
    };

    // Actions after click delete button in the row
    const handleRowDelete = async (item) => {
        const delRes = await reqDeleteTR(item);
        if (delRes.status) {
            message.success(t("deleteSuccessful"));
        } else {
            return
        }
        // Refresh list
        handleRefreshTRList();
    };
    // Actions after click the Confirm button in the row
    const handleRowConfirm = async (item) => {
        const confirmRes = await reqConfirmTR(item);
        if (confirmRes.status) {
            message.success(t("confirmSuccessful"));
        } else {
            return
        }
        // Refresh list
        handleRefreshTRList();
    };

    // Actions after click the UnConfirm button in the row
    const handleRowCancelConfirm = async (item) => {
        const cancelRes = await reqUnConfirmTR(item);
        if (cancelRes.status) {
            message.success(t("unconfirmSuccessful"));
        } else {
            return
        }
        // Refresh list
        handleRefreshTRList();
    };

    // Dialog Display content Component
    const DiagContent = ({ content }) => {
        switch (content) {
            case 1:
                return <EditTrainingRecord
                    isOpen={diagStatus.isOpen}
                    oriTr={diagStatus.selectedTR}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    onCancel={handleDiagClose}
                    onOk={handleEditOk}
                    t={t}
                />;
            case 2:
                return <QueryPanel
                    title="trFilterCondition"
                    queryFields={trQueryFields}
                    initalConditions={trConditions}
                    onOk={handleEdQueryOk}
                    onCancel={handleDiagClose}
                    id="trQueryPanel"
                />;
            default:
                return null;
        }
    };

    return (
        <>
            <PageTitle pageName="MenuTR" displayHelp={false} helpUrl="#" />
            <Divider my={2} />
            <DocList
                columns={columns}
                rows={trs}
                selectColumnVisible={false}
                headRefreshVisible={false}
                headFilterVisible={true}
                headRefAddVisible={false}
                headDelMultipleVisible={false}
                rowActionsDefine={rowActionsDefine}
                addAction={handleAddAction}
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

export default TrainingRecord;