import { dayjs } from "../../../../i18n/dayjs";
import { cloneDeep } from "lodash";
import { GetCacheDocById } from "../../../../storage/db/db";
import { GetDataTypeDefaultValue } from "../../../../storage/dataTypes";
import store from "../../../../store";
import {
    CellCreateTime,
    CellCreator,
    CellModifyTime,
    CellModifier,
    CellConfirmTime,
    CellConfirmer,
    CellVoucherStatus,
    CellDept,
    CellCSA,
    CellEPT,
    CellBillDate,
    CellExecutor
} from "../../pub/pubFunction";
import { CellDescription } from "../../pub/pubComponent";

// Is the row copyAdd button enabled
const rowCopyAddDisabled = (row) => {
    return false;
};
// Is the row delete button enabled
const rowDelDisabled = (row) => {
    const { user } = store.getState();
    return !(row.status === 0 && row.creator.id === user.id);
};
// Is the row view button enabled
const rowViewDisabled = () => {
    return false;
};
// Is the row edit button enabled
const rowEditDisabled = (row) => {
    const { user } = store.getState();
    return !(row.status === 0 && row.creator.id === user.id);
};
// Is the Row confirm button enabled
const rowStartDisabled = (row) => {
    return !(row.status === 0);
};
// Is the row un-confirm button enabled
const rowStopDisabled = (row) => {
    const { user } = store.getState();
    return !(row.status === 1 && row.confirmer.id === user.id);
};

// Is the Batch Delete button enabled
export function delMultipleDisabled(selectedRows) {
    const { user } = store.getState();
    let num = 0;
    if (selectedRows.length === 0) {
        return true;
    }
    selectedRows.forEach(wo => {
        if (wo.status !== 0 || wo.creator.id !== user.id) {
            num = num + 1;
        }
    })
    return num > 0;
};

// Define row button
export const rowActionsDefine = {
    rowCopyAdd: {
        visible: false,
        disabled: rowCopyAddDisabled,
        color: "success",
        tips: "copyAdd",
        icon: "CopyNewIcon",
    },
    rowViewDetail: {
        visible: true,
        disabled: rowViewDisabled,
        color: "secondary",
        tips: "detail",
        icon: "DetailIcon",
    },
    rowEdit: {
        visible: true,
        disabled: rowEditDisabled,
        color: "warning",
        tips: "edit",
        icon: "EditIcon",
    },
    rowDelete: {
        visible: true,
        disabled: rowDelDisabled,
        color: "error",
        tips: "delete",
        icon: "DeleteIcon",
    },
    rowStart: {
        visible: true,
        disabled: rowStartDisabled,
        color: "success",
        tips: "confirm",
        icon: "StartIcon",
    },
    rowStop: {
        visible: true,
        disabled: rowStopDisabled,
        color: "error",
        tips: "unconfirm",
        icon: "CancelConfirmIcon",
    },
};
// Define Execution Order table columns
export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 20, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "billNumber", label: "billNumber", alignment: "center", minWidth: 40, visible: true, sortField: "billNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "billDate", label: "billDate", alignment: "center", minWidth: 30, visible: true, sortField: "billDate", sort: true, display: { type: 1, cell1: CellBillDate } },
    { id: "csa", label: "csa", alignment: "center", minWidth: 50, visible: true, sortField: "csa", sort: true, display: { type: 1, cell1: CellCSA } },
    { id: "ept", label: "ept", alignment: "center", minWidth: 60, sortField: "ept.id", visible: true, sort: true, display: { type: 1, cell1: CellEPT } },
    { id: "executor", label: "executor", alignment: "center", minWidth: 30, visible: true, sortField: "executor", sort: true, display: { type: 1, cell1: CellExecutor } },
    { id: "description", label: "description", alignment: "center", minWidth: 100, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "department", label: "department", alignment: "center", minWidth: 40, visible: true, sortField: "department.id", sort: true, display: { type: 1, cell1: CellDept } },
    { id: "status", label: "status", alignment: "center", minWidth: 50, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellVoucherStatus } },
    { id: "sourceBillNumber", label: "sourceBillNumber", alignment: "left", minWidth: 40, visible: true, sortField: "sourceBillNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "sourceRowNumber", label: "sourceRowNumber", alignment: "center", minWidth: 40, visible: false, sortField: "sourceRowNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "creator", label: "creator", alignment: "center", minWidth: 30, visible: true, sortField: "creator.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createDate", label: "createDate", alignment: "center", minWidth: 30, visible: false, sortField: "createDate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifier", label: "modifier", alignment: "center", minWidth: 30, visible: false, sortField: "modifier.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifyDate", label: "modifyDate", alignment: "center", minWidth: 60, visible: false, sortField: "modifyDate", sort: true, display: { type: 1, cell1: CellModifyTime } },
    { id: "confirmer", label: "confirmer", alignment: "center", minWidth: 30, visible: false, sortField: "confirmer.name", sort: true, display: { type: 1, cell1: CellConfirmer } },
    { id: "confirmDate", label: "confirmDate", alignment: "center", minWidth: 60, visible: false, sortField: "confirmDate", sort: true, display: { type: 1, cell1: CellConfirmTime } },
];

