import { Condition } from "../../dataType/types/queryPanel";
import { ErrMsg } from "../../dataType/types/scInput";
import { ScDataTypeList } from "../../dataType/types/scDataType";
import { dayjs, i18n } from "../../i18n/i18n"
import { mailRegex } from "../../utils/regex";
import { ConvertToUnixSecond } from "../../i18n/dayjs";

export const transConditionsToString = (conditions: Condition[]) => {
    let queryString = "";
    conditions.forEach((con, index) => {
        let cs = "";
        if (index !== 0) {
            cs = cs + con.logic + " ";
        }
        cs = cs + con.field.value + " ";
        cs = cs + con.compare.value + " ";
        const compare = con.compare.id;
        if (compare !== "null" && compare !== "notnull") {
            switch (con.field.inputType) {
                case ScDataTypeList.Number:
                case ScDataTypeList.Gender:
                case ScDataTypeList.SwitchYesOrNo:
                case ScDataTypeList.CheckYesOrNo:
                case ScDataTypeList.SelectYesOrNo:
                case ScDataTypeList.VoucherStatus:
                    cs = cs + con.value + " ";
                    break;
                case ScDataTypeList.Text:
                case ScDataTypeList.Password:
                case ScDataTypeList.Mobile:
                case ScDataTypeList.Email:
                    if (con.compare.addCharacter) {
                        cs = cs + "'" + con.compare.addStart + con.value + con.compare.addEnd + "' ";
                    } else {
                        cs = cs + "'" + con.value + "' ";
                    }
                    break;
                case ScDataTypeList.Date:
                case ScDataTypeList.DateTime:
                    let unixTime = 0;
                    // Guard against null/invalid types before converting
                    if (con.value === null || con.value === undefined || con.value === "") {
                        unixTime = 0;
                    } else {
                        // cast to any to satisfy TS for accepted input types of ConvertToUnixSecond
                        unixTime = ConvertToUnixSecond(con.value as any);
                    }
                    cs = cs + "to_timestamp(" + unixTime + ") ";
                    break;
                case ScDataTypeList.Person:
                case ScDataTypeList.SimpDept:
                case ScDataTypeList.SimpCSC:
                case ScDataTypeList.UserDefineCategory:
                case ScDataTypeList.SimpEPC:
                case ScDataTypeList.UserDefinedArchive:
                case ScDataTypeList.ExecutionProject:
                case ScDataTypeList.ConstructionSite:
                case ScDataTypeList.EPT:
                case ScDataTypeList.RiskLevel:
                case ScDataTypeList.SimpDC:
                case ScDataTypeList.Position:
                case ScDataTypeList.TC:
                case ScDataTypeList.PPE:
                case ScDataTypeList.AvatarUpload:
                    let dataId = 0;
                    if (con.value && typeof con.value === "object" && "id" in con.value && typeof (con.value as any).id === "number") {
                        dataId = (con.value as any).id;
                    }
                    cs = cs + dataId + " ";
                    break;
                default:
                    break
            }
        }
        queryString = queryString + cs;
    });

    return queryString;
};

