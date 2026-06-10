import { useMemo, useState } from "react";
import { Dialog } from "@mui/material";
import { useTranslation } from "react-i18next";

import ScReport from "../../../component/ScReport/ScReport";
import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import { QueryPanel, transConditionsToString } from "../../../component/QueryPanel";
import { reqGetRecivedTrainingReport } from "../../../api/trainingRecord";

import { generateReportDefaultCons, generateReportFields, defaultHideCol, columnDef } from "./constructor";

// Received Training Report
const ReceivedTraining = () => {
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
        let res = await reqGetRecivedTrainingReport({ queryString: queryString });
        let newRows = [];
        if (res.status) {
            newRows = res.data;
        }
        setRows(newRows);
    }
    // Actions after click ok in the query panel
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

    // Actions after the checkbox value changed
    const handleDisplayFooterChange = (event) => {
        setDisplayFooter(event.target.checked);
    };

    return (<>
        <PageTitle pageName={t("MenuTPS")} displayHelp={false} helpUrl="#" />
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

export default ReceivedTraining;