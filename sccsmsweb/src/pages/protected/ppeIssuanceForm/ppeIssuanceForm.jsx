import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { message } from "mui-message";
import { useTranslation } from "react-i18next";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import { QueryPanel, transConditionsToString } from "../../../component/QueryPanel";

import EditPPEIF from "./eidtPPEIF";
import { reqGetPPEIFList, reqGetPPEIFDetail, reqDeletePPEIF, reqConfirmPPEIF, reqUnconfirmPPEIF } from "../../../api/ppeIssuanceForm";
import { columns, generatePPEIFConditions, ldQueryFields, rowActionsDefine } from "./constructor";

// Personal Protective Equipment Issuance Form List
const PPEIssuanceForm = () => {
    const [ppeifConditions, setPpeifConditions] = useState(generatePPEIFConditions());
    const [pifs, setPifs] = useState([]);
    const [diagStatus, setDiagStatus] = useState({
        isOpen: false,
        content: 0, //1 PPE Issuance Form  2  Query Panel
        selectedPPEIF: undefined,
        isNew: false,
        isModify: false
    });
    const { t } = useTranslation();
    // Request the PPEIF list using default confitions when the component loads
    useEffect(() => {
        async function getPPEIFs() {
            let queryString = transConditionsToString(generatePPEIFConditions());
            let res = await reqGetPPEIFList({ queryString: queryString });
            let newPifs = [];
            if (res.status) {
                newPifs = res.data;
            }
            setPifs(newPifs);
        }
        getPPEIFs();
    }, []);
    // Close Dialog
    const handleDiagClose = () => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedPPEIF: undefined,
            isNew: false,
            isModify: false
        });
    };

    // Actions after click ok button in the QueryPanel
    const handleLdQueryOk = async (cons) => {
        setPpeifConditions(cons);
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedPPEIF: undefined,
            isNew: false,
            isModify: false
        });
        // Request PPEIF list from backend
        handleRefreshPPEIFList(cons);
    };

    // Actions after click the filter button in the header
    const handleFilterAction = () => {
        setDiagStatus({
            isOpen: true,
            content: 2,
            selectedPPEIF: undefined,
            isNew: false,
            isModify: false
        });
    };

    // Actions after click Add button in the header
    const handleAddAction = () => {
        setDiagStatus({
            isOpen: true,
            content: 1,
            selectedPPEIF: undefined,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click ok button in the EditPPEIF Dialog
    const handleEditOk = () => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedPPEIF: undefined,
            isNew: false,
            isModify: false
        });
        // Request PPEIF list from backend
        handleRefreshPPEIFList();
    };
    // Request PPE Issuance Form List from backend
    const handleRefreshPPEIFList = async (cons = ppeifConditions) => {
        let queryString = transConditionsToString(cons);
        let res = await reqGetPPEIFList({ queryString: queryString });
        let newPifs = [];
        if (res.status) {
            newPifs = res.data;
        }
        setPifs(newPifs);
    };
    // Actions after click view button in the body row
    const handleViewAction = async (item) => {
        const detailRes = await reqGetPPEIFDetail(item);
        let ppeifDetail = {};
        if (detailRes.status) {
            ppeifDetail = detailRes.data;
        }
        setDiagStatus({
            isOpen: true,
            content: 1,
            selectedPPEIF: ppeifDetail,
            isNew: false,
            isModify: false
        });
    };

    // Actions after click edit button in the body row
    const handleRowEdit = async (item) => {
        const detailRes = await reqGetPPEIFDetail(item);
        let ppeifDetail = {};
        if (detailRes.status) {
            ppeifDetail = detailRes.data;
        }
        setDiagStatus({
            isOpen: true,
            content: 1,
            selectedPPEIF: ppeifDetail,
            isNew: false,
            isModify: true
        });
    };

    // Actions after click delete button in the body row
    const handleRowDelete = async (item) => {
        const delRes = await reqDeletePPEIF(item);
        if (delRes.status) {
            message.success(t("deleteSuccessful"));
            // Request PPEIF list from backend
            handleRefreshPPEIFList();
        }
    };
    // Actions after click confirm button in the body row
    const handleRowConfirm = async (item) => {
        const confirmRes = await reqConfirmPPEIF(item);
        if (confirmRes.status) {
            message.success(t("confirmSuccessful"));
            // Request PPEIF List from backend
            handleRefreshPPEIFList();
        }
    };

    // Actions after click unconfirm button in the body row
    const handleRowUnconfirm = async (item) => {
        const unconfirmRes = await reqUnconfirmPPEIF(item);
        if (unconfirmRes.status) {
            message.success(t("unconfirmSuccessful"));
            // Request PPEIF List from backend
            handleRefreshPPEIFList();
        }
    };

    // Dialog Display content Component
    const DiagContent = ({ content }) => {
        switch (content) {
            case 1:
                return <EditPPEIF
                    isOpen={diagStatus.isOpen}
                    oriPPEIF={diagStatus.selectedPPEIF}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    onCancel={handleDiagClose}
                    onOk={handleEditOk}
                    t={t}
                />;
            case 2:
                return <QueryPanel
                    title="ppeifFilterCondition"
                    queryFields={ldQueryFields}
                    initalConditions={ppeifConditions}
                    onOk={handleLdQueryOk}
                    onCancel={handleDiagClose}
                    id="ppeifQueryPanel"
                />;
            default:
                return null;
        }
    };

    return (
        <>
            <PageTitle pageName={t("MenuPPEIF")} displayHelp={false} helpUrl="#" />
            <Divider my={2} />
            <DocList
                columns={columns}
                rows={pifs}
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
                rowStop={handleRowUnconfirm}
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

export default PPEIssuanceForm;