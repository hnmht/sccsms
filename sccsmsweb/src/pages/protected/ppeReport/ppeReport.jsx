import { useMemo, useState } from "react";
import { Dialog } from "@mui/material";
import { useTranslation } from "react-i18next";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import ScReport from "../../../component/ScReport/ScReport";
import { QueryPanel, transConditionsToString } from "../../../component/QueryPanel";

import { reqGetPPEIFReport } from "../../../api/ppeIssuanceForm";
import { generateReportDefaultCons, generateReportFields, defaultHideCol, columnDef } from "./constructor";

// Personal Protective Equipment Insuance Form Report
const PPEReport = () => {
    const [conditions, setConditions] = useState(generateReportDefaultCons());
    const [rows, setRows] = useState([]);
    const [diagOpen, setDiagOpen] = useState(false);
    const queryFields = useMemo(generateReportFields, []);
    const { t, i18n } = useTranslation();

    const columns = useMemo(columnDef, [i18n.language]);
    const columnVisibility = useMemo(defaultHideCol, [])

    const handleRequestData = async (cons = conditions) => {
        let queryString = transConditionsToString(cons);
        let res = await reqGetPPEIFReport({ queryString: queryString });
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
        // Request Data from backend
        handleRequestData(cons);
    };

    // Actions after click Filter button in the header
    const handleFilterAction = async () => {
        setDiagOpen(true);
    };

    return (<>
        <PageTitle pageName={t("MenuPPES")} displayHelp={false} helpUrl="#" />
        <Divider my={2} />
        <ScReport
            rows={rows}
            columns={columns}
            defaultHideColumn={columnVisibility}
            filterAction={handleFilterAction}
            enableStickyFooter={false}
        />
        <Dialog
            open={diagOpen}
            fullWidth
            maxWidth={"lg"}
            onClose={() => setDiagOpen(false)}
            closeAfterTransition={false}
        >
            <QueryPanel
                title="queryConditions"
                queryFields={queryFields}
                initalConditions={conditions}
                onOk={handleQueryOk}
                onCancel={() => setDiagOpen(false)}
            />
        </Dialog>
    </>);
};

export default PPEReport;