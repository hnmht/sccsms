import { useState, useMemo } from "react";
import { Dialog, Divider } from "@mui/material";
import PageTitle from "../../../../component/PageTitle/PageTitle";
import ScReport from "../../../../component/ScReport/ScReport";
import { QueryPanel, transConditionsToString } from "../../../../component/QueryPanel";
import { reqWOReport } from "../../../../api/report";
import { generateWODefaultCons, columnDef, columnVisibility, generateWOQueryFields } from "./constructor";
import { useTranslation } from "react-i18next";
// Work Order Status Report
const WorkOrderStatus = () => {
    const [woConditions, setWoConditions] = useState(generateWODefaultCons());
    const [rows, setRows] = useState([]);
    const [diagOpen, setDiagOpen] = useState(false);
    const woQueryFields = useMemo(generateWOQueryFields, []);
    const { t, i18n } = useTranslation();
    const columns = useMemo(columnDef, [i18n.language, i18n]);

    // Request data from backend
    const handleRequestData = async (cons = woConditions) => {
        let queryString = transConditionsToString(cons);
        let worsRes = await reqWOReport({ queryString: queryString });
        let newRows = [];
        if (worsRes.status) {
            newRows = worsRes.data;
        }
        setRows(newRows);
    }
    // Actions after click ok button in the query panel
    const handleWoQueryOk = async (cons) => {
        setWoConditions(cons);
        setDiagOpen(false);
        // Request data from backend
        handleRequestData(cons);
    };

    // Actions after click the filter from backend button
    const handleFilterAction = async () => {
        setDiagOpen(true);
    };

    return (<>
        <PageTitle pageName={t("MenuWOStatus")} displayHelp={false} helpUrl="#" />
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
                queryFields={woQueryFields}
                initalConditions={woConditions}
                onOk={handleWoQueryOk}
                onCancel={() => setDiagOpen(false)}
            />
        </Dialog>
    </>);
};

export default WorkOrderStatus;