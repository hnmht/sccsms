import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { useTranslation } from "react-i18next";
import { message } from "mui-message";

import { Divider } from "../../../../component/ScMui/ScMui";
import PageTitle from "../../../../component/PageTitle/PageTitle";
import DocListPaging from "../../../../component/DocList/DocListPaging";
import ReviewEO from "./reviewEO";
import { reqGetEOPaginationList, reqGetEODetail, reqConfirmEO, reqUnConfirmEO } from "../../../../api/executionOrder";
import { QueryPanel, transConditionsToString } from "../../../../component/QueryPanel";
import { columns, generateEOConditions, eoQueryFields, rowActionsDefine, transEODetailToFrontEnd } from "./constructor";


// Execution Order List for review
const ExecutionOrderReview = () => {
    const [eosPaging, setEosPaging] = useState({ eos: [], count: 0, page: 0, perPage: 10 });
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [edConditions, setEdConditions] = useState(generateEOConditions());
    const [diagStatus, setDiagStatus] = useState({
        isOpen: false,
        content: 0,
        selectedEO: undefined,
        startTime: undefined
    });
    const {t} = useTranslation();

    // Request the Execution Order list using default condifitons when the component is loaded
    useEffect(() => {
        async function getEOs() {
            let queryString = transConditionsToString(generateEOConditions());
            let eosRes = await reqGetEOPaginationList({ queryString: queryString, page: 0, perPage: 10 });
            let newEos = { eos: [], count: 0 };
            if (eosRes.status) {
                newEos = eosRes.data;
            }
            setEosPaging(newEos);
        }
        getEOs();
    }, []);

    // Request the Execution Order list from backend using conditions
    const handleRefreshData = async (page1 = page, perPage1 = perPage, eoConditions1 = edConditions) => {
        let queryString = transConditionsToString(eoConditions1);
        let eosRes = await reqGetEOPaginationList({ queryString: queryString, page: page1, perPage: perPage1 });
        let newEos = { eos: [], count: 0, page: 0, perPage: perPage1 };
        if (eosRes.status) {
            newEos = eosRes.data;
        }
        setPage(newEos.page);
        setPerPage(newEos.perPage);
        setEosPaging(newEos);
        setEdConditions(eoConditions1);
    };

    // Close Dialog
    const handleDiagClose = () => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedEO: undefined,
            startTime: undefined
        });
    };

    // Actions after Click the Ok button in Query Panel
    const handleEoQueryOk = async (cons) => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedEO: undefined,
        });
        // Request data from backend
        handleRefreshData(0, perPage, cons)
    };
    // Actions after click the filter button in header 
    const handleFilterAction = () => {
        setDiagStatus({
            isOpen: true,
            content: 2,
            selectedEO: undefined,
        });
    };
    // Actions after click the Review button in the body row
    const handleViewAction = async (item) => {
        const detailRes = await reqGetEODetail(item);
        let eoDetail = {};
        if (detailRes.status) {
            eoDetail = await transEODetailToFrontEnd(detailRes.data);
        } else {
            return
        }
        setDiagStatus({
            isOpen: true,
            content: 1,
            selectedEO: eoDetail,
            startTime: new Date()
        });
    };
    // Actions after click the Confirm button in the body row
    const handleRowConfirm = async (item) => {
        const confirmRes = await reqConfirmEO(item);
        if (confirmRes.status) {
            message.success(t("confirmSuccessful"));
            // Refresh
            handleRefreshData(page, perPage, edConditions);
        }       
    };

    // Actions after click the Unconfirm button in the body row
    const handleRowUnconfirm = async (item) => {
        const unconfirmRes = await reqUnConfirmEO(item);
        if (unconfirmRes.status) {
            message.success(t("unconfirmSuccessful"));
            // Refresh
            handleRefreshData(page, perPage, edConditions);
        }       
    };

    // Actions after click back button in the EO Review Dialog
    const handleGoBack = () => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedEO: undefined,
            startTime: undefined
        });
        // Refresh
        handleRefreshData(page, perPage, edConditions);
    };

    // Dialog display content Component
    const DiagContent = ({ content }) => {
        switch (content) {
            case 1:
                return <ReviewEO
                    isOpen={diagStatus.isOpen}
                    eoData={diagStatus.selectedEO}
                    startTime={diagStatus.startTime}
                    onBack={handleGoBack}
                />;
            case 2:
                return <QueryPanel
                    title="eoFilterCondition"
                    queryFields={eoQueryFields}
                    initalConditions={edConditions}
                    onOk={handleEoQueryOk}
                    onCancel={handleDiagClose}
                    id="eoQueryPanel" />;
            default:
                return null;
        }
    };

    // Actions after perPage changed
    const hangdlePerPageChange = (event) => {
        const newPerPage = parseInt(event.target.value, 10);
        // Refresh
        handleRefreshData(0, newPerPage, edConditions);
    };
    // Actions after page changed
    const handleChangePage = (newPage) => {
        // Refresh
        handleRefreshData(newPage, perPage, edConditions);
    };

    return (
        <>
            <PageTitle pageName={t("MenuEOReview")} displayHelp={false} helpUrl="#" />
            <Divider my={2} />
            <DocListPaging
                columns={columns}
                rows={eosPaging.eos}
                selectColumnVisible={false}
                headRefreshVisible={false}
                headFilterVisible={true}
                headAddVisible={false}
                headDelMultipleVisible={false}
                filterAction={handleFilterAction}
                rowActionsDefine={rowActionsDefine}
                rowViewDetail={handleViewAction}
                rowStart={handleRowConfirm}
                rowStop={handleRowUnconfirm}
                rowCount={eosPaging.count}
                rowsPerPage={perPage}
                page={page}
                pageChangeAction={(e, newPage) => handleChangePage(newPage)}
                rowsPerPageChangeAction={hangdlePerPageChange}
                docListTitle="executionOrderListPagination"
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

export default ExecutionOrderReview;