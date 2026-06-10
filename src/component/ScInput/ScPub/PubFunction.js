import { DateTimeFormat } from "../../../i18n/dayjs";

// Display status content
export const cellStatus = (row, column) => {
    return row.status === 0 ? "normal" : "disable";
};
// Display Creator content
export const cellCreator = (row, column) => {
    return row.creator.name;
};
// Display CreateDate cell content
export const cellCreateDate = (row, column) => {
    return DateTimeFormat(row.createDate, "LLL");
};

// Content of the gender column
export const cellGender = (row) => {
    return row.gender === 0 ? "" : row.gender === 1 ? "male" : "female";
};

// Content of the systemFlag column
export const cellSystemFlag = (row) => {
    return row.systemflag === 0 ? "N" : "Y";
};