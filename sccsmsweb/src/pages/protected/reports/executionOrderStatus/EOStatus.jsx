import { useState, useMemo } from "react";
import { Dialog, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import PageTitle from "../../../../component/PageTitle/PageTitle";
import ScReport from "../../../../component/ScReport/ScReport";
import { QueryPanel, transConditionsToString } from "../../../../component/QueryPanel";
import { reqEOReport } from "../../../../api/report";
import { generateEODefaultCons, columnDef, defaultHideCol, generateEOQueryFields } from "./constructor";

// Execution Order status Report
const EOStatus = () => {
    const [conditions, setConditions] = useState(generateEODefaultCons());
    const [rows, setRows] = useState([]);
    const [diagOpen, setDiagOpen] = useState(false);
    const queryFields = useMemo(generateEOQueryFields, []);
    const { t, i18n } = useTranslation();
    const columns = useMemo(columnDef, [i18n.language]);
    const columnVisibility = useMemo(defaultHideCol, [])

    const handleRequestData = async (cons = conditions) => {
        let queryString = transConditionsToString(cons);
        let res = await reqEOReport({ queryString: queryString });
        let newRows = [];
        if (res.status) {
            newRows = res.data;
        }
        setRows(newRows);
    }
    // Actions after click ok button in the query panel
    const handleQueryOk = async (cons) => {
        setConditions(cons);
        setDiagOpen(false);
        // Request data from backend
        handleRequestData(cons);
    };

    // Actions after click fiter button in the header
    const handleFilterAction = async () => {
        setDiagOpen(true);
    };
    return (<>
        <PageTitle pageName={t("MenuEOStatus")} displayHelp={false} helpUrl="#" />
        <Divider my={2} />
        <ScReport
            rows={rows}
            columns={columns}
            defaultHideColumn={columnVisibility}
            filterAction={handleFilterAction}
        />
        <Dialog
            open={diagOpen}
            fullWidth
            maxWidth={"lg"}
            onClose={() => setDiagOpen(false)}
            closeAfterTransition={false}
        >
            <QueryPanel
                title={t("queryConditions")}
                queryFields={queryFields}
                initalConditions={conditions}
                onOk={handleQueryOk}
                onCancel={() => setDiagOpen(false)}
            />
        </Dialog>
    </>);
};

export default EOStatus;