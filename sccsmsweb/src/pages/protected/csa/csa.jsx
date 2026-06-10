import { Fragment, useState, useEffect } from "react";
import {
    Grid,
    Dialog
} from "@mui/material";
import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import DocList from "../../../component/DocList/DocList";
import Loader from "../../../component/Loader/Loader";
import CSCTree from "./cscTree";
import EditCSA from "./editCSA";
import { columns, rowActionsDefine, delMultipleDisabled, GetDynamicColumns } from "./constructor";
import { GetCSACacheByCategoryId, InitDocCache } from "../../../storage/db/db";
import { reqDeleteCS, reqDeleteCSs } from "../../../api/csa";
import { reqGetCSOs } from "../../../api/cso";
import { message } from "mui-message";
import { MultiSortByArr } from "../../../utils/tools";
import { useTranslation } from "react-i18next";
// Construction Site Archive List
const CSA = () => {
    const [dynamicColumns, setDynamicColumns] = useState(undefined);
    const [options, setOptions] = useState([]);
    const [rows, setRows] = useState([]);
    const [currentCSC, setCurrentCSC] = useState(undefined);
    const [diagStatus, setDiagStatus] = useState({
        currentCSA: undefined,
        diagOpen: false,
        isNew: false,
        isModify: false
    });
    const { t } = useTranslation();

    useEffect(() => {
        async function getSioption() {
            let newColumns = columns;
            let newOptions = [];
            const res = await reqGetCSOs();
            if (res.status) {
                newOptions = res.data;
                newOptions.sort(MultiSortByArr([{ field: "id", order: "asc" }]));
                newColumns = GetDynamicColumns(newColumns, newOptions);
            }
            setDynamicColumns(newColumns);
            setOptions(newOptions);
        }
        getSioption();
    }, []);

    // Close dialog
    const handleDiagClose = () => {
        setDiagStatus({
            currentCSA: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
    };
    // Actions after click the ok button in the dialog
    const handelDiagOk = () => {
        setDiagStatus({
            currentCSA: undefined,
            diagOpen: false,
            isNew: false,
            isModify: false
        });
        handleRefreshCSA();
    };
    // Actions after click the add button in the head
    const handleAddCS = () => {
        setDiagStatus({
            currentCSA: undefined,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };
    // Actions after click the copyAdd button in the body
    const handleRowCopyAdd = (doc) => {
        setDiagStatus({
            currentCSA: doc,
            diagOpen: true,
            isNew: true,
            isModify: false
        });
    };

    // Actions after click the Detail button in the body
    const handleRowDetail = (doc) => {
        setDiagStatus({
            currentCSA: doc,
            diagOpen: true,
            isNew: false,
            isModify: false
        });
    };
    // Actions after click the Edit button in the body
    const handleRowEdit = async (doc) => {
        setDiagStatus({
            currentCSA: doc,
            diagOpen: true,
            isNew: false,
            isModify: true
        });
    };
    // Actions after click the delete button in the body
    const handleRowDelete = async (doc) => {
        // Request the server to delete csa
        const delRes = await reqDeleteCS(doc);
        if (delRes.status) {
            message.success(t("deleteSuccessful"));
        } 
        // Get latest csa front-end page
        handleRefreshCSA();
    };

    // Actions after click the batch delete button in the head
    const handleDelMultipleAction = async (docs) => {
        const res = await reqDeleteCSs(docs);
        if (res.status) {
            message.success(t("batchDeleteSuccessful"));
        } 
        // Get latest csa front-end cache
        handleRefreshCSA();
    };
    // Get current CSC
    const handleGetCurrentCSC = async (item) => {
        // Set current Construction Site Category
        setCurrentCSC(item);
        // Retrieve all CSAs under the current category from indexdb
        const newSis = await GetCSACacheByCategoryId(item.id);
        // Refresh list
        setRows(newSis);
    };

    // Refresh csa list
    const handleRefreshCSA = async (sic = currentCSC) => {
        // Request latest CSAs from server
        await InitDocCache("csa");
        // Retrieve all CSAs under the current category from indexdb
        const newSis = await GetCSACacheByCategoryId(sic.id);
        // Refresh list
        setRows(newSis);
    };

    return (
        <Fragment>
            <PageTitle pageName={t("MenuCSA")} displayHelp={false} helpUrl="#" />
            <Divider my={2} />
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <CSCTree selectOk={handleGetCurrentCSC} />
                </Grid>
                <Grid item xs={10}>
                    {dynamicColumns !== undefined
                        ? <DocList
                            headAddDisabled={!currentCSC || currentCSC.status !== 0}
                            headRefreshDisabled={!currentCSC}
                            delMultipleDisabled={delMultipleDisabled}
                            delMultipleAction={handleDelMultipleAction}
                            columns={dynamicColumns}
                            rows={rows}
                            rowActionsDefine={rowActionsDefine}
                            refreshAction={() => handleRefreshCSA(currentCSC)}
                            addAction={handleAddCS}
                            rowCopyAdd={handleRowCopyAdd}
                            rowViewDetail={handleRowDetail}
                            rowEdit={handleRowEdit}
                            rowDelete={handleRowDelete}
                        />
                        : <Loader />
                    }
                </Grid>
            </Grid>
            <Dialog
                maxWidth="sm"
                onClose={handleDiagClose}
                open={diagStatus.diagOpen}
                sx={{ '& .MuiDialog-paper': { p: 0, minWidth: 1024, minHeight: 512 } }}
                closeAfterTransition={false}
            >
                <EditCSA
                    isOpen={diagStatus.diagOpen}
                    isNew={diagStatus.isNew}
                    isModify={diagStatus.isModify}
                    oriCS={diagStatus.currentCSA}
                    options={options}
                    CSC={currentCSC}
                    onCancel={handleDiagClose}
                    onOk={handelDiagOk}
                />
            </Dialog>
        </Fragment>
    );
}

export default CSA;