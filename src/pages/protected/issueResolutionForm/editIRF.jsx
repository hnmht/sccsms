import { useState, useEffect } from "react";
import {
    Stack,
    Typography,
    DialogActions,
    Button,
    DialogContent,
    Grid,
    Divider as MuiDivider,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { dayjs, EpochTime } from "../../../i18n/dayjs";
import { cloneDeep } from "lodash";
import { message } from "mui-message";
import ScInput from "../../../component/ScInput";
import Loader from "../../../component/Loader/Loader";
import store from "../../../store";
import { checkVoucherNoBodyErrors } from "../pub/pubFunction";
import { reqAddIRF, reqEditIRF } from "../../../api/issueResolutionForm";

const Divider = styled(MuiDivider)`   
    color:${(props) => props.theme.palette.text.disabled};
`;
// Gendrate initial data
const getInitialValue = async (isNew, isModify, oriEOR, oriIRF) => {
    const { user } = store.getState();
    const currentTime = dayjs(new Date);
    const currentDate = currentTime.startOf("day");
    const { person, department } = user;
    const emptyPerson = { id: 0, code: "", name: "" };
    let newIRF = {};
    if (isNew) {
        if (oriEOR) {// Add by reference the Execution Order Row
            newIRF = {
                id: 0,
                billNumber: "",
                billDate: currentDate,
                csa: oriEOR.csa,
                epa: oriEOR.epa,
                executionValue: oriEOR.executionValue,
                executionValueDisp: oriEOR.executionValueDisp,
                executor: oriEOR.executor,
                department: department,
                issueOwner: oriEOR.issueOwner,
                handler: person,
                isFinish: 1,
                startTime: oriEOR.handleStartTime,
                endTime: oriEOR.handleendtime,
                eoDescription: oriEOR.description,
                description: "",
                status: 0,
                riskLevel: oriEOR.riskLevel,
                sourceType: "EO",
                sourceBillNumber: oriEOR.billNumber,
                sourceHID: oriEOR.hid,
                sourceRowNumber: oriEOR.rowNumber,
                sourceBID: oriEOR.id,
                sourceRowTs: oriEOR.ts,
                issueFiles: oriEOR.eoFiles ? oriEOR.eoFiles : [],
                fixFiles: [],
                dr: 0,
                creator: person,
                modifier: emptyPerson,
                createDate: currentTime,
                modifyDate: EpochTime,
                confirmer: emptyPerson,
                confirmDate: EpochTime
            }
        } else { // Direct adding is not permitted
            newIRF = undefined;
        }
    } else {
        if (!oriIRF) { // Error
            newIRF = undefined;
        } else {
            if (isModify) { // Edit
                newIRF = cloneDeep(oriIRF);
                newIRF.modifier = person;
                newIRF.modifyDate = currentTime;
                newIRF.confirmer = emptyPerson;
                newIRF.confirmDate = EpochTime;
            } else { // View
                newIRF = cloneDeep(oriIRF);
            }
        }
    }
    return newIRF;
};
// Add && Edit && View Issue Resolution Form 
const EditIRF = ({ isOpen, isNew, isModify, oriEOR, oriIRF, onCancel, onOk }) => {
    const [voucherData, setVoucherData] = useState((undefined));
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);
    const { t } = useTranslation();

    useEffect(() => {
        async function initVoucher() {
            const newIRF = await getInitialValue(isNew, isModify, oriEOR, oriIRF);
            setVoucherData(newIRF);
        }
        if (isOpen) {
            initVoucher();
        }
    }, [isOpen, oriEOR, isModify, oriIRF, isNew]);
    // Get the passed data from the ScInput Component
    const handleGetValue = async (value, itemkey, positionID, rowIndex, errMsg) => {
        if (!isOpen || !isEdit || voucherData === undefined) {
            return
        }
        // Change Errors
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
        // CHange voucherData
        setVoucherData((prevState) => {
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;
        });
    };
    // Add or Edit Issue Resolution Form
    const handleAddIRF = async () => {
        const thisIRF = cloneDeep(voucherData);
        delete thisIRF.createDate
        delete thisIRF.modifyDate
        delete thisIRF.confirmDate

        if (isModify) {
            let editRes = await reqEditIRF(thisIRF);
            if (editRes.status) {
                message.success(t("modifySuccessful"));
                onOk();
            }
        } else {
            let addRes = await reqAddIRF(thisIRF);
            if (addRes.status) {
                message.success(t("addSuccessful"));
                onOk();
            }
        }
    };

    return (voucherData !== undefined
        ? <>
            <Stack component="div" id="editIRF" sx={{ overflowX: "hidden", overflowY: "hidden", p: 2 }}>
                <Stack component={"div"} id="voucherTitle" sx={{ display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: 2 }}>
                    <Typography variant="h3" component={"h3"}>{t("irf")}</Typography>
                </Stack>
                <DialogContent>
                    <Divider textAlign="right" sx={{ mt: 0, mb: 4 }}>{t("issueInformation")}</Divider>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
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
                        <Grid item xs={2}>
                            <ScInput
                                dataType={306}
                                allowNull={false}
                                isEdit={false}
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
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="executor"
                                itemKey="executor"
                                initValue={voucherData.executor}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="executor"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <ScInput
                                dataType={570}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="csa"
                                itemKey="csa"
                                initValue={voucherData.csa}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="csa"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ScInput
                                dataType={560}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="epa"
                                itemKey="epa"
                                initValue={voucherData.epa}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="epa"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="executionValueDisp"
                                itemKey="executionValueDisp"
                                placeholder={""}
                                initValue={voucherData.executionValueDisp}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="executionValueDisp"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="eoDescription"
                                itemKey="eoDescription"
                                placeholder={""}
                                initValue={voucherData.eoDescription}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="eoDescription"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={590}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="riskLevel"
                                itemKey="riskLevel"
                                placeholder={""}
                                initValue={voucherData.riskLevel}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="riskLevel"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={902}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="issueFiles"
                                itemKey="issueFiles"
                                initValue={voucherData.issueFiles}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="issueFiles"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="sourceType"
                                itemKey="sourceType"
                                initValue={voucherData.sourceType}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sourceType"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="sourceBillNumber"
                                itemKey="sourceBillNumber"
                                initValue={voucherData.sourceBillNumber}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sourceBillNumber"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="sourceRowNumber"
                                itemKey="sourceRowNumber"
                                initValue={voucherData.sourceRowNumber}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sourceRowNumber"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="issueOwner"
                                itemKey="issueOwner"
                                initValue={voucherData.issueOwner}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="issueOwner"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </Grid>
                    </Grid>
                    <Divider textAlign="right" sx={{ my: 4 }}>{t("issueResolutionInformation")}</Divider>
                    <Grid container spacing={2}>
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
                                itemShowName="handler"
                                itemKey="handler"
                                initValue={voucherData.handler}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="handler"
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
                        <Grid item xs={2}>
                            <ScInput
                                dataType={902}
                                allowNull={true}
                                isEdit={isEdit}
                                itemShowName="fixFiles"
                                itemKey="fixFiles"
                                initValue={voucherData.fixFiles}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="fixFiles"
                                positionID={0}
                                rowIndex={-1}
                                isOnSitePhoto={false}
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
                            />
                        </Grid>
                        <Grid item xs={12} >
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
                    <Divider textAlign="right" sx={{ my: 4 }}>{t("otherInformation")}</Divider>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="creator"
                                itemKey="creator"
                                initValue={voucherData.creator}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="creator"
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
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="createDate"
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
                        <Grid item xs={2}>
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="modifier"
                                itemKey="modifier"
                                initValue={voucherData.modifier}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="modifier"
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
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="modifyDate"
                            />
                        </Grid>

                    </Grid>
                </DialogContent>
                <Divider sx={{ my: 2 }} />
                <DialogActions sx={{ m: 1 }}>
                    {isEdit
                        ? <>
                            <Button color="error" onClick={onCancel} >{t("cancel")}</Button>
                            <Button variant="contained" disabled={checkVoucherNoBodyErrors(errors)} onClick={handleAddIRF}>{t(isModify ? "save" : "add")}</Button>
                        </>
                        : <Button variant="contained" onClick={onCancel} >{t("back")}</Button>
                    }
                </DialogActions>
            </Stack>
        </>
        : <Loader />
    );
};
export default EditIRF;
