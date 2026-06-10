import { store } from "../../store";
import { t } from "i18next";
import { dayjs, EpochTime } from "../../i18n/dayjs";
import { cloneDeep, uniqBy } from "lodash";
import { mailRegex } from "../../utils/regex";
import { WorkOrderRow } from "../../dataType/types/workOrder";
import { getDefaultExecutionOrderRow, getEmptyExecutionOrder } from "../../dataType/dataZero/executionOrder";
import { EOErrors, EORowErrors, ExecutionOrder, ExecutionOrderRow } from "../../dataType/types/executionOrder";
import { EPTRepo } from "../../db/crud/ept";
import { EPTRow } from "../../dataType/types/ept";
import { Person } from "../../dataType/types/person";
import { ErrMsg, MarkText } from "../../dataType/types/scInput";
import { ScDataTypeList } from "../../dataType/types/scDataType";
import { ScFile } from "../../dataType/types/file";
import { displayName } from "../../../app.json"

// Generate Execution Order Data
export const getInitialValue = (isNew: boolean, isModify: boolean, oriWOR: WorkOrderRow | undefined, oriEO: ExecutionOrder | undefined) => {
    const { user } = store.getState();
    const { person, department } = user;
    const currentDay = dayjs(new Date()).toISOString();
    let newEO = getEmptyExecutionOrder(person, department, currentDay);
    if (isNew) {// Check If new Voucher
        if (oriWOR) {// Add per the work Order Row
            newEO.department = oriWOR.department;
            newEO.description = oriWOR.headerDescription;
            newEO.sourceType = "WO";
            newEO.sourceBillNumber = oriWOR.billNumber;
            newEO.sourceHID = oriWOR.hid;
            newEO.sourceRowNumber = oriWOR.rowNumber;
            newEO.sourceBID = oriWOR.id;
            newEO.sourceRowTs = oriWOR.ts;
            newEO.startTime = oriWOR.startTime;
            newEO.endTime = oriWOR.endTime;
            newEO.csa = oriWOR.csa;
            newEO.ept = EPTRepo.getDetailByID(oriWOR.ept.id);
            newEO.allowAddRow = newEO.ept.allowAddRow;
            newEO.allowDelRow = newEO.ept.allowDelRow;
            newEO.body = eptBodyToEOBody(newEO.ept.body, newEO.startTime, newEO.endTime, newEO.csa.respPerson);
        }
    } else {
        if (!oriEO) {
            return
        } else {
            if (isModify) { // Edit
                newEO = cloneDeep(oriEO);
                newEO.modifier = person;
                newEO.modifyDate = currentDay;
            } else {// View
                newEO = cloneDeep(oriEO);
            }
        }
    }
    return newEO;
};

// Convert Execution Project Template Body to Execution Order Body
export const eptBodyToEOBody = (eptBody: EPTRow[], startTime: string, endTime: string, issueOwner: Person) => {
    let eoBody: ExecutionOrderRow[] = [];
    const currentDay = dayjs(new Date()).toISOString();
    const emptyEOR = getDefaultExecutionOrderRow(issueOwner, currentDay)
    if (eptBody.length === 0) {
        eoBody = [emptyEOR];
    } else {
        eptBody.forEach(eptRow => {
            let eoRow = getDefaultExecutionOrderRow(issueOwner, currentDay);
            eoRow.rowNumber = eptRow.rowNumber;
            eoRow.epa = eptRow.epa;
            eoRow.allowDelRow = eptRow.allowDelRow;
            eoRow.executionValue = eptRow.defaultValue;
            eoRow.executionValueDisp = eptRow.defaultValueDisp;
            eoRow.files = [];
            eoRow.epaDescription = eptRow.description;
            eoRow.isCheckError = eptRow.isCheckError;
            eoRow.errorValue = eptRow.errorValue;
            eoRow.errorValueDisp = eptRow.errorValueDisp;
            eoRow.isRequireFile = eptRow.isRequireFile;
            eoRow.isOnSitePhoto = eptRow.isOnSitePhoto;
            eoRow.isFromEpt = 1;
            eoRow.issueOwner = issueOwner;
            eoRow.handleStartTime = startTime;
            eoRow.handleEndTime = endTime;
            eoRow.riskLevel = eptRow.riskLevel;
            eoBody.push(eoRow);
        });
    }
    return eoBody;
};