// Work Order Query fields definition
export const woQueryFields = [
    { id: 1, value: "h.billDate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
    { id: 2, value: "h.billNumber", label: "billNumber", inputType: 301, resultType: "string", resultfield: "" },
    { id: 3, value: "h.deptid", label: "department", inputType: 520, resultType: "object", resultfield: "id" },
    { id: 4, value: "b.executorid", label: "executor", inputType: 510, resultType: "object", resultfield: "id" },
    { id: 5, value: "b.csaid", label: "csa", inputType: 570, resultType: "object", resultfield: "id" },
    { id: 6, value: "b.creatorid", label: "creator", inputType: 510, resultType: "object", resultfield: "id" },
    { id: 7, value: "b.eptid", label: "ept", inputType: 580, resultType: "object", resultfield: "id" }
];
// Generate Work Order default query conditions
export function generateWOConditions() {
    const { user } = store.getState();
    const currentPerson = user.person;

    let conditions = [
        {
            logic: "and",
            field: { id: 1, value: "h.billDate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
            compare: { id: "greaterthanequal", label: 'greaterThanEqual', value: '>=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: dayjs().weekday(0).startOf("day"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "h.billDate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
            compare: { id: "lessthanequal", label: 'lessThanEqual', value: '<=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: dayjs(new Date()).endOf("day"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 4, value: "b.executorid", label: "executor", inputType: 510, resultType: "object", resultfield: "id" },
            compare: { id: "equal", label: 'equal', value: '=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: currentPerson,
            isNecessary: false
        }
    ];
    return conditions;
}

// Execution Order query fields definition
export const eoQueryFields = [
    { id: 1, value: "h.billDate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
    { id: 2, value: "h.billNumber", label: "billNumber", inputType: 301, resultType: "string", resultfield: "" },
    { id: 3, value: "h.deptid", label: "department", inputType: 520, resultType: "object", resultfield: "id" },
    { id: 4, value: "h.status", label: "status", inputType: 405, resultType: "int", resultfield: "" },
    { id: 5, value: "h.sourceBillNumber", label: "sourceBillNumber", inputType: 301, resultType: "string", resultfield: "" },
    { id: 6, value: "h.executorid", label: "executor", inputType: 510, resultType: "object", resultfield: "id" },
    { id: 7, value: "h.csaid", label: "csa", inputType: 570, resultType: "object", resultfield: "id" },
    { id: 8, value: "h.creatorid", label: "creator", inputType: 510, resultType: "object", resultfield: "id" },
    { id: 9, value: "h.eptid", label: "ept", inputType: 580, resultType: "object", resultfield: "id" }
];

// Generate Execution Order default conditions
export function generateEOConditions() {
    const { user } = store.getState();
    const currentPerson = user.person;
    let conditions = [
        {
            logic: "and",
            field: { id: 1, value: "h.billDate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
            compare: { id: "greaterthanequal", label: 'greaterThanEqual', value: '>=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: dayjs().weekday(0).startOf("day"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "h.billDate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
            compare: { id: "lessthanequal", label: 'lessThanEqual', value: '<=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: dayjs(new Date()).endOf("day"),
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

// Execution Order Row default attachment
const bodyFiles = {
    id: 0,
    billBID: 0,
    billHID: 0,
    file: { id: 0, hash: "" },
    dr: 0,
};

// Execution Order new row default values
export const voucherRow = {
    id: 0,
    hid: 0,
    rowNumber: 10,
    epa: {
        id: 0,
        code: "",
        name: "",
        epc: { id: 0, name: "", description: "", fatherID: 0, status: 0 },
        description: "",
        status: 0,
        resultType: { id: 301, name: "string", dataType: "string", inputMode: "input" },
        udc: { id: 0, name: "", description: "" },
        defaultValue: "",
        isCheckError: 0,
        errorValue: "",
        isRequireFile: 0,
        isOnSitePhoto: 0,
        riskLevel: { id: 0, name: "", color: "white", description: "" }
    },
    allowDelRow: 1,
    executionValue: "",
    executionValueDisp: "",
    files: [bodyFiles],
    description: "",
    epaDescription: "",
    isCheckError: 0,
    errorValue: "",
    errorValueDisp: "",
    isRequireFile: 0,
    isOnSitePhoto: 0,
    riskLevel: { id: 0, name: "", color: "white", description: "" },
    isIssue: 0,
    isRectify: 0,
    isHandle: 0,
    issueOwner: { id: 0, code: "", name: "" },
    handleStartTime: dayjs(new Date()),
    handleEndTime: dayjs(new Date()),
    status: 0,
    isFromEpt: 0,
    dr: 0
};

// Convert the Execution Project Template Body to Execution Order Body
export const eptBodyToEoBody = (eptBody, startTime, endTime, handlePerson) => {
    let eoBody = [];
    if (eptBody.length === 0) {
        eoBody = [voucherRow];
    } else {
        eptBody.forEach(eptRow => {
            let edRow = cloneDeep(voucherRow);
            edRow.rowNumber = eptRow.rowNumber;
            edRow.epa = eptRow.epa;
            edRow.allowDelRow = eptRow.allowDelRow;
            edRow.executionValue = eptRow.defaultValue;
            edRow.executionValueDisp = eptRow.defaultvaluedisp;
            edRow.files = [];
            edRow.epaDescription = eptRow.description;
            edRow.isCheckError = eptRow.isCheckError;
            edRow.errorValue = eptRow.errorValue;
            edRow.errorValueDisp = eptRow.errorValueDisp;
            edRow.isRequireFile = eptRow.isRequireFile;
            edRow.isOnSitePhoto = eptRow.isOnSitePhoto;
            edRow.isFromEpt = 1;
            edRow.issueOwner = handlePerson;
            edRow.handleStartTime = dayjs(startTime).add(24, "hour");
            edRow.handleEndTime = dayjs(endTime).add(24, "hour");
            edRow.riskLevel = eptRow.riskLevel;
            eoBody.push(edRow);
        });
    }

    return eoBody;
};
// Execution Order voucher body columns
export const bodyColumns = [
    { id: "action", label: "action", alignment: "center", width: 80, maxWidth: 80, minWidth: 80, visible: true, allowNul: true, sortField: "action", sort: true, display: { type: 0, cell1: null } },
    { id: "rowNumber", label: "rowNumber", alignment: "left", width: 60, maxWidth: 60, minWidth: 60, visible: true, allowNul: true, sortField: "rowNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "epa", label: "epa", alignment: "left", width: 256, maxWidth: 512, minWidth: 80, visible: true, allowNul: false, sortField: "epa.name", sort: true, display: { type: 0, cell1: null } },
    { id: "executionValue", label: "executionValue", alignment: "left", width: 128, maxWidth: 256, minWidth: 80, visible: true, allowNul: false, sortField: "executionValue", sort: true, display: { type: 0, cell1: null } },
    { id: "files", label: "files", alignment: "left", width: 60, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "files", sort: true, display: { type: 0, cell1: null } },
    { id: "riskLevel", label: "riskLevel", alignment: "left", width: 120, maxWidth: 144, minWidth: 60, visible: true, allowNul: false, sortField: "riskLevel.name", sort: true, display: { type: 0, cell1: null } },
    { id: "epaDescription", label: "epaDescription", alignment: "left", width: 200, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "epaDescription", sort: true, display: { type: 0, cell1: null } },
    { id: "description", label: "description", alignment: "left", width: 200, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "description", sort: true, display: { type: 0, cell1: null } },
    { id: "isIssue", label: "isIssue", alignment: "left", width: 60, maxWidth: 128, minWidth: 20, visible: true, allowNul: true, sortField: "isIssue", sort: true, display: { type: 0, cell1: null } },
    { id: "isRectify", label: "isRectify", alignment: "left", width: 60, maxWidth: 512, minWidth: 20, visible: true, allowNul: true, sortField: "isRectify", sort: true, display: { type: 0, cell1: null } },
    { id: "isHandle", label: "isHandle", alignment: "left", width: 60, maxWidth: 512, minWidth: 20, visible: true, allowNul: true, sortField: "isHandle", sort: true, display: { type: 0, cell1: null } },
    { id: "issueOwner", label: "issueOwner", alignment: "left", width: 120, maxWidth: 512, minWidth: 20, visible: true, allowNul: true, sortField: "issueOwner", sort: true, display: { type: 0, cell1: null } },
    { id: "handleStartTime", label: "handleStartTime", alignment: "left", width: 150, maxWidth: 512, minWidth: 20, visible: true, allowNul: true, sortField: "handleStartTime", sort: true, display: { type: 0, cell1: null } },
    { id: "handleEndTime", label: "handleEndTime", alignment: "left", width: 150, maxWidth: 512, minWidth: 20, visible: true, allowNul: true, sortField: "handleEndTime", sort: true, display: { type: 0, cell1: null } },
    { id: "isRequireFile", label: "isRequireFile", alignment: "left", width: 60, maxWidth: 128, minWidth: 20, visible: true, allowNul: true, sortField: "isRequireFile", sort: true, display: { type: 0, cell1: null } },
    { id: "isOnSitePhoto", label: "isOnSitePhoto", alignment: "left", width: 60, maxWidth: 128, minWidth: 20, visible: true, allowNul: true, sortField: "isOnSitePhoto", sort: true, display: { type: 0, cell1: null } },
    { id: "status", label: "status", alignment: "left", width: 100, maxWidth: 120, minWidth: 20, visible: true, allowNul: true, sortField: "status", sort: true, display: { type: 0, cell1: null } }
];
// Check Execution Order row errors
export const checkForProblem = (resultTypeId, errorValue, value) => {
    switch (resultTypeId) {
        case 301:
        case 302:
        case 306:
        case 307:
        case 401:
        case 404:
            return errorValue === value ? 1 : 0;
        case 510:
        case 520:
        case 525:
        case 530:
        case 540:
        case 550:
            return errorValue.id === value.id ? 1 : 0;
        default:
            return 0;
    }
};

// Convert Execution Order data To backend Data
export function transEOToBackend(ed) {
    const newEO = cloneDeep(ed);
    ed = null; // Release memory
    delete newEO.ept.body;
    delete newEO.createDate;
    delete newEO.modifyDate;
    delete newEO.confirmDate;
    newEO.body.map((row) => {
        switch (row.epa.resultType.id) {
            case 301:
                row.executionValueDisp = row.executionValue;
                break;
            case 306:
                row.executionValueDisp = row.executionValue === "" ? "" : dayjs(row.executionValue, "YYYYMMDD").format("YYYY-MM-DD");
                break;
            case 307:
                row.executionValueDisp = row.executionValue === "" ? "" : dayjs(row.executionValue, "YYYYMMDDHHmm").format("YYYY-MM-DD HH:mm");
                break;
            case 302:
                row.executionValue = row.executionValue.toString();
                row.executionValueDisp = row.executionValue.toString();
                row.errorValue = row.errorValue.toString();
                break;
            case 401:
                row.executionValueDisp = row.executionValue === 0 ? "" : row.executionValue === 1 ? "male" : "female";
                row.executionValue = row.executionValue.toString();
                row.errorValue = row.errorValue.toString();
                break;
            case 404:
                row.executionValueDisp = row.executionValue === 0 ? "N" : row.executionValue === 1 ? "Y" : "";
                row.executionValue = row.executionValue.toString();
                row.errorValue = row.errorValue.toString();
                break;
            case 510:
            case 520:
            case 525:
            case 530:
            case 540:
            case 550:
                row.executionValueDisp = row.executionValue.name;
                row.executionValue = row.executionValue.id.toString();
                row.errorValue = row.errorValue.id.toString();
                break;
            default:
                console.error("No matching DataType");
        }
        row.epa.defaultValue = "";
        row.epa.errorValue = "";
        return row;
    });

    return newEO;
}

// Convert backend Execution Order details To frontend data
export const transEODetailToFrontEnd = async (edDetail) => {
    async function transToFront() {
        // Get Execution Project Template ID
        let eptID = edDetail.ept.id;
        edDetail.ept = await GetCacheDocById("ept", eptID)
        for (let row of edDetail.body) {
            // Modify body row epa
            let epaID = row.epa.id;
            row.epa = await GetCacheDocById("epa", epaID);
            // Convert body row executionValue and errorValue
            switch (row.epa.resultType.id) {
                case 301:
                case 306:
                case 307:
                    break;
                case 302:
                    row.executionValue = parseFloat(row.executionValue);
                    row.errorValue = parseFloat(row.errorValue);
                    break;
                case 401:
                case 404:
                    row.executionValue = parseInt(row.executionValue);
                    row.errorValue = parseInt(row.errorValue);
                    break;
                case 510:
                case 520:
                case 525:
                case 530:
                case 540:
                case 550:
                    row.executionValue = row.executionValue !== "0" ? await GetCacheDocById(row.epa.resultType.frontDb, parseInt(row.executionValue)) : GetDataTypeDefaultValue(row.epa.resultType.id);
                    row.errorValue = row.errorValue !== "0" ? await GetCacheDocById(row.epa.resultType.frontDb, parseInt(row.errorValue)) : GetDataTypeDefaultValue(row.epa.resultType.id);
                    break;
                default:
                    console.error("No matching DataType");
            }
        }
    }

    await transToFront();

    return edDetail;
};