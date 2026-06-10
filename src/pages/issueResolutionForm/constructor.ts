import { dayjs } from "../../i18n/dayjs";
import { store } from "../../store";
import { t } from "i18next";
import { ReferExecutionOrder } from "../../dataType/types/executionOrder";
import { IRFErrors, IssueResolutionForm } from "../../dataType/types/issueResolutionForm";
import { getEmptyIssueExecutionOrder } from "../../dataType/dataZero/issueExecutionForm";
import { cloneDeep, unionBy } from "lodash";
import { ErrMsg, MarkText } from "../../dataType/types/scInput";
import { ScFile } from "../../dataType/types/file";
import {displayName} from "../../../app.json"
// Generate Issue Resolution Form
export const getInitialValue = async (
    isNew: boolean,
    isModify: boolean,
    oriEOR: ReferExecutionOrder | undefined,
    oriIRF: IssueResolutionForm | undefined
) => {
    const { user } = store.getState();
    const { person, department } = user;
    const currentDay = dayjs(new Date()).toISOString();
    let newIRF: IssueResolutionForm | undefined = getEmptyIssueExecutionOrder(person, department, currentDay);
    if (isNew) { // Check if new voucher
        if (oriEOR) {// Add per the Execution Order row
            newIRF.csa = oriEOR.csa;
            newIRF.epa = oriEOR.epa;
            newIRF.executionValue = oriEOR.executionValue;
            newIRF.executionValueDisp = oriEOR.executionValueDisp;
            newIRF.executor = oriEOR.executor;
            newIRF.handler = person;
            newIRF.isFinish = 1;
            newIRF.startTime = oriEOR.handleStartTime;
            newIRF.endTime = oriEOR.handleEndTime;
            newIRF.eoDescription = oriEOR.description;
            newIRF.riskLevel = oriEOR.riskLevel;
            newIRF.sourceBillNumber = oriEOR.billNumber;
            newIRF.sourceHID = oriEOR.hid;
            newIRF.sourceRowNumber = oriEOR.rowNumber;
            newIRF.sourceBID = oriEOR.id;
            newIRF.sourceRowTs = oriEOR.ts;
            newIRF.issueFiles = oriEOR.eoFiles;
            newIRF.fixFiles = [];
        } else { // Can not add directly
            newIRF = undefined;
        }
    } else {
        if (!oriIRF) {
            newIRF = undefined;
        } else {
            if (isModify) { // Edit
                newIRF = cloneDeep(oriIRF);
                newIRF.modifier = person;
                newIRF.modifyDate = currentDay;
            } else { // View
                newIRF = cloneDeep(oriIRF);
            }
        }
    }
    return newIRF;
};

// Check Issue Resolution Form errors
export const checkIRFErrors = (irfData: IssueResolutionForm | undefined) => {
    const noErr: ErrMsg = { isErr: false, msg: "" };
    let errData: IRFErrors = {
        department: noErr,
        handler: noErr,
        startTime: noErr,
        endTime: noErr,
        isErr: false
    };

    if (irfData === undefined) {
        return errData;
    }

    let errorNumber = 0;

    // Check Department field
    if (irfData.department.id === 0) {
        errData.department = { isErr: true, msg: t("cannotEmpty") };
        errorNumber++
    }
    // Check handler field
    if (irfData.handler.id === 0) {
        errData.handler = { isErr: true, msg: t("cannotEmpty") };
        errorNumber++
    }
    // Check start time field
    if (irfData.startTime === "") {
        errData.startTime = { isErr: true, msg: t("cannotEmpty") };
        errorNumber++
    }

    // Check end time field
    if (irfData.endTime === "") {
        errData.endTime = { isErr: true, msg: t("cannotEmpty") }
        errorNumber++
    } else {
        if (irfData.startTime > irfData.endTime) {
            errData.endTime = { isErr: true, msg: t("endTimePrecedeStartTime") };
            errorNumber++
        }
    }
    errData.isErr = errorNumber > 0;
    return errData;
};

// Convert all voucher file within the entry to ScFile array
export const convertIRFToFiles = (voucherData: IssueResolutionForm) => {
    let files: ScFile[] = [];
    if (voucherData.fixFiles === null || voucherData.fixFiles === undefined || voucherData.fixFiles.length === 0) {
        return files;
    }

    voucherData.fixFiles.forEach(vfile => {
        if (vfile.file.id === 0) {
            files.push(vfile.file);
        }
    });

    const noDupFiles = unionBy(files, "hash");
    return noDupFiles;
};

//Generate watermark text
export const generateMarkText = (voucherData: IssueResolutionForm | undefined) => {
    let mark: MarkText[] = [];
    if (!voucherData) {
        return mark;
    }
    // Generate Author Information
    const { appInfo, user } = store.getState();
    mark.push({ position: { x: 0, y: 0 }, text: `${displayName} | ${user.person.name} | ${t("irf")}`, textSize: 20, color: " rgb(92, 93, 114)" });
    // Generate Construction Site Archive information
    if (voucherData.csa.name !== "") {
        mark.push({ position: { x: 0, y: 0 }, text: `${t("csa")}:${voucherData.csa.name}`, textSize: 20, color: " rgb(92, 93, 114)" });
    }
    // Generate Execution Project Archive information
    if (voucherData.epa.name !== "") {
        mark.push({ position: { x: 0, y: 0 }, text: `${t("epa")}:${voucherData.epa.name}`, textSize: 20, color: " rgb(92, 93, 114)" });
    }

    return mark;
};