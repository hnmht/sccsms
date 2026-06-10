export const steps = ['defineParameters', "selectPositions", "selectRecipients", "generateVoucher"];

export const notObj = (a, b) => {
    return a.filter((aItem) => b.findIndex((bItem) => bItem.id === aItem.id) === -1);
};
export const intersectionObj = (a, b) => {
    return a.filter((aItem) => b.findIndex(bItem => bItem.id === aItem.id) !== -1);
};
export const unionObj = (a, b) => {
    return [...a, ...notObj(b, a)];
};

const rowsimpleDisabled = (row) => {
    return true;
};
const rowDelDisabled = (row) => {
    return false;
};
// Define row button
export const rowActionsDefine = {
    rowCopyAdd: {
        visible: false,
        disabled: rowsimpleDisabled,
        color: "success",
        tips: "copyAdd",
        icon: "CopyNewIcon",
    },
    rowViewDetail: {
        visible: false,
        disabled: rowsimpleDisabled,
        color: "secondary",
        tips: "detail",
        icon: "DetailIcon",
    },
    rowEdit: {
        visible: false,
        disabled: rowsimpleDisabled,
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
        visible: false,
        disabled: rowsimpleDisabled,
        color: "success",
        tips: "confirm",
        icon: "StartIcon",
    },
    rowStop: {
        visible: false,
        disabled: rowsimpleDisabled,
        color: "error",
        tips: "unconfirm",
        icon: "CancelConfirmIcon",
    },
};




