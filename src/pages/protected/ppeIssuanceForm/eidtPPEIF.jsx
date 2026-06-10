import { useState, useEffect, useRef } from "react";
import {
    Stack,
    Typography,
    Grid,
    DialogActions,
    Button,
    Tooltip,
    IconButton,
    TableCell
} from "@mui/material";

import { cloneDeep } from "lodash";
import { message } from "mui-message";
import { DeleteRowIcon, PrintIcon } from "../../../component/PubIcon/PubIcon";
import { dayjs, EpochTime } from "../../../i18n/dayjs";
import { ScVoucherBody, ScVoucherBodyRow } from "../../../component/ScVoucher";
import Loader from "../../../component/Loader/Loader";
import ScInput from "../../../component/ScInput";

import store from "../../../store";
import { MultiSortByArr } from "../../../utils/tools";
import { PeriodStartandEnd } from "../../../storage/dataTypes";
import { useReactToPrint } from "react-to-print";
import { PPEIFPrintRegFormA4, PPEIFPrintDeliveryA4 } from "./printTemp/printA4";
import { reqAddPPEIF, reqEditPPEIF } from "../../../api/ppeIssuanceForm";
import { voucherRow, bodyColumns, headFiles } from "./constructor";
import { generateVoucherErrors, checkVoucherErrors } from "../pub/pubFunction";

// Generate initial data
const getInitialValue = async (isNew, isModify, oriPPEIF) => {
    const { user } = store.getState();
    const { person, department } = user;
    const currentTime = dayjs(new Date());
    const currentDate = currentTime.startOf("day");
    let newPPEIF = {};

    if (isNew) {// Add New
        newPPEIF = {
            id: 0,
            billNumber: "",
            billDate: currentDate,
            department: department,
            description: "",
            period: "month",
            startDate: currentDate.startOf("month"),
            endDate: currentDate.endOf("month"),
            hFiles: [headFiles],
            body: [voucherRow],
            sourceType: "DA",
            status: 0,
            creator: person,
            createDate: currentTime,
            modifier: { id: 0, code: "", name: "" },
            modifyDate: EpochTime,
            confirmer: { id: 0, code: "", name: "" },
            confirmDate: EpochTime,
            dr: 0
        };
    } else {
        if (!oriPPEIF) {
            return
        } else {
            if (isModify) { // Edit
                newPPEIF = cloneDeep(oriPPEIF);
                newPPEIF.modifier = person;
                newPPEIF.modifyDate = currentTime;
            } else {// View
                newPPEIF = cloneDeep(oriPPEIF);
            }
        }
    }
    return newPPEIF;
};

