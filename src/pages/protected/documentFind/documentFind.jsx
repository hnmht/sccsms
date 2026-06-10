import { useMemo, useState } from "react";
import { Dialog } from "@mui/material";
import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import ScReport from "../../../component/ScReport/ScReport";
import { QueryPanel, transConditionsToString } from "../../../component/QueryPanel";

import { reqGetDocReport } from "../../../api/document";
import { generateDocReportDefaultCons, generateDocReportFields, defaultHideCol, columnDef } from "./constructor";
import { useTranslation } from "react-i18next";

// Find Document Report
const FindDocument = () => {
    const [conditions, setConditions] = useState(generateDocReportDefaultCons());
    const [rows, setRows] = useState([]);
    const [diagOpen, setDiagOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const queryFields = useMemo(generateDocReportFields, []);
    const columns = useMemo(columnDef, [i18n.language]);
    const columnVisibility = useMemo(defaultHideCol, []);

    // Request Document Report from backend
    const handleRequestData = async (cons = conditions) => {
        let queryString = transConditionsToString(cons);
        let res = await reqGetDocReport({ queryString: queryString });
        let newRows = [];
        if (res.status) {
            newRows = res.data;
        }
        setRows(newRows);
    }
    // Actions after click ok button in the Query Panel
    const handleQueryOk = async (cons) => {
        setConditions(cons);
        setDiagOpen(false);
        // Request Document Report from backend
        handleRequestData(cons);
    };

    // Actions after click fiter button in the header
    const handleFilterAction = async () => {
        setDiagOpen(true);
    };

    return (<>
        <PageTitle pageName={t("MenuDocumentFind")} displayHelp={false} helpUrl="#" />
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

export default FindDocument;