export const checkConditionsErrors = (cons: Condition[]) => {
    let errs: ErrMsg[] = [];
    if (!cons || cons.length === 0) {
        return errs;
    }
    // let noErrs = { isErr: false, msg: "" };
    cons.forEach(con => {
        let errInfo = { isErr: false, msg: "" };
        switch (con.field.inputType) {
            case ScDataTypeList.Text:
                if (con.value === "") {
                    errInfo = { isErr: true, msg: `${con.field.label}:${i18n.t("cannotEmpty")}` };
                }
                break;
            case ScDataTypeList.Number:
                if (!Number.isFinite(con.value)) {
                    errInfo = { isErr: true, msg: `${con.field.label}:${i18n.t("mustBeNumber")}` };
                }
                break;
            case ScDataTypeList.Password:
                if (con.value === "") {
                    errInfo = { isErr: true, msg: `${con.field.label}:${i18n.t("cannotEmpty")}` };
                }
                break;
            case ScDataTypeList.Mobile:
                if (con.value === "") {
                    errInfo = { isErr: true, msg: `${con.field.label}:${i18n.t("cannotEmpty")}` };
                }
                break;
            case ScDataTypeList.Email:
                if (con.value === "" || con.value === null) {
                    errInfo = { isErr: true, msg: `${con.field.label}:${i18n.t("cannotEmpty")}` };
                } else {
                    if (typeof con.value !== "string" || !mailRegex.test(con.value)) {
                        errInfo = { isErr: true, msg: `${con.field.label}:${i18n.t("emailIncorrect")}` };
                    }
                }
                break;
            case ScDataTypeList.Date:
                if (con.value === "") {
                    errInfo = { isErr: true, msg: `${con.field.label}:${i18n.t("cannotEmpty")}` };
                } else {
                    const v = con.value;
                    if (typeof v === "string" || typeof v === "number" || v instanceof Date) {
                        if (!dayjs(v).isValid()) {
                            errInfo = { isErr: true, msg: `${con.field.label}:${i18n.t("enterValidDate")}` };
                        }
                    } else {
                        // non-date type provided for a Date field
                        errInfo = { isErr: true, msg: `${con.field.label}:${i18n.t("enterValidDate")}` };
                    }
                }
                break;
            case ScDataTypeList.DateTime:
                if (con.value === "") {
                    errInfo = { isErr: true, msg: `${con.field.label}:${i18n.t("cannotEmpty")}` };
                } else {
                    const v = con.value;
                    if (typeof v === "string" || typeof v === "number" || v instanceof Date) {
                        if (!dayjs(v).isValid()) {
                            errInfo = { isErr: true, msg: `${con.field.label}:${i18n.t("enterValidDate")}` };
                        }
                    } else {
                        // non-date type provided for a DateTime field
                        errInfo = { isErr: true, msg: `${con.field.label}:${i18n.t("enterValidDate")}` };
                    }
                }
                break;
            case ScDataTypeList.Gender:
                if (con.value === 0) {
                    errInfo = { isErr: true, msg: `${con.field.label}:${i18n.t("cannotEmpty")}` };
                }
                break;
            case ScDataTypeList.SwitchYesOrNo:
            case ScDataTypeList.CheckYesOrNo:
                break;
            case ScDataTypeList.SelectYesOrNo:
                if (con.value === 2) {
                    errInfo = { isErr: true, msg: `${con.field.label}:${i18n.t("cannotEmpty")}` };
                }
                break;
            case ScDataTypeList.VoucherStatus:
                break
            case ScDataTypeList.Person:
            case ScDataTypeList.SimpDept:
            case ScDataTypeList.SimpCSC:
            case ScDataTypeList.UserDefineCategory:
            case ScDataTypeList.SimpEPC:
            case ScDataTypeList.UserDefinedArchive:
            case ScDataTypeList.ExecutionProject:
            case ScDataTypeList.ConstructionSite:
            case ScDataTypeList.EPT:
            case ScDataTypeList.RiskLevel:
            case ScDataTypeList.SimpDC:
            case ScDataTypeList.Position:
            case ScDataTypeList.TC:
            case ScDataTypeList.PPE:
            case ScDataTypeList.AvatarUpload:
                let dataId = 0;
                if (con.value && typeof con.value === "object" && "id" in con.value && typeof (con.value as any).id === "number") {
                    dataId = (con.value as any).id;
                }
                if (dataId === 0) {
                    errInfo = { isErr: true, msg: `${con.field.label}:${i18n.t("cannotEmpty")}` };
                }
                break;
            default:
                break;
        }
        errs.push(errInfo)
    });

    return errs;

};

export const checkErrors = (errors: ErrMsg[]) => {
    if (!errors || errors.length === 0) {
        return false;
    }

    let errorNumber = 0;
    errors.forEach(err => {
        if (err.isErr) {
            errorNumber++
        }
    })

    return errorNumber > 0;
}