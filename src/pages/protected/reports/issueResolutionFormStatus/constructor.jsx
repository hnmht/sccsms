import { DateTimeFormat, dayjs, CheckTimeZero } from "../../../../i18n/dayjs";
import ScInput from "../../../../component/ScInput";
import store from "../../../../store";
import { VoucherStatus } from "../../../../storage/dataTypes";
import { i18n } from "../../../../i18n/i18n";

const yesOrNo = ["", "Y"];
// Generate Issue Resolution Form Report condition fields
export const generateIRFQueryFields = () => {
    const edQueryFields = [
        { id: 1, value: "h.billdate", label: "eoBillDate", inputType: 306, resultType: "date", resultfield: "" },
        { id: 2, value: "h.billnumber", label: "eoNumber", inputType: 301, resultType: "string", resultfield: "" },
        { id: 3, value: "irf.billnumber", label: "irfNumber", inputType: 301, resultType: "string", resultfield: "" },
        { id: 4, value: "irf.billdate", label: "irfBillDate", inputType: 306, resultType: "date", resultfield: "" },
        { id: 5, value: "h.deptid", label: "department", inputType: 520, resultType: "object", resultfield: "id" },
        { id: 6, value: "h.executorid", label: "executor", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 7, value: "h.csaid", label: "csa", inputType: 570, resultType: "object", resultfield: "id" },
        { id: 8, value: "irf.creatorid", label: "creator", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 9, value: "irf.handlerid", label: "handler", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 10, value: "b.epaid", label: "epa", inputType: 560, resultType: "object", resultfield: "id" },
        { id: 11, value: "b.isissue", label: "isIssue", inputType: 404, resultType: "int", resultfield: "" },
        { id: 12, value: "b.isRectify", label: "isRectify", inputType: 404, resultType: "int", resultfield: "" },
        { id: 13, value: "b.ishandle", label: "isHandle", inputType: 404, resultType: "int", resultfield: "" },
        { id: 14, value: "b.isfinish", label: "isFinish", inputType: 404, resultType: "int", resultfield: "" },
    ];
    const options = store.getState().dynamicData.csos;
    let startid = 0;
    edQueryFields.forEach(field => {
        if (field.id > startid) {
            startid = field.id
        }
    });

    options.forEach((option) => {
        if (option.enable === 1) {
            startid++
            let field = {
                id: startid,
                value: "csa." + option.code,
                label: option.displayName,
                inputType: 550,
                resultType: "object",
                resultfield: "id",
                udc: option.udc
            }
            edQueryFields.push(field);
        }
    })

    return edQueryFields;
};

