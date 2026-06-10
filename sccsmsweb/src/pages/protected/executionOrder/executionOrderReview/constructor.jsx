import { dayjs } from "../../../../i18n/dayjs";
import { GetCacheDocById } from "../../../../storage/db/db";
import { GetDataTypeDefaultValue } from "../../../../storage/dataTypes";
import store from "../../../../store";
import { Chip } from "@mui/material";
import { i18n } from "../../../../i18n/i18n";
import {
    CellCreateTime,
    CellCreator,
    CellModifyTime,
    CellModifier,
    CellConfirmTime,
    CellConfirmer,
    CellVoucherStatus,
    CellCSA,
    CellEPT,
    CellExecutor,
    CellBillDate,
    CellDept
} from "../../pub/pubFunction";
import { CellDescription } from "../../pub/pubComponent";

// Is the row copyAdd button disabled
const rowCopyAddDisabled = (row) => {
    return true;
};
// Is the row delete button disabled
const rowDelDisabled = (row) => {
    return true;
};
// Is the row view button disabled
const rowViewDisabled = () => {
    return false;
};
// Is the row edit button disabled
const rowEditDisabled = (row) => {
    return true;
};
// Is the row confirm button disabled
const rowStartDisabled = (row) => {
    return !(row.status === 0);
};
// Is the row unconfirm button disabled
const rowStopDisabled = (row) => {
    const { user } = store.getState();
    return !(row.status === 1 && row.confirmer.id === user.id);
};
// Display Review Information content
const CellReview = (row, column) => {
    const label = i18n.t("timesAndSeconds", { times: row.reviewedNumber, seconds: row.reviewedSeconds });
    return row.reviewedNumber > 0
        ? <Chip label={label} color="success" />
        : ""
};
// Is the batch delete button disabled
export function delMultipleDisabled(selectedRows) {
    return true;
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
        tips: "review",
        icon: "DetailIcon",
    },
    rowEdit: {
        visible: false,
        disabled: rowEditDisabled,
        color: "warning",
        tips: "edit",
        icon: "EditIcon",
    },
    rowDelete: {
        visible: false,
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
// Define Execution Order list columns
export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 20, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "billNumber", label: "billNumber", alignment: "center", minWidth: 40, visible: true, sortField: "billNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "billDate", label: "billDate", alignment: "center", minWidth: 30, visible: true, sortField: "billDate", sort: true, display: { type: 1, cell1: CellBillDate } },
    { id: "csa", label: "csa", alignment: "center", minWidth: 50, visible: true, sortField: "csa", sort: true, display: { type: 1, cell1: CellCSA } },
    { id: "ept", label: "ept", alignment: "center", minWidth: 60, sortField: "ept.id", visible: true, sort: true, display: { type: 1, cell1: CellEPT } },
    { id: "executor", label: "executor", alignment: "center", minWidth: 30, visible: true, sortField: "executor", sort: true, display: { type: 1, cell1: CellExecutor } },
    { id: "description", label: "description", alignment: "center", minWidth: 100, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "department", label: "department", alignment: "center", minWidth: 40, visible: false, sortField: "department.id", sort: true, display: { type: 1, cell1: CellDept } },
    { id: "status", label: "status", alignment: "center", minWidth: 50, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellVoucherStatus } },
    { id: "review", label: "review", alignment: "center", minWidth: 50, visible: true, sortField: "reviewedNumber", sort: true, display: { type: 1, cell1: CellReview } },
    { id: "sourceBillNumber", label: "sourceBillNumber", alignment: "left", minWidth: 40, visible: true, sortField: "sourceBillNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "sourceRowNumber", label: "sourceRowNumber", alignment: "center", minWidth: 40, visible: false, sortField: "sourceRowNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "creator", label: "creator", alignment: "center", minWidth: 30, visible: false, sortField: "creator.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createDate", label: "createDate", alignment: "center", minWidth: 30, visible: false, sortField: "createDate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifier", label: "modifier", alignment: "center", minWidth: 30, visible: false, sortField: "modifier.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifyDate", label: "modifyDate", alignment: "center", minWidth: 60, visible: false, sortField: "modifyDate", sort: true, display: { type: 1, cell1: CellModifyTime } },
    { id: "confirmer", label: "confirmer", alignment: "center", minWidth: 30, visible: false, sortField: "confirmer.name", sort: true, display: { type: 1, cell1: CellConfirmer } },
    { id: "confirmDate", label: "confirmDate", alignment: "center", minWidth: 60, visible: false, sortField: "confirmDate", sort: true, display: { type: 1, cell1: CellConfirmTime } },
];

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
            value: dayjs(new Date()).startOf("day"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "h.billDate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
            compare: { id: "lessthanequal", label: 'lessThanEqual', value: '<=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: dayjs(new Date()),
            isNecessary: true
        }
    ];

    if (user.department && user.department.id !== 0) {
        conditions.push({
            logic: "and",
            field: { id: 3, value: "h.deptid", label: "department", inputType: 520, resultType: "object", resultfield: "id" },
            compare: { id: "equal", label: 'equal', value: '=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: user.department,
            isNecessary: false
        })
    } else {
        conditions.push({
            logic: "and",
            field: { id: 6, value: "h.executorid", label: "executor", inputType: 510, resultType: "object", resultfield: "id" },
            compare: { id: "equal", label: 'equal', value: '=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: currentPerson,
            isNecessary: false
        })
    }
    return conditions;
}

// Define Execution Order voucher body columns
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

// Conver backend Execution Order details to Frontend data
export const transEODetailToFrontEnd = async (eoDetail) => {
    async function transToFront() {
        let eptID = eoDetail.ept.id;
        eoDetail.ept = await GetCacheDocById("ept", eptID)
        for (let row of eoDetail.body) {
            let eidId = row.epa.id;
            row.epa = await GetCacheDocById("epa", eidId);
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

    return eoDetail;
};