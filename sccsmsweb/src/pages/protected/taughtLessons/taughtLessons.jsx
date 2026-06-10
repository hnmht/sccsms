import { useMemo, useState } from "react";
import { Dialog } from "@mui/material";
import { useTranslation } from "react-i18next";

import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import ScReport from "../../../component/ScReport/ScReport";
import { QueryPanel, transConditionsToString } from "../../../component/QueryPanel";

import { reqGetTaughtLessonsReport } from "../../../api/trainingRecord";
import { generateReportDefaultCons, generateReportFields, defaultHideCol, columnDef } from "./constructor";

// Taught Lessons Report
const TaughtLessons = () => {
    const { t, i18n } = useTranslation();
    const [conditions, setConditions] = useState(generateReportDefaultCons());
    const [rows, setRows] = useState([]);
    const [diagOpen, setDiagOpen] = useState(false);
    const [displayFooter, setDisplayFooter] = useState(false);
    const queryFields = useMemo(generateReportFields, []);
    const columnVisibility = useMemo(defaultHideCol, []);
    const columns = useMemo(() => columnDef(rows, displayFooter, t), [i18n.language, rows, displayFooter, t]);

    // Request data from backend
    const handleRequestData = async (cons = conditions) => {
        let queryString = transConditionsToString(cons);
        let res = await reqGetTaughtLessonsReport({ queryString: queryString });
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
        // Request data from backend
        handleRequestData(cons);
    };

    // Actison after click filter button in the header
    const handleFilterAction = async () => {
        setDiagOpen(true);
    };

    // Action after the Checkbox changed
    const handleDisplayFooterChange = (event) => {
        setDisplayFooter(event.target.checked);
    };

    return (<>
        <PageTitle pageName={t("MenuTS")} displayHelp={false} helpUrl="#" />
        <Divider my={2} />
        <ScReport
            rows={rows}
            columns={columns}
            defaultHideColumn={columnVisibility}
            filterAction={handleFilterAction}
            enableStickyFooter={displayFooter}
            displayTotalCheck={true}
            showTotalRowChangeAction={handleDisplayFooterChange}
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

export default TaughtLessons;