// Add && Edit && View PPE Issuance Form
const EditPPEIF = ({ isOpen, isNew, isModify, oriPPEIF, onCancel, onOk, t }) => {
    const [voucherData, setVoucherData] = useState((undefined));
    const [errors, setErrors] = useState(undefined);
    const isEdit = !(!isModify && !isNew);
    let printAreaRef = useRef();
    let printAreaRefb = useRef();

    useEffect(() => {
        async function initVoucher() {
            const newPPEIF = await getInitialValue(isNew, isModify, oriPPEIF);
            setVoucherData(newPPEIF);
            setErrors(generateVoucherErrors(newPPEIF.body.length));
        }
        if (isOpen) {
            initVoucher();
        }
    }, [isOpen, isModify, oriPPEIF, isNew]);

    // Get the passed data from the ScInput Component
    const handleGetValue = async (value, itemkey, positionID, rowIndex, errMsg) => {
        if (voucherData === undefined || !isEdit || !isOpen) {
            return
        }
        // Change the voucher data
        setVoucherData((prevState) => {
            const newData = cloneDeep(prevState);
            switch (positionID) {
                case 0:// Change the Voucher header 
                    // If the field is "period"
                    if (itemkey === "period" && value !== prevState.period) {
                        const p = PeriodStartandEnd(value);
                        newData.startDate = p.startDate;
                        newData.endDate = p.endDate;
                    };
                    newData[itemkey] = value;
                    break;
                case 1: // Change the voucher body
                    // If the field is "recipient"
                    if (itemkey === "recipient" && value.id !== prevState.body[rowIndex].recipient.id) {
                        // Get Position Name                     
                        newData.body[rowIndex].positionName = value.positionName;
                        // get Department Name
                        newData.body[rowIndex].deptName = value.deptName;
                    }

                    // If the field is "PPE"
                    if (itemkey === "ppe" && value.id !== prevState.body[rowIndex].ppe.id) {
                        // Get PPE code                    
                        newData.body[rowIndex].ppeCode = value.code;
                        // Get PPE model
                        newData.body[rowIndex].ppeModel = value.model;
                        // Get PPE　ｕｎｉｔ
                        newData.body[rowIndex].ppeUnit = value.unit;
                    }
                    newData.body[rowIndex][itemkey] = value;
                    break;
                case 2: //Change the voucher footer
                    newData[itemkey] = value;
                    break;
                default:
                    break;
            }
            return newData;
        });
        // Change the errors data
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
    // Add Or Edit PPE Issuance Form
    const handleAddPPEIF = async () => {
        const thisPPEIF = cloneDeep(voucherData);
        delete thisPPEIF.createDate;
        delete thisPPEIF.modifyDate;
        delete thisPPEIF.confirmDate;

        if (isModify) {
            const editRes = await reqEditPPEIF(thisPPEIF);
            if (editRes.status) {
                message.success(t("modifySuccessful"));
                onOk();
            }
        } else {
            const addRes = await reqAddPPEIF(thisPPEIF);
            if (addRes.status) {
                message.success(t("addSuccessful"));
                onOk();
            } 
        }
    };
    // Add body row
    const handleAddRow = () => {
        const newVoucherData = cloneDeep(voucherData);
        let newRow = cloneDeep(voucherRow);
        // Automaticaly generate row number
        if (newVoucherData.body.length === 1) { 
            newRow.rowNumber = newVoucherData.body[0].rowNumber + 10;
        } else {
            newVoucherData.body.sort(MultiSortByArr([{ field: "rowNumber", order: "asc" }]));
            newRow.rowNumber = newVoucherData.body[newVoucherData.body.length - 1].rowNumber + 10;
        }       
        newVoucherData.body.push(newRow);
        setVoucherData(newVoucherData);
        // Generate errors
        let newErrors = cloneDeep(errors);
        newErrors.body.push({});
        setErrors(newErrors);
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
            if (row.id === 0) { // If the id equal 0, the row was newly added, so delete it
                newVoucherData.body.splice(index, 1);
                newErrors.body.splice(index, 1);
            } else { // if the id not euqals 0, ite means the row has already been saved 
                newVoucherData.body[index].dr = 1;  
                newErrors.body[index] = {}; 
            }
        } else { // In the added state, delete the row directly
            newVoucherData.body.splice(index, 1);
            newErrors.body.splice(index, 1);
        }
        setErrors(newErrors);
        setVoucherData(newVoucherData);
    };

    const handlePrintClick = useReactToPrint({
        content: () => printAreaRef.current,
    });

    const handlePrintDeliveryClick = useReactToPrint({
        content: () => printAreaRefb.current,
    });

    return (voucherData !== undefined
        ? <>
            <Stack component="div" id="eidtED" sx={{ overflowX: "hidden", overflowY: "hidden", p: 2 }}>
                <Stack component={"div"} id="voucherTitle" sx={{ display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: 2 }}>
                    <Typography variant="h3" component={"h3"}>{t("ppeIssuanceForm")}</Typography>
                </Stack>
                <Stack component="div" id="voucherHead" sx={{ p: 2 }}>
                    <Grid container id="VoucherHeader" spacing={2}>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="billNumber"
                                itemKey="billNumber"
                                initValue={voucherData.billNumber}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="billNumber"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
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
                                dataType={520}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="department"
                                itemKey="department"
                                initValue={voucherData.department}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="department"
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
                                isBackendTest={false}
                                key="period"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={306}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="startDate"
                                itemKey="startDate"
                                initValue={voucherData.startDate}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="startDate"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={306}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="endDate"
                                itemKey="endDate"
                                initValue={voucherData.endDate}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="endDate"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={902}
                                allowNull={true}
                                isEdit={isEdit}
                                itemShowName="hFiles"
                                itemKey="hFiles"
                                initValue={voucherData.hFiles}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="hFiles"
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
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={isEdit}
                                itemShowName="description"
                                itemKey="description"
                                placeholder={"descriptionPlaceholder"}
                                initValue={voucherData.description}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="description"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                    </Grid>
                </Stack>
                <ScVoucherBody
                    bodyColumns={bodyColumns}
                    addRowAction={handleAddRow}
                    addRowVisible={isEdit}
                    title="detail"
                >
                    <ScVoucherBodyRow >
                        {voucherData.body.map((row, index) => {
                            const delButtonEnabled = (!isEdit || (row.allowdelrow === 0));
                            return row.dr === 0
                                ? (<tr key={"bodyrow" + row.rowNumber}>
                                    <TableCell variant="td">
                                        <Tooltip title={t("deleteRow")} key={`rowDelete${index}`}>
                                            <span>
                                                <IconButton size="small" sx={{ width: 40, height: 40 }} onClick={() => handleDeleteRow(index, row)} disabled={delButtonEnabled}>
                                                    <DeleteRowIcon color={!delButtonEnabled ? "error" : "transparent"} fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </TableCell>
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
                                            dataType={510}
                                            allowNull={false}
                                            isEdit={isEdit}
                                            itemShowName="recipient"
                                            itemKey="recipient"
                                            initValue={row.recipient}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="recipient"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={301}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="positionName"
                                            itemKey="positionName"
                                            initValue={row.positionName}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="positionName"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={301}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="deptName"
                                            itemKey="deptName"
                                            initValue={row.deptName}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="deptName"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={301}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="ppeCode"
                                            itemKey="ppeCode"
                                            initValue={row.ppeCode}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="ppeCode"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={630}
                                            allowNull={false}
                                            isEdit={isEdit}
                                            itemShowName="ppeName"
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
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="ppeModel"
                                            itemKey="ppeModel"
                                            initValue={row.ppeModel}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="ppeModel"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={301}
                                            allowNull={true}
                                            isEdit={false}
                                            itemShowName="ppeUnit"
                                            itemKey="ppeUnit"
                                            initValue={row.ppeUnit}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="ppeUnit"
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
                                            dataType={902}
                                            allowNull={true}
                                            isOnSitePhoto={false}
                                            isEdit={isEdit}
                                            itemShowName="files"
                                            itemKey="files"
                                            initValue={row.files}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="files"
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
                            <Button variant="contained" disabled={checkVoucherErrors(errors)} onClick={handleAddPPEIF}>{t(isModify ? "save" : "add")}</Button>
                        </>
                        : <>
                            <div style={{ display: "none" }}>
                                <PPEIFPrintRegFormA4 voucherData={voucherData} ref={printAreaRef} t={t} />
                                <PPEIFPrintDeliveryA4 voucherData={voucherData} ref={printAreaRefb} t={t} />
                            </div>
                            <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrintDeliveryClick}>{t("printDeliveryNote")}</Button>
                            <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrintClick}>{t("printSinatureForm")}</Button>
                            <Button variant="contained" onClick={onCancel} >{t("back")}</Button>
                        </>
                    }
                </DialogActions>
            </Stack>
        </>
        : <Loader />
    );
};

export default EditPPEIF;