// Check Execution Order Data errors
export const checkEOErrors = (eoData: ExecutionOrder | undefined): EOErrors => {
    const noErr: ErrMsg = { isErr: false, msg: "" };
    const errData: EOErrors = {
        billDate: noErr,
        department: noErr,
        csa: noErr,
        executor: noErr,
        ept: noErr,
        startTime: noErr,
        endTime: noErr,
        body: []
    };
    errData.isErr = false;
    errData.isBodyErr = false;
    errData.isHeaderErr = false;
    if (eoData === undefined) {
        return errData;
    }
    let headerErrNumber = 0;
    let bodyErrorNumber = 0;
    // Check header billDate field
    if (eoData.billDate === "") {
        errData.billDate = { isErr: true, msg: t("cannotEmpty") };
        headerErrNumber++
    }
    // Check header department field
    if (eoData.department.id === 0) {
        errData.department = { isErr: true, msg: t("cannotEmpty") };
        headerErrNumber++
    }
    // Check header Construction Site Archive field
    if (eoData.csa.id === 0) {
        errData.csa = { isErr: true, msg: t("cannotEmpty") };
        headerErrNumber++
    }
    // Check header Execution Project Templete field
    if (eoData.ept.id === 0) {
        errData.ept = { isErr: true, msg: t("cannotEmpty") };
        headerErrNumber++
    }
    // Check Header Start Time field
    if (eoData.startTime === "") {
        errData.startTime = { isErr: true, msg: t("cannotEmpty") };
        headerErrNumber++
    }
    // Check Header End Time field
    if (eoData.endTime === "") {
        errData.endTime = { isErr: true, msg: t("cannotEmpty") }
        headerErrNumber++
    } else {
        if (eoData.startTime > eoData.endTime) {
            errData.endTime = { isErr: true, msg: t("endTimePrecedeStartTime") };
            headerErrNumber++
        }
    }

    // Check body field row by row
    eoData.body.forEach((row, index) => {
        let rowErr: EORowErrors = {
            epa: noErr,
            executionValue: noErr,
            riskLevel: noErr,
            files: noErr,
            issueOwner: noErr,
            handleStartTime: noErr,
            handleEndTime: noErr,
        };

        // Check Execution Project field
        if (row.epa.id === 0) {
            rowErr.epa = { isErr: true, msg: t("cannotEmpty") };
            bodyErrorNumber++
        }
        // Check Execution Value field
        switch (row.epa.resultType.id) {
            case 301:
                if (row.executionValue === "") {
                    rowErr.executionValue = { isErr: true, msg: t("cannotEmpty") };
                    bodyErrorNumber++
                }
                break;
            case 302:
                if (!Number.isFinite(row.executionValue)) {
                    rowErr.executionValue = { isErr: true, msg: t("cannotEmpty") };
                    bodyErrorNumber++
                }
                break;
            case 303:
                if (row.executionValue === "") {
                    rowErr.executionValue = { isErr: true, msg: t("cannotEmpty") };
                    bodyErrorNumber++
                }
                break;
            case 304:
                if (row.executionValue === "") {
                    rowErr.executionValue = { isErr: true, msg: t("cannotEmpty") };
                    bodyErrorNumber++
                }
                break;
            case 305:
                if (row.executionValue === "") {
                    rowErr.executionValue = { isErr: true, msg: t("cannotEmpty") };
                    bodyErrorNumber++

                } else {
                    if (!mailRegex.test(row.executionValue)) {
                        rowErr.executionValue = { isErr: true, msg: t("emailIncorrect") };
                        bodyErrorNumber++
                    }
                }
                break;
            case 306:
                if (row.executionValue === "") {
                    rowErr.executionValue = { isErr: true, msg: t("cannotEmpty") };
                    bodyErrorNumber++
                } else {
                    if (!dayjs(row.executionValue, "YYYYMMDD", true).isValid()) {
                        rowErr.executionValue = { isErr: true, msg: `执行值日期格式不正确` };
                        bodyErrorNumber++
                    }
                }
                break;
            case 307:
                if (row.executionValue === "") {
                    rowErr.executionValue = { isErr: true, msg: t("cannotEmpty") };
                } else {
                    if (!dayjs(row.executionValue).isValid()) {
                        rowErr.executionValue = { isErr: true, msg: `执行值日期时间格式不正确` };
                        bodyErrorNumber++
                    }
                }
                break;
            case 401:
                if (row.executionValue === 0) {
                    rowErr.executionValue = { isErr: true, msg: t("cannotEmpty") };
                    bodyErrorNumber++
                }
                break;
            case 402:
            case 403:
                break;
            case 404:
                if (row.executionValue === 2) {
                    rowErr.executionValue = { isErr: true, msg: t("cannotEmpty") };
                    bodyErrorNumber++
                }
                break;
            case 510:
            case 520:
            case 525:
            case 530:
            case 540:
            case 550:
            case 560:
            case 570:
            case 580:
                if (row.executionValue.id === 0) {
                    rowErr.executionValue = { isErr: true, msg: t("cannotEmpty") };
                    bodyErrorNumber++
                }
                break;
            default:
                break;
        }
        // Check RiskLevel field
        if (row.riskLevel.id === 0) {
            rowErr.riskLevel = { isErr: true, msg: t("isRequireFile") };
            bodyErrorNumber++
        }

        // Check Row File        
        if (row.isRequireFile === 1) {
            let fileNumber = 0;
            row.files.forEach(file => {
                if (file.dr === 0) {
                    fileNumber++
                }
            })
            if (fileNumber === 0) {
                rowErr.files = { isErr: true, msg: t("isRequireFile") };
                bodyErrorNumber++
            }
        }

        // Check issueOwner field
        if (row.isHandle === 1 && row.issueOwner.id === 0) {
            rowErr.issueOwner = { isErr: true, msg: t("cannotEmpty") };
            bodyErrorNumber++
        }

        // Check handleStartTime field
        if (row.isHandle === 1 && row.handleStartTime === "") {
            rowErr.handleStartTime = { isErr: true, msg: t("cannotEmpty") };
            bodyErrorNumber++
        }

        // Check handleEndTime field
        if (row.isHandle === 1) {
            if (row.handleEndTime === "") {
                rowErr.handleEndTime = { isErr: true, msg: t("cannotEmpty") };
                bodyErrorNumber++
            } else {
                if (row.handleStartTime > row.handleEndTime) {
                    rowErr.handleEndTime = { isErr: true, msg: t("endTimePrecedeStartTime") };
                    bodyErrorNumber++
                }
            }
        }
        errData.body.push(rowErr);
    })

    errData.isErr = (bodyErrorNumber > 0 || headerErrNumber > 0);
    errData.isBodyErr = bodyErrorNumber > 0;
    errData.isHeaderErr = headerErrNumber > 0;

    return errData;
};

