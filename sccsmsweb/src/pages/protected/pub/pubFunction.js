import store from "../../../store";
import { VoucherStatus } from "../../../storage/dataTypes";
import { DateTimeFormat, CheckTimeZero, dayjs } from "../../../i18n/dayjs";
import { i18n } from "../../../i18n/i18n";

// Get Operator
export const getCurrentPerson = () => {
    const { user } = store.getState();
    return user.person;
};
// Generate Master-detail form error messages
export const generateVoucherErrors = (rowNumber) => {
    let voucherErrors = {
        body: [],
    };
    // Generate Master-Detail form details errors
    for (let i = 0; i < rowNumber; i++) {
        voucherErrors.body.push({});
    }
    return voucherErrors;
};

// Check if the Master-Detail form error messages
export const checkVoucherErrors = (voucherErrors) => {
    let number = 0;
    // Check Master-Detail form Master errors
    for (let key in voucherErrors) {
        if (key !== "body" && voucherErrors[key].isErr) {
            number = number + 1;
        }
    }
    // Check Master-Detail form Detail errors
    voucherErrors.body.forEach((row) => {
        for (let key in row) {
            if (row[key].isErr) {
                number = number + 1;
            }
        }
    });

    return number > 0;
};

// Check if the form error messages
export const checkVoucherNoBodyErrors = (errors) => {
    let number = 0;
    for (let key in errors) {
        if (errors[key].isErr) {
            number = number + 1;
        }
    }
    return number > 0;
};

// Creator display content
export const CellCreator = (row, column) => {
    return row.creator.name;
};
// Create date display content
export const CellCreateTime = (row, column) => {
    let date = dayjs(row.createDate);
    return DateTimeFormat(date, "LLL");
};
// Modifier display content
export const CellModifier = (row, column) => {
    return row.modifier.name;
};
// Modify date display content
export const CellModifyTime = (row, column) => {
    const date = row.modifyDate;
    const isZero = CheckTimeZero(date);
    let content = "";
    if (!isZero) {
        content = DateTimeFormat(date, "LLL")
    }
    return content;
};
// Confirmer display conent
export const CellConfirmer = (row, column) => {
    return row.confirmer.name;
};
// Confirm date display content
export const CellConfirmTime = (row, column) => {
    const date = row.confirmDate;
    let content = "";
    const isZero = CheckTimeZero(date);
    if (!isZero) {
        content = DateTimeFormat(date, "LLL")
    }
    return content;
};

// Status display content 
export const CellStatus = (row, column) => {
    const v = row.status === 0 ? "normal" : "disable";
    return i18n.t(v)
};

// Voucher status display content
export const CellVoucherStatus = (row, column) => {
    return i18n.t(VoucherStatus[row.status]);
};
// Voucher billDate display content
export const CellBillDate = (row, column) => {
    return DateTimeFormat(row.billDate, "LL");
};
// Department display content
export const CellDept = (row, column) => {
    return row.department.name;
};
// Position display content
export const CellPosition = (row, column) => {
    return row.position.name;
};
// Gender display content 
export const CellGender = (row, column) => {
    const v = row.gender === 0 ? "" : row.gender === 1 ? "male" : "female";
    return i18n.t(v);
};
// System preset  display content
export const CellSystemFlag = (row, column) => {
    const v = row.systemFlag === 0 ? "N" : "Y";
    return i18n.t(v);
};

// Construciton Site display content
export const CellCSA = (row, column) => {
    return row.csa.name;
};

// Execution Project Template display content
export const CellEPT = (row, column) => {
    return row.ept.name;
}

// Executor display content
export const CellExecutor = (row, column) => {
    return row.executor.name;
};

// Issue Owner display content
export const CellIssueOwner = (row, column) => {
    return row.issueOwner.name;
};
// Display Time content
export const CellTime = (row, column) => {
    return DateTimeFormat(dayjs(row[column.id]), "LLL");
};

// Display Exectuion Project content
export const CellEPA = (row, column) => {
    return row.epa.name;
};

// Issue Handler display content
export const CellHandler = (row, column) => {
    return row.handler.name;
};

// Document Category display content
export const CellDC = (row,column) => {
    return row.dc.name;
};

// Training Category display content
export const CellTC = (row,column) => {
    return row.tc.name;
};

// Period Display content
export const CellPeriod = (row,column) => {
    return i18n.t(row.period);
};
