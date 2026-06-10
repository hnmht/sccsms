import { useState, useEffect } from "react";
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
import { DeleteRowIcon } from "../../../component/PubIcon/PubIcon";
import { dayjs, EpochTime } from "../../../i18n/dayjs";
import { ScVoucherBody, ScVoucherBodyRow } from "../../../component/ScVoucher";
import Loader from "../../../component/Loader/Loader";
import ScInput from "../../../component/ScInput";
import SelectMultiplePerson from "./selectMultiplePerson/selectultiplePerson";

import store from "../../../store";
import { MultiSortByArr } from "../../../utils/tools";

import { reqAddTR, reqEditTR } from "../../../api/trainingRecord";
import { voucherRow, bodyColumns, headFiles } from "./constructor";
import { generateVoucherErrors, checkVoucherErrors } from "../pub/pubFunction";

// Generate initial data
const getInitialValue = async (isNew, isModify, oriTr) => {
    const { user } = store.getState();
    const { person, department } = user;
    const currentTime = dayjs(new Date());
    const currentDate = currentTime.startOf("day");
    let newTr = {};
    if (isNew) {// Add new
        newTr = {
            id: 0,
            billNumber: "",
            billDate: currentDate,
            department: department,
            description: "",
            lecturer: { id: 0, code: "", name: "", avatar: { fileKey: 0, fileUrl: "" }, deptID: 0, deptCode: "", description: "" },
            trainingDate: currentDate,
            tc: { id: 0, code: "", name: "", classHour: 1.0, isExam: 1, files: [] },
            tcFiles: [],
            startTime: currentTime,
            endTime: currentTime.add(1, "hour"),
            classHour: 1.0,
            isExam: 1,
            hFiles: [headFiles],
            body: [voucherRow],
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
        if (!oriTr) {
            return
        } else {
            if (isModify) { // Edit
                newTr = cloneDeep(oriTr);
                newTr.tcFiles = newTr.tc.files;
                newTr.modifier = person;
                newTr.modifyDate = currentTime;
            } else {// View
                newTr = cloneDeep(oriTr);
                newTr.tcFiles = newTr.tc.files;
            }
        }
    }
    return newTr;
};

// Add && Edit && View Training Record
const EditTrainingRecord = ({ isOpen, isNew, isModify, oriTr, onCancel, onOk, t }) => {
    const [voucherData, setVoucherData] = useState((undefined));
    const [errors, setErrors] = useState(undefined);
    const isEdit = !(!isModify && !isNew);

    useEffect(() => {
        async function initVoucher() {
            const newTr = await getInitialValue(isNew, isModify, oriTr);
            setVoucherData(newTr);
            setErrors(generateVoucherErrors(newTr.body.length));
        }
        if (isOpen) {
            initVoucher();
        }
    }, [isOpen, isModify, oriTr, isNew]);

    // Get the passed data from the ScInput Component
    const handleGetValue = async (value, itemKey, positionID, rowIndex, errMsg) => {
        if (voucherData === undefined || !isEdit || !isOpen) {
            return
        }
        // let startTime = new Date();
        // Change voucher data
        setVoucherData((prevState) => {
            let newData = cloneDeep(prevState);
            switch (positionID) {
                case 0://  Change the Voucher header
                    // If the field is "tc"
                    if (itemKey === "tc" && value.id !== prevState.tc.id) {
                        const currentTime = dayjs(new Date());
                        // Change the classHour field
                        newData.classHour = value.classHour;
                        // Chenge the startTime field
                        newData.startTime = currentTime;
                        // Change the endTime field
                        newData.endTime = currentTime.add(value.classHour, "hour");
                        // Change the isExam field
                        newData.isExam = value.isExam;
                        // Change the tcFiles field
                        newData.tcFiles = value.files;
                        // Change startTime && endTime && isExam && classHour Fields in the body
                        if (newData.body.length > 0) {
                            newData.body.map(row => {
                                row.startTime = newData.startTime;
                                row.endTime = newData.endTime;
                                row.isExam = newData.isExam;
                                row.classHour = newData.classHour;
                                return row;
                            })
                        };
                    };

                    // If the field is "startTime"
                    if (itemKey === "startTime" && value !== prevState.startTime) {
                        if (newData.body.length > 0) { // If the number of body row is not zero
                            newData.body.map(row => {
                                row.startTime = value;
                                return row;
                            })
                        }
                    };
                    // If the field is "endTime"
                    if (itemKey === "endTime" && value !== prevState.endTime) {
                        if (newData.body.length > 0) {
                            newData.body.map(row => {
                                row.endTime = value;
                                return row;
                            })
                        }
                    };
                    // If the field is "classHour"
                    if (itemKey === "classHour" && value !== prevState.classHour) {
                        if (newData.body.length > 0) {
                            newData.body.map(row => {
                                row.classHour = value;
                                return row;
                            })
                        }
                    }
                    newData[itemKey] = value;
                    break;
                case 1: // Change the voucher row
                    // If the field is "student"
                    if (itemKey === "student" && value.id !== prevState.body[rowIndex].student.id) {
                        // Update the PositionName                     
                        newData.body[rowIndex].positionName = value.positionName;
                        // Update the deptName
                        newData.body[rowIndex].deptName = value.deptName;
                    }
                    newData.body[rowIndex][itemKey] = value;
                    break;
                case 2: // Change the voucher footer
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
    // Add && Modify Training Record
    const handleAddTR = async () => {
        const thisTR = cloneDeep(voucherData);
        delete thisTR.createDate;
        delete thisTR.modifyDate;
        delete thisTR.confirmDate;

        if (isModify) {
            const editRes = await reqEditTR(thisTR);
            if (editRes.status) {
                message.success(t("modifySuccessful"));
                onOk();
            }
        } else {
            const addRes = await reqAddTR(thisTR);
            if (addRes.status) {
                message.success(t("addSuccessful"));
            }
            onOk();
        }

    };
    // Add Row
    const handleAddRow = () => {
        const newVoucherData = cloneDeep(voucherData);
        let newRow = cloneDeep(voucherRow);
        // Automatically generate row number
        if (newVoucherData.body.length === 1) {
            newRow.rowNumber = newVoucherData.body[0].rowNumber + 10;
        } else {
            newVoucherData.body.sort(MultiSortByArr([{ field: "rowNumber", order: "asc" }]));
            newRow.rowNumber = newVoucherData.body[newVoucherData.body.length - 1].rowNumber + 10;
        }
        // Automatically fill startTime, endTime, classHour
        newRow.startTime = newVoucherData.startTime;
        newRow.endTime = newVoucherData.endTime;
        newRow.classHour = newVoucherData.classHour;
        newVoucherData.body.push(newRow);
        setVoucherData(newVoucherData);
        // Generate errors
        let newErrors = cloneDeep(errors);
        newErrors.body.push({});
        setErrors(newErrors);
    };
    // Delete Row
    const handleDeleteRow = (index, row) => {
        if (voucherData.body.length === 1) {
            message.error(t("cannotDeleteLastRow"));
            return
        }
        const newVoucherData = cloneDeep(voucherData);
        let newErrors = cloneDeep(errors);
        if (isModify) {
            // Determine if the added row in an editing state 
            if (row.id === 0) { // If the id queals 0, the row was newly added, so delete it
                newVoucherData.body.splice(index, 1);// 
                newErrors.body.splice(index, 1);
            } else { // If id is not equals 0, it means the row has already been saved to the server.
                newVoucherData.body[index].dr = 1;
                newErrors.body[index] = {};
            }
        } else { // in the added state, delete the row directly
            newVoucherData.body.splice(index, 1);
            newErrors.body.splice(index, 1);
        }
        setErrors(newErrors);
        setVoucherData(newVoucherData);
    };
    // Bulk add student
    const handleAddMultiplePersonOk = (items) => {
        if (items.length === 0) {
            message.error(t("bulkAddStudentSelected", { count: 0 }));
            return
        }
        // let startTime = new Date();
        const newVoucherData = cloneDeep(voucherData);
        const newErrors = cloneDeep(errors);
        let rowNumber = 0;
        // Find the maximum row number
        newVoucherData.body.sort(MultiSortByArr([{ field: "rowNumber", order: "asc" }]));
        rowNumber = newVoucherData.body[newVoucherData.body.length - 1].rowNumber;
        let validNumber = 0;
        items.forEach(person => {
            // Check if the person's information already exists in the voucher body
            let pNumber = 0;
            newVoucherData.body.forEach(row => {
                if (row.student.id === person.id) {
                    pNumber++
                }
            });
            // If the person's information does not in the voucher body
            if (pNumber === 0) {
                validNumber++
                let newRow = cloneDeep(voucherRow);
                rowNumber = rowNumber + 10;
                newRow.rowNumber = rowNumber;
                newRow.student = person;
                newRow.positionName = person.positionName;
                newRow.deptName = person.deptName;
                newRow.startTime = newVoucherData.startTime;
                newRow.endTime = newVoucherData.endTime;
                newRow.classHour = newVoucherData.classHour;

                newVoucherData.body.push(newRow);
                newErrors.body.push({});
            }
        });
        setVoucherData(newVoucherData);
        setErrors(newErrors);
        message.info(t("bulkAddStudentSelected", { count: items.length }) + t("bulkAddStudentAdded", { count: validNumber }));

    };
    // Check for duplicate students
    const handleCheckPersonRepeat = (value, index) => {
        let err = { isErr: false, msg: "" };
        let number = 0;
        voucherData.body.forEach((row, i) => {
            if (row.student.id === value.id && index !== i) {
                number++
            }
        });
        if (number > 0) {
            err = { isErr: true, msg: "studentCannotDuplicate" };
            return err;
        }
        return err;

    };
    
    return (voucherData !== undefined
        ? <>
            <Stack component="div" id="eidtED" sx={{ overflowX: "hidden", overflowY: "hidden", p: 2 }}>
                <Stack component={"div"} id="voucherTitle" sx={{ display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: 2 }}>
                    <Typography variant="h3" component={"h3"}>{t("tr")}</Typography>
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
                        <Grid item xs={2}>
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
                        <Grid item xs={2}>
                            <ScInput
                                dataType={510}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="lecturer"
                                itemKey="lecturer"
                                initValue={voucherData.lecturer}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="lecturer"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={620}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="tc"
                                itemKey="tc"
                                initValue={voucherData.tc}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="tc"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={302}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="classHour"
                                itemKey="classHour"
                                initValue={voucherData.classHour}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="classHour"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={902}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="tcFiles"
                                itemKey="tcFiles"
                                initValue={voucherData.tcFiles}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="tcFiles"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={307}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="startTime"
                                itemKey="startTime"
                                initValue={voucherData.startTime}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="startTime"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={307}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="endTime"
                                itemKey="endTime"
                                initValue={voucherData.endTime}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="endTime"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1} sx={{ alignContent: "center", justifyContent: "center" }}>
                            <ScInput
                                dataType={403}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="isExam"
                                itemKey="isExam"
                                initValue={voucherData.isExam}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="isExam"
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
                    actionComponent={<SelectMultiplePerson
                        isEdit={isEdit}
                        title="bulkSelectPersonnel"
                        onOk={handleAddMultiplePersonOk}
                    />}
                >
                    <ScVoucherBodyRow >
                        {voucherData.body.map((row, index) => {
                            const delButtonEnabled = !isEdit;
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
                                            itemShowName="student"
                                            itemKey="student"
                                            initValue={row.student}
                                            pickDone={handleGetValue}
                                            isBackendTest={true}
                                            backendTestFunc={(value) => handleCheckPersonRepeat(value, index)}
                                            key="student"
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
                                            dataType={307}
                                            allowNull={false}
                                            isEdit={isEdit}
                                            itemShowName="startTime"
                                            itemKey="startTime"
                                            initValue={row.startTime}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
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
                                            isBackendTest={false}
                                            key="endTime"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={302}
                                            allowNull={true}
                                            isEdit={isEdit}
                                            itemShowName="classHour"
                                            itemKey="classHour"
                                            initValue={row.classHour}
                                            pickDone={handleGetValue}
                                            placeholder=""
                                            isBackendTest={false}
                                            key="classHour"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={404}
                                            allowNull={false}
                                            isEdit={isEdit && voucherData.isExam === 1}
                                            itemShowName="examRes"
                                            itemKey="examRes"
                                            initValue={row.examRes}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="examRes"
                                            positionID={1}
                                            rowIndex={index}
                                        />
                                    </td>
                                    <td>
                                        <ScInput
                                            dataType={302}
                                            allowNull={true}
                                            isEdit={isEdit && voucherData.isExam === 1}
                                            itemShowName="examScore"
                                            itemKey="examScore"
                                            initValue={row.examScore}
                                            pickDone={handleGetValue}
                                            isBackendTest={false}
                                            key="examScore"
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
                            <Button variant="contained" disabled={checkVoucherErrors(errors)} onClick={handleAddTR}>{t(isModify ? "save" : "add")}</Button>
                        </>
                        : <Button variant="contained" onClick={onCancel} >{t("back")}</Button>
                    }
                </DialogActions>
            </Stack>
        </>
        : <Loader />
    );
};

export default EditTrainingRecord;