// Generate default IRF Report condition
export function generateIRFRepCons() {
    const { user } = store.getState();
    const currentPerson = user.person;
    let conditions = [
        {
            logic: "and",
            field: { id: 1, value: "h.billDate", label: "eoBillDate", inputType: 306, resultType: "date", resultfield: "" },
            compare: { id: "greaterthanequal", label: 'greaterThanEqual', value: '>=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: dayjs().weekday(0).startOf("day"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "h.billDate", label: "eoBillDate", inputType: 306, resultType: "date", resultfield: "" },
            compare: { id: "lessthanequal", label: 'lessThanEqual', value: '<=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: dayjs(new Date()),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 6, value: "h.executorid", label: "executor", inputType: 510, resultType: "object", resultfield: "id" },
            compare: { id: "equal", label: 'equal', value: '=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: currentPerson,
            isNecessary: false
        }
    ];
    return conditions;
}
// Define the report columns
export const columnDef = () => {
    let columns = [
        { accessorKey: 'eoBillNumber', header: 'eoNumber', size: 160 },
        { accessorKey: "eoRowNumber", header: "eoRowNumber", size: 100 },
        {
            accessorKey: "eoBillDate", header: "eoBillDate", size: 160,
            Cell: (({ cell }) => <span>{DateTimeFormat(cell.getValue(), "L")}</span>)
        },
        { accessorKey: 'eoHDeptCode', header: 'eoHDeptCode', size: 160 },
        { accessorKey: 'eoHDeptName', header: 'eoHDeptName', size: 160 },
        { accessorKey: 'csaCode', header: 'csaCode', size: 200 },
        { accessorKey: 'csaName', header: 'csaName', size: 260 },
        { accessorKey: 'csaID', header: 'csaID', size: 60 },
        { accessorKey: 'executorCode', header: 'executorCode', size: 160 },
        { accessorKey: 'executorName', header: 'executorName', size: 160 },
        { accessorKey: 'epaCode', header: 'epaCode', size: 260 },
        { accessorKey: 'epaName', header: 'epaName', size: 360 },
        {
            accessorKey: 'rlName', header: 'rlName', size: 140,
            Cell: (({ cell }) => {
                return (<span style={{ maxHeight: 32, minWidth: 120, display: "flex", alignItems: "center", justifyContent: "center", margin: 0, padding: 0, borderRadius: 4, backgroundColor: cell.row.original.rlcolor }}>
                    {cell.getValue()}
                </span>)
            })
        },
        { accessorKey: 'executionValueDisp', header: 'executionValueDisp', size: 160 },
        {
            accessorKey: "eorFiles", header: "eorFiles", size: 140, enableClickToCopy: false,
            Cell: (({ cell }) => {
                // console.log("cell.id:", cell.id)
                return <ScInput
                    dataType={902}
                    allowNull={true}
                    isEdit={false}
                    itemShowName="eorFiles"
                    itemKey={cell.id}
                    initValue={cell.getValue()}
                    pickDone={() => { }}
                    isBackendTest={false}
                    positionID={1}
                    key="eorFiles"
                />
            })
        },
        {
            accessorKey: "irfFiles", header: "irfFiles", size: 140, enableClickToCopy: false,
            Cell: (({ cell }) =>
                <ScInput
                    dataType={902}
                    allowNull={true}
                    isEdit={false}
                    itemShowName="irfFiles"
                    itemKey={cell.id}
                    initValue={cell.getValue()}
                    pickDone={() => { }}
                    isBackendTest={false}
                    positionID={1}
                    key="irfFiles"
                />
            )
        },
        { accessorKey: 'eoBDescription', header: 'eoBDescription', size: 200 },
        { accessorKey: 'isIssue', header: 'isIssue', size: 140, Cell: (({ cell }) => <span>{yesOrNo[cell.getValue()]}</span>) },
        { accessorKey: 'isRectify', header: 'isRectify', size: 140, Cell: (({ cell }) => <span>{yesOrNo[cell.getValue()]}</span>) },
        { accessorKey: 'isHandle', header: 'isHandle', size: 140, Cell: (({ cell }) => <span>{yesOrNo[cell.getValue()]}</span>) },
        { accessorKey: 'issueOwnerCode', header: 'issueOwnerCode', size: 160 },
        { accessorKey: 'issueOwnerName', header: 'issueOwnerName', size: 140 },
        {
            accessorKey: 'eoBStartTime', header: 'eoBStartTime', size: 160,
            Cell: (({ cell }) => <span>{CheckTimeZero(cell.getValue()) ? "" : DateTimeFormat(cell.getValue(), "LLL")}</span>)
        },
        {
            accessorKey: 'eoBEndTime', header: 'eoBEndTime', size: 160,
            Cell: (({ cell }) => <span>{CheckTimeZero(cell.getValue()) ? "" : DateTimeFormat(cell.getValue(), "LLL")}</span>)
        },
        { accessorKey: 'irfBillNumber', header: 'irfNumber', size: 160 },
        { accessorKey: 'handlerName', header: 'handlerName', size: 140 },
        { accessorKey: 'isFinish', header: 'isFinish', size: 160, Cell: (({ cell }) => <span>{yesOrNo[cell.getValue()]}</span>) },
        {
            accessorKey: 'irfStartTime', header: 'irfStartTime', size: 160,
            Cell: (({ cell }) => <span>{CheckTimeZero(cell.getValue()) ? "" : DateTimeFormat(cell.getValue(), "LLL")}</span>)
        },
        {
            accessorKey: 'irfEndTime', header: 'irfEndTime', size: 160,
            Cell: (({ cell }) => <span>{CheckTimeZero(cell.getValue()) ? "" : DateTimeFormat(cell.getValue(), "LLL")}</span>)
        },

        { accessorKey: 'irfDescription', header: 'irfDescription', size: 200 },
        { accessorKey: 'irfStatus', header: 'irfStatus', size: 160, Cell: (({ cell }) => <span>{i18n.t(VoucherStatus[cell.getValue()])}</span>) },
        { accessorKey: 'creatorCode', header: 'creatorCode', size: 160 },
        { accessorKey: 'creatorName', header: 'creatorName', size: 160 },
        { accessorKey: 'confirmerCode', header: 'confirmerCode', size: 160 },
        { accessorKey: 'confirmerName', header: 'confirmerName', size: 160 }
    ];
    // Translate header
    columns.map(column => {
        column.header = i18n.t(column.header);
        return column;
    })
    // Add Construction Site options columns
    const options = store.getState().dynamicData.csos;
    options.forEach(option => {
        if (option.enable === 1) {
            let field = {
                accessorKey: option.code + "Name",
                header: option.displayName,
                size: 140,
            }
            columns.push(field);
        }
    });
    return columns;
}
// Report default hidden columns
export const defaultHideCol = () => {
    return {
        eoBillNumber: false,
        eoRowNumber: false,
        eoBillDate: false,
        eoHDeptCode: false,
        eoHDeptName: false,
        csaCode: false,
        csaID: false,
        executorCode: false,
        epaCode: false,
        issueOwnerCode: false,
        creatorCode: false,
        creatorName: false,
        confirmerCode: false,
        confirmerName: false,
        executorName: false,
        isIssue: false,
        eoBDescription: false,
    }
};