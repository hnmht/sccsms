import { useMemo, useState } from "react";
import { Dialog } from "@mui/material";
import { Divider } from "../../../../component/ScMui/ScMui";
import PageTitle from "../../../../component/PageTitle/PageTitle";
import ScReport from "../../../../component/ScReport/ScReport";
import { QueryPanel, transConditionsToString } from "../../../../component/QueryPanel";

import { reqIRFReport } from "../../../../api/report";
import { generateIRFQueryFields, generateIRFRepCons, defaultHideCol, columnDef } from "./constructor";
import { useTranslation } from "react-i18next";

// Issue Resolution Form Status Report
const IRFStatus = () => {
    const [conditions, setConditions] = useState(generateIRFRepCons());
    const [rows, setRows] = useState([]);
    const [diagOpen, setDiagOpen] = useState(false);
    const queryFields = useMemo(generateIRFQueryFields, []);
    const { t, i18n } = useTranslation();
    const columns = useMemo(columnDef, [i18n.language]);
    const columnVisibility = useMemo(defaultHideCol, [])

    // Request IRF Report data from the backend
    const handleRequestData = async (cons = conditions) => {
        let queryString = transConditionsToString(cons);
        let res = await reqIRFReport({ queryString: queryString });
        let newRows = [];
        if (res.status) {
            newRows = res.data;
        }
        setRows(newRows);
    }
    // Actions after click ok button in Query Panel
    const handleQueryOk = async (cons) => {
        setConditions(cons);
        setDiagOpen(false);
        // Request data from backend
        handleRequestData(cons);
    };

    // Actions after click filter button in the header
    const handleFilterAction = async () => {
        setDiagOpen(true);
    };

    return (<>
        <PageTitle pageName={t("MenuIRFStatus")} displayHelp={false} helpUrl="#" />
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

export default IRFStatus;