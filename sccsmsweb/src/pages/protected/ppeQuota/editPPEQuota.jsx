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
import { DateTimeFormat, dayjs, EpochTime } from "../../../i18n/dayjs";
import { cloneDeep } from "lodash";
import { message } from "mui-message";

import { CopyAddRowIcon, DeleteRowIcon } from "../../../component/PubIcon/PubIcon";
import ScInput from "../../../component/ScInput";
import Loader from "../../../component/Loader/Loader";
import { MultiSortByArr } from "../../../utils/tools";
import { voucherRow, bodyColumns } from "./constructor";
import { reqAddPPEQuota, reqEditPPEQuota, reqCheckPositionQuota } from "../../../api/ppeQuota";

import { getCurrentPerson, generateVoucherErrors, checkVoucherErrors } from "../pub/pubFunction";
import { ScVoucherBody, ScVoucherBodyRow } from "../../../component/ScVoucher";

// Generate Initial PPE Quota Data
const getInitialValue = async (oriPPEQuota, isNew, isModify) => {
    const person = await getCurrentPerson();
    const currentTime = dayjs(new Date());
    const currentDate = currentTime.startOf("day");
    let newPPEQuota = { // Add 
        id: 0,
        billDate: currentDate,
        position: { id: 0, name: "", description: "" },
        period: "month",
        description: "",
        status: 0,
        body: [voucherRow],
        creator: person,
        createDate: currentTime,
        modifier: { id: 0, code: "", name: "" },
        modifyDate: EpochTime,
        confirmer: { id: 0, code: "", name: "" },
        confirmDate: EpochTime,
        dr: 0
    };

    if (isNew) {
        if (oriPPEQuota) {// Copy Add            
            newPPEQuota = cloneDeep(oriPPEQuota);
            newPPEQuota.id = 0;
            newPPEQuota.billDate = currentDate;
            newPPEQuota.status = 0;
            newPPEQuota.body.map((row) => {
                row.id = 0;
                row.hid = 0;
                row.status = 0;
                return row;
            });
            newPPEQuota.creator = person;
            newPPEQuota.createDate = currentTime;
            newPPEQuota.modifier = { id: 0, code: "", name: "" };
            newPPEQuota.modifyDate = EpochTime;
            newPPEQuota.confirmer = { id: 0, code: "", name: "" };
            newPPEQuota.confirmDate = EpochTime;
        }
    } else { // Edit Or View
        if (!oriPPEQuota) {
            return
        } else {
            if (isModify) { // Edit                
                newPPEQuota = cloneDeep(oriPPEQuota);
                newPPEQuota.modifier = person;
                newPPEQuota.modifyDate = currentTime;
            } else { // View
                newPPEQuota = cloneDeep(oriPPEQuota);
            }
        }
    }
    return newPPEQuota;
};
// Add,Edit,View Personal Protective Equipment Quotas per Position
const EditPPEQuota = ({ isOpen, isNew, isModify, oriPPEQuota, onCancel, onOk, t }) => {
    const [voucherData, setVoucherData] = useState((undefined));
    const [errors, setErrors] = useState(() => generateVoucherErrors(oriPPEQuota ? oriPPEQuota.body.length : 1));
    const isEdit = !(!isModify && !isNew);

    useEffect(() => {
        async function initVoucher() {
            const newPq = await getInitialValue(oriPPEQuota, isNew, isModify);
            setVoucherData(newPq);
        }
        if (isOpen) {
            initVoucher();
        }
    }, [isOpen, oriPPEQuota, isModify, isNew]);

    // Get the passed data from the ScInput Component
    const handleGetValue = async (value, itemkey, positionID, rowIndex, errMsg) => {
        if (voucherData === undefined || !isEdit || !isOpen) {
            return
        }
        // Change voucher data
        setVoucherData((prevState) => {
            let newData = cloneDeep(prevState);
            switch (positionID) {
                case 0:
                    newData[itemkey] = value;
                    break;
                case 1:
                    newData.body[rowIndex][itemkey] = value;
                    break;
                case 2:
                    newData[itemkey] = value;
                    break;
                default:
                    break;
            }
            return newData;
        });

        // Change the errors
        setErrors((prevState) => {
            let newErrors = cloneDeep(prevState);
            switch (positionID) {
                case 0:
                    newErrors[itemkey] = errMsg;
                    break;
                case 1:
                    newErrors.body[rowIndex][itemkey] = errMsg;
                    break;
                case 2:
                    newErrors[itemkey] = errMsg;
                    break;
                default:
                    break;
            }
            return newErrors;
        });
    };
    // Add Row
    const handleAddRow = () => {
        const newVoucherData = cloneDeep(voucherData);
        let newRow = cloneDeep(voucherRow);
        // Automaticaly generate row number
        if (newVoucherData.body.length === 1) {
            newRow.rowNumber = newVoucherData.body[0].rowNumber + 10;
        } else {
            newVoucherData.body.sort(MultiSortByArr([{ field: "rowNumber", order: "asc" }]))
            newRow.rowNumber = newVoucherData.body[newVoucherData.body.length - 1].rowNumber + 10;
        }
        newVoucherData.body.push(newRow);
        setVoucherData(newVoucherData);
        // Generate errors
        let newErrors = cloneDeep(errors);
        newErrors.body.push({});
        setErrors(newErrors);
    };
    // Copy current row content and add a new row
    const handleCopyAddRow = (index) => {
        const newVoucherData = cloneDeep(voucherData);
        let newRow = cloneDeep(voucherData.body[index]);
        // Generate errors value
        let newErrors = cloneDeep(errors);
        newErrors.body.push({});
        setErrors(newErrors);
        // Automatically generate row number 
        if (newVoucherData.body.length === 1) {
            newRow.rowNumber = newVoucherData.body[0].rowNumber + 10;
        } else {
            newVoucherData.body.sort(MultiSortByArr([{ field: "rowNumber", order: "asc" }]))
            newRow.rowNumber = newVoucherData.body[newVoucherData.body.length - 1].rowNumber + 10;
        }
        // Change id and hid fields
        newRow.id = 0;
        newRow.hid = newVoucherData.id;
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
        if (isModify) { // Define if the added row in an editing state            
            if (row.id === 0) {// If the id equal 0, the row was newly added, so delete it
                newVoucherData.body.splice(index, 1);
                newErrors.body.splice(index, 1);
            } else { // if id is not euqals 0, it means the row has already been saved to the saved
                newVoucherData.body[index].dr = 1;
                newErrors.body[index] = {};
            }
        } else {// in the added state, delete the row directly
            newVoucherData.body.splice(index, 1);
            newErrors.body.splice(index, 1);
        }
        setErrors(newErrors);
        setVoucherData(newVoucherData);
    };
    // Add && Edit PPE Position Quota 
    const handleAddPQ = async () => {
        const thisPPEQuota = cloneDeep(voucherData);
        delete thisPPEQuota.createDate;
        delete thisPPEQuota.modifyDate;
        delete thisPPEQuota.confirmDate;
        if (isModify) {
            let editRes = await reqEditPPEQuota(thisPPEQuota);
            if (editRes.status) {
                message.success(t("modifySuccessful"));
                onOk();
            }
        } else {
            let addRes = await reqAddPPEQuota(thisPPEQuota);
            if (addRes.status) {
                message.success(t("addSuccessful"));
                onOk();
            }
        }

    };
    // Check if a PPE  Quota for the same position
    const handleCheckSameOP = async (value) => {
        let err = { isErr: false, msg: "" };
        let resp = await reqCheckPositionQuota({ id: voucherData.id, position: value, "period": voucherData.period }, false);
        if (resp.status) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: resp.msg };
        }
        return err;
    };
    // Check if a PPE Quota for the same period
    const handleCheckSamePeriod = async (value) => {
        let err = { isErr: false, msg: "" };
        let resp = await reqCheckPositionQuota({ id: voucherData.id, position: voucherData.position, "period": value }, false);
        if (resp.status) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: resp.msg };
        }
        return err;
    };

    return voucherData !== undefined
        ? <Stack component="div" id="eidtEIT" sx={{ overflowX: "hidden", overflowY: "hidden", p: 2 }}>
            <Stack component={"div"} id="voucherTitle" sx={{ display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: 2 }}>
                <Typography variant="h3" component={"h3"}>{t("PPEPositionQuota")}</Typography>
            </Stack>
            <Stack component="div" id="voucherHead" sx={{ p: 2 }}>
                <Grid container id="VoucherHeader" spacing={2}>
                    <Grid item xs={1}>
                        <ScInput
                            dataType={306}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="billDate"
                            itemKey="billDate"
                            initValue={voucherData.billDate}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="billDate"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <ScInput
                            dataType={407}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="period"
                            itemKey="period"
                            initValue={voucherData.period}
                            pickDone={handleGetValue}
                            isBackendTest={true}
                            backendTestFunc={handleCheckSamePeriod}
                            key="period"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={610}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="position"
                            itemKey="position"
                            initValue={voucherData.position}
                            pickDone={handleGetValue}
                            isBackendTest={true}
                            backendTestFunc={handleCheckSameOP}
                            key="position"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={1}>
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
                    <Grid item xs={6}>
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
                                    <Tooltip title={t("copyAddRow")} key={`rowCopyAdd${index}`}>
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
                                        dataType={630}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="ppe"
                                        itemKey="ppe"
                                        initValue={row.ppe}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="ppe"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={301}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="unit"
                                        itemKey="unit"
                                        initValue={row.ppe.unit}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="unit"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={302}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="quantity"
                                        itemKey="quantity"
                                        initValue={row.quantity}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="quantity"
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
                        <Button variant="contained" disabled={checkVoucherErrors(errors)} onClick={handleAddPQ}>{t(isModify ? "save" : "add")}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >{t("back")}</Button>
                }
            </DialogActions>
        </Stack>
        : <Loader />
};

export default EditPPEQuota;
