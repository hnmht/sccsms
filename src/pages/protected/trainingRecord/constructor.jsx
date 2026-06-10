import { dayjs,DateTimeFormat } from "../../../i18n/dayjs";
import store from "../../../store";
import { CellCreateTime, CellCreator, CellModifyTime, CellModifier, CellConfirmTime, CellConfirmer, CellVoucherStatus, CellBillDate, CellDept, CellTC } from "../pub/pubFunction";
import { CellDescription } from "../../../component/ScInput/ScPub/PubComponent";
// Is the row Copy Add button enabled
const rowCopyAddDisabled = (row) => {
    return false;
};
// Is the row Delete button enabled
const rowDelDisabled = (row) => {
    const { user } = store.getState();
    return !(row.status === 0 && row.creator.id === user.id);
};
// Is the row View button enabled
const rowViewDisabled = () => {
    return false;
};
// Is the row Edit button enabled
const rowEditDisabled = (row) => {
    const { user } = store.getState();
    return !(row.status === 0 && row.creator.id === user.id);
};
// Is the row Confirm button enabled
const rowStartDisabled = (row) => {
    return !(row.status === 0);
};
// Is the row UnConfirm button enbaled
const rowStopDisabled = (row) => {
    const { user } = store.getState();
    return !(row.status === 1 && row.confirmer.id === user.id);
};
// Lecturer Cell display content
const CellLecturer = (row, column) => {
    return row.lecturer.name;
};