// Check for any Issues
export const checkForProblem = (resultTypeId: ScDataTypeList, errorValue: any, value: any): 0 | 1 => {
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

// Convert all Voucher File within the entry to SCFile array
export const transVoucherDataToFiles = (voucherData: ExecutionOrder) => {
    let files: ScFile[] = [];
    if (voucherData === undefined || voucherData.body.length <= 0) {
        return files;
    }
    voucherData.body.forEach(row => {
        if (row.files && row.files.length > 0) {
            row.files.forEach(file => {
                if (file.file.id === 0) {
                    files.push(file.file);
                }
            });
        }
    });
    const noDupFiles = uniqBy(files, "hash");
    return noDupFiles;
};

// Convert Execution Order to backend Execution Order
export function transEOToBackend(eo: ExecutionOrder) {
    const newEO = cloneDeep(eo);
    if (newEO.sourceRowTs === "") {
        newEO.sourceRowTs = EpochTime;
    }
    newEO.ept.body = [];
    if (newEO.ts == "") {
        delete newEO.ts;
    }
    newEO.body.map((row) => {
        switch (row.epa.resultType.id) {
            case 301:
                row.executionValueDisp = row.executionValue;
                break;
            case 306:
                row.executionValueDisp = row.executionValue === "" ? "" : dayjs(row.executionValue).toISOString();
                break;
            case 307:
                row.executionValueDisp = row.executionValue === "" ? "" : dayjs(row.executionValue).toISOString();
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
        if (row.ts == '') {
            delete row.ts;
        }
        return row;
    });

    return newEO;
};

// Generate watermark text
export const generateMarkText = (voucherData: ExecutionOrder | undefined, row: ExecutionOrderRow | undefined) => {
    let mark: MarkText[] = [];
    if (!voucherData || !row) {
        return mark;
    }
    // Generate Author information
    const { appInfo, user } = store.getState();
    mark.push({ position: { x: 0, y: 0 }, text: `${displayName} | ${user.person.name} | ${t("eo")}`, textSize: 20, color: " rgb(92, 93, 114)" });
    // Generate Construction Site Archive information
    if (voucherData.csa.name !== "") {
        mark.push({ position: { x: 0, y: 0 }, text: `${t("csa")}:${voucherData.csa.name}`, textSize: 20, color: " rgb(92, 93, 114)" });
    }
    // Generate Execution Project Archive information
    if (row.epa.name !== "") {
        mark.push({ position: { x: 0, y: 0 }, text: `${t("epa")}:${row.epa.name}`, textSize: 20, color: " rgb(92, 93, 114)" });
    }
    return mark;
};