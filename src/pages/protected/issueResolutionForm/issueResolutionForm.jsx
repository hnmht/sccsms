import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { useTranslation } from "react-i18next";
import { message } from "mui-message";
import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import { QueryPanel, transConditionsToString } from "../../../component/QueryPanel";
import EORefer from "./eoRefer";
import EditIRF from "./editIRF";
import { columns, rowActionsDefine, eoQueryFields, irfQueryFields, generateEOConditions, generateIRFConditions } from "./constructor";
import { reqIRFList, reqDeleteIRF, reqConfirmIRF, reqCancelConfirmIRF } from "../../../api/issueResolutionForm";

// Issue Resolution Form List
const IssueResolutionForm = () => {
    const [irfs, setIrfs] = useState([]);
    const [eoConditions, setEoConditions] = useState(generateEOConditions());
    const [irfConditions, setIrfConditions] = useState(generateIRFConditions());
    const [diagStatus, setDiagStatus] = useState({
        isOpen: false,
        content: 0, //1 IRF 2 IRF Conditions 3 EO List 4 EO Conditions
        selectedEOR: undefined,
        selectedIRF: undefined,
        isNew: false,
        isModify: false
    });
    const {t} = useTranslation();

    // Query the Issue Resolution Form list using default conditions when the component is loaded
    useEffect(() => {
        async function getIRFs() {
            const con = generateIRFConditions();
            let queryString = transConditionsToString(con);
            let ddsRes = await reqIRFList({ queryString: queryString });
            let newIRFs = [];
            if (ddsRes.status) {
                newIRFs = ddsRes.data;
            }
            setIrfs(newIRFs);
        }
        getIRFs();
    }, []);

    // Request Issue Resolution Form list to backend
    const handleRefreshIRFList = async (cons = irfConditions) => {
        let queryString = transConditionsToString(cons);
        let ddsRes = await reqIRFList({ queryString: queryString });
        let newIRFs = [];
        if (ddsRes.status) {
            newIRFs = ddsRes.data;
        }
        setIrfs(newIRFs);
    };
    // Close Dialog
    const handleDiagClose = () => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedEOR: undefined,
            selectedIRF: undefined,
            isNew: false,
            isModify: false
        });
    };

    // Actions after click the ok button in the Execution Order Query Panel
    const handleEORQueryOk = (cons) => {
        setEoConditions(cons);
        setDiagStatus({
            isOpen: true,
            content: 3,
            selectedEOR: undefined,
            selectedIRF: undefined,
            isNew: false,
            isModify: false
        });
    };
    // Actions after click the Add Reference button in the header
    const handleAddRefAction = () => {
        setDiagStatus({
            isOpen: true,
            content: 4,
            selectedEOR: undefined,
            selectedIRF: undefined,
            isNew: false,
            isModify: false
        })
    };
    // Actions after click the Ok button in the EOlist
    const handleEOReferOk = (item) => {
        setDiagStatus({
            isOpen: true,
            content: 1, 
            selectedEOR: item,
            selectedIRF: undefined,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click the Ok button in the editIRF 
    const handleEditOk = () => {
        setDiagStatus({
            isOpen: false,
            content: 0, 
            selectedEOR: undefined,
            selectedIRF: undefined,
            isNew: false,
            isModify: false
        });
        // Request the Issue Resolution Form List to the backend
        handleRefreshIRFList();
    };
    // Actions after click Filter button in the header
    const handleFilterAction = () => {
        setDiagStatus({
            isOpen: true,
            content: 2,
            selectedEOR: undefined,
            selectedIRF: undefined,
            isNew: false,
            isModify: false
        });
    };
    // Actions after click Ok button in the IRF Conditions Query Panel
    const handleIRFQueryOk = (cons) => {
        setIrfConditions(cons);
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedEOR: undefined,
            selectedIRF: undefined,
            isNew: false,
            isModify: false
        });
        // Request Issue Resolution Form list from backend
        handleRefreshIRFList(cons);
    };

    // Actions after click the View button in the body row
    const handleViewAction = async (item) => {
        setDiagStatus({
            isOpen: true,
            content: 1,
            selectedEOR: undefined,
            selectedIRF: item,
            isNew: false,
            isModify: false
        });
    };
    // Actions after click the Edit button in the body row
    const handleEditAction = async (item) => {
        setDiagStatus({
            isOpen: true,
            content: 1,
            selectedEOR: undefined,
            selectedIRF: item,
            isNew: false,
            isModify: true
        });
    };
    // Actions after click the Delete button in the body row 
    const handleRowDelete = async (item) => {
        const delRes = await reqDeleteIRF(item);
        if (delRes.status) {
            message.success(t("deleteSuccessful"));
        }
        // Request the Issue Resolution Form from backend
        handleRefreshIRFList();
    };
    // Actions after click the Confirm button in the body row
    const handleRowConfirm = async (item) => {
        const confirmRes = await reqConfirmIRF(item);
        if (confirmRes.status) {
            message.success(t("confirmSuccessful"));
        } 
        // Request the Issue Resolution Form from backend
        handleRefreshIRFList();
    };

    // Actions after click the Unconfirm button in the body row
    const handleRowCancelConfirm = async (item) => {
        const cancelRes = await reqCancelConfirmIRF(item);
        if (cancelRes.status) {
            message.success(t("unconfirmSuccessful"));
        } 
        // Request the Issue Resolution Form list from backend
        handleRefreshIRFList();
    };

    // Dialog display content Component
    const DiagContent = ({ content }) => {
        switch (content) {
            case 1:
                return <EditIRF
                    isOpen={diagStatus.isOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriEOR={diagStatus.selectedEOR}
                    oriIRF={diagStatus.selectedIRF}
                    onCancel={handleDiagClose}
                    onOk={handleEditOk}
                />;
            case 2:
                return <QueryPanel
                    title={"irfFilterCondition"}
                    queryFields={irfQueryFields}
                    initalConditions={irfConditions}
                    onOk={handleIRFQueryOk}
                    onCancel={handleDiagClose}
                    id="irfQueryPanel" />;
            case 3:
                return <EORefer
                    title={"generateRefEOR"}
                    conditions={eoConditions}
                    cancelClickAction={handleDiagClose}
                    okClickAction={handleEOReferOk}
                    filterAction={handleAddRefAction}
                />;
            case 4:
                return <QueryPanel
                    title="eorFilterCondition"
                    queryFields={eoQueryFields}
                    initalConditions={eoConditions}
                    onOk={handleEORQueryOk}
                    onCancel={handleDiagClose}
                    id="eorQureyPanel" />;
            default:
                return null;
        }
    };


    return (
        <>
            <PageTitle pageName={t("MenuIRF")} displayHelp={false} helpUrl="#" />
            <Divider my={2} />
            <DocList
                columns={columns}
                rows={irfs}
                selectColumnVisible={false}
                headRefreshVisible={false}
                headAddVisible={false}
                headFilterVisible={true}
                headRefAddVisible={true}
                headDelMultipleVisible={false}
                rowActionsDefine={rowActionsDefine}
                addRefAction={handleAddRefAction}
                filterAction={handleFilterAction}
                rowViewDetail={handleViewAction}
                rowEdit={handleEditAction}
                rowDelete={handleRowDelete}
                rowStart={handleRowConfirm}
                rowStop={handleRowCancelConfirm}
            />
            <Dialog
                open={diagStatus.isOpen}
                fullWidth
                maxWidth={"lg"}
                onClose={handleDiagClose}
                closeAfterTransition={false}
            >
                <DiagContent content={diagStatus.content} />
            </Dialog>
        </>);
}

export default IssueResolutionForm;