// Training Date Cell display content
const CellTrainingDate = (row, column) => {
    return DateTimeFormat(row.trainingDate, "L");
};
// Start Time Cell display content
const CellStartTime = (row, column) => {
    return DateTimeFormat(row.startTime, "LLL");
};
// End Time Cell display content
const CellEndTime = (row, column) => {
    return DateTimeFormat(row.endTime, "LLL");
};
// IsExam Cell display content
const CellIsExam = (row, column) => {
    return row.isExam === 1 ? "Y" : "N";
};
// Is the Batch Delete button enabled
export function delMultipleDisabled(selectedRows) {
    return false;
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
// Define Training Record table columns
export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 20, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "billNumber", label: "billNumber", alignment: "center", minWidth: 40, visible: true, sortField: "billNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "billDate", label: "billDate", alignment: "center", minWidth: 30, visible: true, sortField: "billDate", sort: true, display: { type: 1, cell1: CellBillDate } },
    { id: "department", label: "department", alignment: "center", minWidth: 40, visible: true, sortField: "department.id", sort: true, display: { type: 1, cell1: CellDept } },
    { id: "description", label: "description", alignment: "center", minWidth: 100, visible: false, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "tc", label: "tc", alignment: "center", minWidth: 100, visible: true, sortField: "tc.name", sort: true, display: { type: 1, cell1: CellTC } },
    { id: "lecturer", label: "lecturer", alignment: "center", minWidth: 50, visible: true, sortField: "lecturer.name", sort: true, display: { type: 1, cell1: CellLecturer } },
    { id: "trainingDate", label: "trainingDate", alignment: "center", minWidth: 30, visible: false, sortField: "trainingDate", sort: true, display: { type: 1, cell1: CellTrainingDate } },
    { id: "startTime", label: "startTime", alignment: "center", minWidth: 30, visible: true, sortField: "startTime", sort: true, display: { type: 1, cell1: CellStartTime } },
    { id: "endTime", label: "endTime", alignment: "center", minWidth: 30, visible: false, sortField: "endTime", sort: true, display: { type: 1, cell1: CellEndTime } },
    { id: "classHour", label: "classHour", alignment: "center", minWidth: 30, visible: true, sortField: "classHour", sort: true, display: { type: 0, cell1: null } },
    { id: "isExam", label: "isExam", alignment: "center", minWidth: 30, visible: true, sortField: "isExam", sort: true, display: { type: 1, cell1: CellIsExam } },
    { id: "status", label: "status", alignment: "center", minWidth: 50, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellVoucherStatus } },
    { id: "creator", label: "creator", alignment: "center", minWidth: 30, visible: true, sortField: "creator.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createDate", label: "createDate", alignment: "center", minWidth: 30, visible: false, sortField: "createDate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifier", label: "modifier", alignment: "center", minWidth: 30, visible: false, sortField: "modifier.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifyDate", label: "modifyDate", alignment: "center", minWidth: 60, visible: false, sortField: "modifyDate", sort: true, display: { type: 1, cell1: CellModifyTime } },
    { id: "confirmer", label: "confirmer", alignment: "center", minWidth: 30, visible: false, sortField: "confirmer.name", sort: true, display: { type: 1, cell1: CellConfirmer } },
    { id: "confirmDate", label: "confirmDate", alignment: "center", minWidth: 60, visible: false, sortField: "confirmDate", sort: true, display: { type: 1, cell1: CellConfirmTime } },
];
// Training Record Query fields definition
export const trQueryFields = [
    { id: 1, value: "h.billdate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
    { id: 2, value: "h.billnumber", label: "billNumber", inputType: 301, resultType: "string", resultfield: "" },
    { id: 3, value: "h.deptID", label: "department", inputType: 520, resultType: "object", resultfield: "id" },
    { id: 4, value: "h.status", label: "status", inputType: 405, resultType: "int", resultfield: "" },
    { id: 5, value: "h.lecturerid", label: "lecturer", inputType: 510, resultType: "object", resultfield: "id" },
    { id: 6, value: "h.tcid", label: "tc", inputType: 570, resultType: "object", resultfield: "id" },
    { id: 7, value: "h.creatorid", label: "creator", inputType: 510, resultType: "object", resultfield: "id" },
];

// Generate Training Record default query condifitons
export function generateTRConditions() {
    const { user } = store.getState();
    const currentPerson = user.person;
    let conditions = [
        {
            logic: "and",
            field: { id: 1, value: "h.billdate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
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
            field: { id: 7, value: "h.creatorid", label: "creator", inputType: 510, resultType: "object", resultfield: "id" },
            compare: { id: "equal", label: 'equal', value: '=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: currentPerson,
            isNecessary: false
        }
    ];
    return conditions;
}
// Default Header attachments
export const headFiles = {
    id: 0,
    billBID: 0,
    billHID: 0,
    file: { id: 0, hash: "" },
    dr: 0,
};

// Default Body Row attachments
const bodyFiles = {
    id: 0,
    billBID: 0,
    billHID: 0,
    file: { id: 0, hash: "" },
    dr: 0,
};

// Default Body Row
export const voucherRow = {
    id: 0,
    hid: 0,
    rowNumber: 10,
    student: { id: 0, code: "", name: "", avatar: { fileKey: 0, fileUrl: "" }, deptID: 0, deptCode: "", description: "" },
    positionName: "",
    deptName: "",
    startTime: dayjs(new Date()),
    endTime: dayjs(new Date()).add(1, "hour"),
    classHour: 1.0,
    description: "",
    examRes: 1,
    examScore: 0,
    status: 0,
    files: [bodyFiles],
    dr: 0
};

export const bodyColumns = [
    { id: "action", label: "action", alignment: "center", width: 80, maxWidth: 80, minWidth: 80, visible: true, allowNul: true, sortField: "action", sort: true, display: { type: 0, cell1: null } },
    { id: "rowNumber", label: "rowNumber", alignment: "left", width: 60, maxWidth: 60, minWidth: 60, visible: true, allowNul: true, sortField: "rowNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "student", label: "student", alignment: "left", width: 128, maxWidth: 512, minWidth: 80, visible: true, allowNul: false, sortField: "student.name", sort: true, display: { type: 0, cell1: null } },
    { id: "position", label: "position", alignment: "left", width: 128, maxWidth: 256, minWidth: 80, visible: true, allowNul: true, sortField: "position.name", sort: true, display: { type: 0, cell1: null } },
    { id: "department", label: "department", alignment: "left", width: 128, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "department.name", sort: true, display: { type: 0, cell1: null } },
    { id: "startTime", label: "startTime", alignment: "left", width: 150, maxWidth: 512, minWidth: 20, visible: true, allowNul: false, sortField: "startTime", sort: true, display: { type: 0, cell1: null } },
    { id: "endTime", label: "endTime", alignment: "left", width: 150, maxWidth: 512, minWidth: 20, visible: true, allowNul: false, sortField: "endTime", sort: true, display: { type: 0, cell1: null } },
    { id: "classHour", label: "classHour", alignment: "left", width: 96, maxWidth: 512, minWidth: 80, visible: true, allowNul: false, sortField: "classHour", sort: true, display: { type: 0, cell1: null } },
    { id: "examRes", label: "examRes", alignment: "left", width: 96, maxWidth: 128, minWidth: 20, visible: true, allowNul: true, sortField: "exmineres", sort: true, display: { type: 0, cell1: null } },
    { id: "examScore", label: "examScore", alignment: "left", width: 128, maxWidth: 512, minWidth: 20, visible: true, allowNul: true, sortField: "examScore", sort: true, display: { type: 0, cell1: null } },
    { id: "files", label: "files", alignment: "left", width: 96, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "files", sort: true, display: { type: 0, cell1: null } },
    { id: "status", label: "status", alignment: "left", width: 100, maxWidth: 120, minWidth: 20, visible: true, allowNul: true, sortField: "status", sort: true, display: { type: 0, cell1: null } },
    { id: "description", label: "description", alignment: "left", width: 256, maxWidth: 256, minWidth: 20, visible: true, allowNul: true, sortField: "description", sort: true, display: { type: 0, cell1: null } }
];
