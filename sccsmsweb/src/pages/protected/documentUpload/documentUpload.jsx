import { useEffect, useState } from "react";
import {
    Grid,
    Dialog,
} from "@mui/material";
import { message } from "mui-message";
import { useTranslation } from "react-i18next";

import PageTitle from "../../../component/PageTitle/PageTitle";
import { Divider } from "../../../component/ScMui/ScMui";
import DocListPaging from "../../../component/DocList/DocListPaging";
import DcTree from "./dcTree";
import EditDocument from "./editDocument";

import { columns, rowActionsDefine, delMultipleDisabled } from "./constructor";
import { reqGetDocPage, reqDeleteDoc, reqDeleteDocs } from "../../../api/document";

// Upload Document
const DocumentUpload = () => {
    const [dc, setDc] = useState(undefined);
    const [docsPaging, setDocsPaging] = useState({ docs: [], count: 0, page: 0, perPage: 10 });
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [refresh, setRefresh] = useState(false);
    const [diagStatus, setDiagStatus] = useState({
        currentDoc: undefined,
        diagOpen: false,
        isNew: false,
        isModify: false
    });
    const { t } = useTranslation();

    useEffect(() => {
        // Refresh Document list
        const handleRefreshData = async (page1 = page, perPage1 = perPage, dc1 = dc) => {
            if (dc1 === undefined) {
                return
            }
            let docRes = await reqGetDocPage({ dc: dc1, page: page1, perPage: perPage1 });
            let newDocs = { docs: [], count: 0, page: 0, perPage: perPage1 };
            if (docRes.status) {
                newDocs = docRes.data;
            }
            setPage(newDocs.page);
            setPerPage(newDocs.perPage);
            setDocsPaging(newDocs);
        };
        handleRefreshData();
    }, [dc, page, perPage, refresh]);

    // Get current Document Category
    const handleGetCurrentDc = async (item) => {
        setDc(item);
    };

    // Actions after click add button in the header
    const handleAddDocument = () => {
        setDiagStatus({
            currentDoc: undefined,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };

    // Close Dialog
    const handleDiagClose = () => {
        setDiagStatus({
            currentDoc: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
        setRefresh(!refresh);
    };
    // Actions after click ok button in the Add Document Dialog
    const handelAddDocumentOk = () => {
        setDiagStatus({
            currentDoc: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
        // Refresh Document list
        setRefresh(!refresh);
    };
    // Actions after click detail button in the body row
    const handleRowDetail = (doc) => {
        setDiagStatus({
            currentDoc: doc,
            diagOpen: true,
            isNew: false,
            isModify: false
        });
    };
    // Actions after click edit button in the body row
    const handleRowEdit = async (doc) => {
        setDiagStatus({
            currentDoc: doc,
            diagOpen: true,
            isNew: false,
            isModify: true
        });
    };
    // Actions after click delete button in the body row
    const handleRowDelete = async (doc) => {
        // Request the backend server to delete the document
        const delRes = await reqDeleteDoc(doc);
        if (delRes.status) {
            message.success(t("deleteSuccessful"));
        }
        // Refresh the document list
        setRefresh(!refresh);
    };
    // Actions after click batch delete button in the header
    const handleDelMultipleAction = async (docs) => {
        const delRes = await reqDeleteDocs(docs);
        if (delRes.status) {
            message.success(t("batchDeleteSuccessful"));
        }
        // Refresh the Document list
        setRefresh(!refresh);
    };

    // Actions after the number of rows per page changes
    const hangdlePerPageChange = (event) => {
        const newPerPage = parseInt(event.target.value, 10);
        setPerPage(newPerPage);
    };
    // Actions after the number of page changes
    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    return (
        <>
            <PageTitle pageName={t("MenuDocumentUpload")} displayHelp={false} helpUrl="#" />
            <Divider my={2} />
            <Grid container spacing={2}>
                <Grid item xs={2} >
                    <DcTree
                        selectOk={handleGetCurrentDc}
                        t={t}
                    />
                </Grid>
                <Grid item xs={10}>
                    <DocListPaging
                        columns={columns}
                        rows={docsPaging.docs}
                        rowCount={docsPaging.count}
                        rowsPerPage={perPage}
                        page={page}
                        pageChangeAction={(e, newPage) => handleChangePage(newPage)}
                        rowsPerPageChangeAction={hangdlePerPageChange}
                        headAddDisabled={!dc || dc.id === 0}
                        headRefreshDisabled={!dc}
                        refreshAction={() => setRefresh(!refresh)}
                        addAction={handleAddDocument}
                        delMultipleAction={handleDelMultipleAction}
                        headDelMultipleVisible={true}
                        delMultipleDisabled={delMultipleDisabled}
                        rowActionsDefine={rowActionsDefine}
                        rowViewDetail={handleRowDetail}
                        rowEdit={handleRowEdit}
                        rowDelete={handleRowDelete}
                    />
                </Grid>
            </Grid>
            <Dialog
                maxWidth="sm"
                onClose={handleDiagClose}
                open={diagStatus.diagOpen}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 800, minHeight: 512 } }}
                closeAfterTransition={false}
            >
                <EditDocument
                    isOpen={diagStatus.diagOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriDoc={diagStatus.currentDoc}
                    DC={dc}
                    onCancel={handleDiagClose}
                    onOk={handelAddDocumentOk}
                    t={t}
                />
            </Dialog>
        </>
    );
};

export default DocumentUpload;