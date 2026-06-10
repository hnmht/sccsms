import { useEffect, useState } from "react";
import {
    Stack,
    Grid,
    Typography,
    DialogActions,
    IconButton,
    Tooltip,
    Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { dayjs, DateTimeFormat, EpochTime } from "../../../i18n/dayjs";
import { cloneDeep } from "lodash";
import { message } from "mui-message";

import { CopyAddRowIcon, DeleteRowIcon } from "../../../component/PubIcon/PubIcon";
import ScInput from "../../../component/ScInput";
import Loader from "../../../component/Loader/Loader";
import { MultiSortByArr } from "../../../utils/tools";
import { voucherRow, bodyColumns } from "./constructor";
import { GetCacheDocById } from "../../../storage/db/db";
import { reqAddWO, reqEditWO } from "../../../api/workOrder";
import { transWOToBackend } from "./constructor";

import { getCurrentPerson, generateVoucherErrors, checkVoucherErrors } from "../pub/pubFunction";
import { ScVoucherBody, ScVoucherBodyRow } from "../../../component/ScVoucher";

// Generate initial data
const getInitialValue = async (oriWO, isNew, isModify) => {
    const person = await getCurrentPerson();
    const dept = await GetCacheDocById("department", person.deptID);
    const currentTime = dayjs(new Date());
    const currentDate = currentTime.startOf("day");

    let newWO = { // Add new WorkOrder
        id: 0,
        billNumber: "",
        billDate: currentDate,
        department: dept,
        description: "",
        status: 0,
        workDate: currentDate,
        body: [voucherRow],
        creator: person,
        createDate: currentTime,
        modifier: { id: 0, code: "", name: "" },
        modifyDate: EpochTime,
        confirmer: { id: 0, code: "", name: "" },
        confirmDate: EpochTime,
        dr: 0
    };

    if (isNew) { // Check if new Work Order
        if (oriWO) {// Copy Add            
            newWO = cloneDeep(oriWO);
            newWO.id = 0;
            newWO.billNumber = "";
            newWO.billDate = currentDate;
            newWO.status = 0;
            newWO.workDate = currentDate;
            newWO.body.map((row) => {
                row.id = 0;
                row.hid = 0;
                row.status = 0;
                return row;
            });
            newWO.creator = person;
            newWO.createDate = currentTime;
            newWO.modifier = { id: 0, code: "", name: "" };
            newWO.modifyDate = EpochTime;
            newWO.confirmer = { id: 0, code: "", name: "" };
            newWO.confirmDate = EpochTime;
        }
    } else { // Edit or View
        if (!oriWO) {
            return
        } else {
            if (isModify) { // Edit                
                newWO = cloneDeep(oriWO);
                newWO.modifier = person;
                newWO.modifyDate = currentTime;
            } else { // View
                newWO = cloneDeep(oriWO);
            }
        }
    }
    return newWO;
};

// Add/Edit/View Work Order
const EditWorkOrder = ({ isOpen, isNew, isModify, oriWO, onCancel, onOk }) => {
    const [voucherData, setVoucherData] = useState((undefined));
    const [errors, setErrors] = useState(() => generateVoucherErrors(oriWO ? oriWO.body.length : 1));
    const isEdit = !(!isModify && !isNew);
    const { t } = useTranslation();

    useEffect(() => {
        async function initVoucher() {
            const newWO = await getInitialValue(oriWO, isNew, isModify);
            setVoucherData(newWO);
        }
        if (isOpen) {
            initVoucher();
        }
    }, [isOpen, oriWO, isModify, isNew]);

    // Get the passed data from the ScInput component
    const handleGetValue = async (value, itemKey, positionID, rowIndex, errMsg) => {
        if (voucherData === undefined || !isEdit || !isOpen) {
            return
        }
        // let startTime = new Date();
        // Change voucherData
        setVoucherData((prevState) => {
            let newData = cloneDeep(prevState);
            switch (positionID) {
                case 0:// Change voucher header
                    newData[itemKey] = value;
                    break;
                case 1:// Change voucher body                                       
                    newData.body[rowIndex][itemKey] = value;
                    break;
                case 2: // change voucher footer
                    newData[itemKey] = value;
                    break;
                default:
                    break;
            }
            return newData;
        });

        // Change errors
        setErrors((prevState) => {
            let newErrors = cloneDeep(prevState);
            switch (positionID) {
                case 0:
                    newErrors[itemKey] = errMsg;
                    break;
                case 1:
                    newErrors.body[rowIndex][itemKey] = errMsg;
                    break;
                case 2:
                    newErrors[itemKey] = errMsg;
                    break;
                default:
                    break;
            }
            return newErrors;
        });
    };
    // Add Row
    const handleAddRow = () => {
        // Deep copy a  new voucherData
        const newVoucherData = cloneDeep(voucherData);
        let newRow = cloneDeep(voucherRow);
        // Automatically generate row number
        if (newVoucherData.body.length === 1) {
            newRow.rowNumber = newVoucherData.body[0].rowNumber + 10;
        } else {
            newVoucherData.body.sort(MultiSortByArr([{ field: "rowNumber", order: "asc" }]))
            newRow.rowNumber = newVoucherData.body[newVoucherData.body.length - 1].rowNumber + 10;
        }
        // Automatically fill in the start time and endtime
        if (dayjs(newVoucherData.workDate).isValid()) {
            newRow.startTime = dayjs(newVoucherData.workDate).startOf("day").add(9, "hour");
            newRow.endTime = dayjs(newVoucherData.workDate).startOf("day").add(17, "hour");
        } else {
            newRow.startTime = dayjs(new Date()).startOf("day").add(9, "hour");
            newRow.endTime = dayjs(new Date()).startOf("day").add(17, "hour");
        }
        newVoucherData.body.push(newRow);
        setVoucherData(newVoucherData);
        // Generate new error 
        let newErrors = cloneDeep(errors);
        newErrors.body.push({});
        setErrors(newErrors);
    };
    // Copy Current row  content and add a new row
    const handleCopyAddRow = (index) => {
        const newVoucherData = cloneDeep(voucherData);
        let newRow = cloneDeep(voucherData.body[index]);
        // Generate errors value
        let newErrors = cloneDeep(errors);
        newErrors.body.push({});
        setErrors(newErrors);
        // Generate row number
        if (newVoucherData.body.length === 1) {
            newRow.rowNumber = newVoucherData.body[0].rowNumber + 10;
        } else {
            newVoucherData.body.sort(MultiSortByArr([{ field: "rowNumber", order: "asc" }]))
            newRow.rowNumber = newVoucherData.body[newVoucherData.body.length - 1].rowNumber + 10;
        }
        // Change new Row id and hid
        newRow.id = 0;
        newRow.hid = 0;
        // Generate startTime and endTime
        if (dayjs(newVoucherData.workDate).isValid()) {
            newRow.startTime = dayjs(newVoucherData.workDate).startOf("day").add(9, "hour");
            newRow.endTime = dayjs(newVoucherData.workDate).startOf("day").add(17, "hour");
        } else {
            newRow.startTime = dayjs(new Date()).startOf("day").add(9, "hour");
            newRow.endTime = dayjs(new Date()).startOf("day").add(17, "hour");
        }
        newVoucherData.body.push(newRow);
        setVoucherData(newVoucherData);
    };
    // Delete row
    const handleDeleteRow = (index, row) => {
        if (voucherData.body.length === 1) {
            message.error(t("cannotDeleteLastRow"));
            return
        }
        const newVoucherData = cloneDeep(voucherData);
        let newErrors = cloneDeep(errors);
        if (isModify) {// Determine if the added row in an editing state            
            if (row.id === 0) { // If id equals 0, the row was newly added, so delete it.
                newVoucherData.body.splice(index, 1);
                newErrors.body.splice(index, 1);
            } else { // If id is not equal to 0, the row has already been saved to the server,
                // the row's deletion flag must be modified.
                newVoucherData.body[index].dr = 1;
                newErrors.body[index] = {};
            }
        } else {
            // In the Added State, delete the row directly
            newVoucherData.body.splice(index, 1);
            newErrors.body.splice(index, 1);
        }
        setErrors(newErrors);
        setVoucherData(newVoucherData);
    };

    // Add or Edit Work Order
    const handleAddWO = async () => {
        // Convert the data to the backend format
        const thisWO = transWOToBackend(voucherData);
        if (isModify) {
            let editRes = await reqEditWO(thisWO);
            if (editRes.status) {
                message.success(t("modifySuccessful"));
            }
        } else {
            let addRes = await reqAddWO(thisWO);
            if (addRes.status) {
                message.success(t("addSuccessful"));
            }
        }
        onOk();
    };

    // Check if the startTime is compliant
    const checkStartTime = async (newValue, itemKey, positionID, rowIndex) => {
        let err = { isErr: false, msg: "" };
        if (newValue > voucherData.body[rowIndex].endTime) {
            err = { isErr: true, msg: "startTimeExceedEndTime" };
        }
        return err;
    };
    // Check if the endTime is compliant
    const checkEndTime = async (newValue, itemKey, positionID, rowIndex) => {
        let err = { isErr: false, msg: "" };
        if (newValue < voucherData.body[rowIndex].startTime) {
            err = { isErr: true, msg: "endTimePrecedeStartTime" };
        }
        return err;
    };

    return voucherData !== undefined
        ? <Stack component="div" id="eidtEIT" sx={{ overflowX: "hidden", overflowY: "hidden", p: 2 }}>
            <Stack component={"div"} id="voucherTitle" sx={{ display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: 2 }}>
                <Typography variant="h3" component={"h3"}>{t("wo")}</Typography>
            </Stack>
            <Stack component="div" id="voucherHead" sx={{ p: 2 }}>
                <Grid container id="VoucherHeader" spacing={2}>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="billNumber"
                            itemKey="billNumber"
                            initValue={voucherData.billNumber}
                            placeholder=""
                            isBackendTest={false}
                            key="billNumber"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={306}
                            allowNull={false}
                            isEdit={false}
                            itemShowName="billDate"
                            itemKey="billDate"
                            initValue={voucherData.billDate}
                            pickDone={handleGetValue}
                            placeholder=""
                            isBackendTest={false}
                            key="billDate"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={520}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="department"
                            itemKey="department"
                            initValue={voucherData.department}
                            pickDone={handleGetValue}
                            placeholder="deptPlaceholder"
                            isBackendTest={false}
                            key="department"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={306}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="operationDate"
                            itemKey="workDate"
                            initValue={voucherData.workDate}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="workDate"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={405}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="status"
                            itemKey="status"
                            initValue={voucherData.status}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="status"
                            positionID={0}
                            rowIndex={-1}
                            color="warning"
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="description"
                            itemKey="description"
                            initValue={voucherData.description}
                            pickDone={handleGetValue}
                            placeholder="descriptionPlaceholder"
                            isBackendTest={false}
                            key="description"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                </Grid>
            </Stack>
            <ScVoucherBody bodyColumns={bodyColumns} addRowAction={handleAddRow} addRowVisible={isEdit}>
                <ScVoucherBodyRow>
                    {voucherData.body.map((row, index) => {
                        return row.dr === 0
                            ? (<tr key={"bodyrow" + row.rowNumber}>
                                <td>
                                    <Tooltip title={t("copyAdd")} key={`rowCopyAdd${index}`}>
                                        <span>
                                            <IconButton size="small" sx={{ width: 40, height: 40 }} onClick={() => handleCopyAddRow(index)} disabled={!isEdit}>
                                                <CopyAddRowIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                    <Tooltip title={t("deleteRow")} key={`rowDelete${index}`}>
                                        <span>
                                            <IconButton size="small" sx={{ width: 40, height: 40 }} onClick={() => handleDeleteRow(index, row)} disabled={!isEdit}>
                                                <DeleteRowIcon color={isEdit ? "error" : "transparent"} fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </td>
                                <td>
                                    <ScInput
                                        dataType={302}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="rowNumber"
                                        itemKey="rowNumber"
                                        initValue={row.rowNumber}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="rowNumber"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={570}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="csa"
                                        itemKey="csa"
                                        initValue={row.csa}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="csa"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={510}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="executor"
                                        itemKey="executor"
                                        initValue={row.executor}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="executor"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={isEdit}
                                        itemShowName="description"
                                        itemKey="description"
                                        initValue={row.description}
                                        pickDone={handleGetValue}
                                        placeholder="descriptionPlaceholder"
                                        isBackendTest={false}
                                        key="description"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={580}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="ept"
                                        itemKey="ept"
                                        initValue={row.ept}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="ept"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={307}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="startTime"
                                        itemKey="startTime"
                                        initValue={row.startTime}
                                        pickDone={handleGetValue}
                                        isBackendTest={true}
                                        backendTestFunc={checkStartTime}
                                        key="startTime"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={307}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="endTime"
                                        itemKey="endTime"
                                        initValue={row.endTime}
                                        pickDone={handleGetValue}
                                        isBackendTest={true}
                                        backendTestFunc={checkEndTime}
                                        key="endTime"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={405}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="status"
                                        itemKey="status"
                                        initValue={row.status}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="status"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                            </tr>
                            )
                            : null
                    })}
                </ScVoucherBodyRow>
            </ScVoucherBody>
            <Stack component="div" id="voucherRoot">
                <Grid container id="voucherRoot" spacing={2}>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={510}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="creator"
                            itemKey="creator"
                            initValue={voucherData.creator}
                            pickDone={() => { }}
                            isBackendTest={false}
                            key="creator"
                            positionID={2}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={309}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="createDate"
                            itemKey="createDate"
                            initValue={voucherData.createDate}
                            pickDone={() => { }}
                            isBackendTest={false}
                            key="createDate"
                            positionID={2}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={510}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="modifier"
                            itemKey="modifier"
                            initValue={voucherData.modifier}
                            pickDone={() => { }}
                            isBackendTest={false}
                            key="modifier"
                            positionID={2}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={309}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="modifyDate"
                            itemKey="modifyDate"
                            initValue={voucherData.modifyDate}
                            pickDone={() => { }}
                            isBackendTest={false}
                            key="modifyDate"
                            positionID={2}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={510}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="confirmer"
                            itemKey="confirmer"
                            initValue={voucherData.confirmer}
                            pickDone={() => { }}
                            isBackendTest={false}
                            key="confirmer"
                            positionID={2}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={309}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="confirmDate"
                            itemKey="confirmDate"
                            initValue={voucherData.confirmDate}
                            pickDone={() => { }}
                            isBackendTest={false}
                            key="confirmDate"
                            positionID={2}
                            rowIndex={-1}
                        />
                    </Grid>
                </Grid>
            </Stack>
            <DialogActions sx={{ m: 1 }}>
                {isEdit
                    ? <>
                        <Button color="error" onClick={onCancel} >{t("cancel")}</Button>
                        <Button variant="contained" disabled={checkVoucherErrors(errors)} onClick={handleAddWO}>{t(isModify ? "save" : "add")}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >{t("back")}</Button>
                }
            </DialogActions>
        </Stack>
        : <Loader />
};

export default EditWorkOrder;
