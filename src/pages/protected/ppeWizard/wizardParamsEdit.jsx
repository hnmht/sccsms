import { useState, useEffect, memo, useCallback } from "react";
import {
    Grid,
    Box,
    Button,
    Typography
} from "@mui/material";
import { cloneDeep } from "lodash";
import { PeriodStartandEnd } from "../../../storage/dataTypes";
import ScInput from "../../../component/ScInput";
import GenerationType from "./generationType";
import { checkVoucherNoBodyErrors } from "../pub/pubFunction";

// Edit Wizard Parameters
const WizardParamsEdit = ({ initParams, nextAction, t }) => {
    const [dataParams, setDataParams] = useState(undefined);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setDataParams(initParams);
    }, [initParams]);

    // Get the Passed data from the ScInput components
    const handleGetValue = useCallback((value, itemkey, positionID, rowIndex, errMsg) => {
        // Change dataParams
        setDataParams((prevState) => {
            const newData = cloneDeep(prevState);
            switch (positionID) {
                case 0:
                    // If the "period" field is modified, then Change "startDate" and "endDate" fields
                    if (itemkey === "period" && value !== prevState.period) {
                        const p = PeriodStartandEnd(value);
                        newData.startDate = p.startDate;
                        newData.endDate = p.endDate;
                    };
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
        // Change errors
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
    }, []);

    return (dataParams !== undefined
        ? <>
            <Box padding={8} flex={1}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <ScInput
                            dataType={306}
                            allowNull={false}
                            isEdit={true}
                            itemShowName="billDate"
                            itemKey="billDate"
                            initValue={dataParams.billDate}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="billDate"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <ScInput
                            dataType={520}
                            allowNull={false}
                            isEdit={true}
                            itemShowName="department"
                            itemKey="department"
                            initValue={dataParams.department}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="department"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={407}
                            allowNull={false}
                            isEdit={true}
                            itemShowName="period"
                            itemKey="period"
                            initValue={dataParams.period}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="period"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={306}
                            allowNull={false}
                            isEdit={true}
                            itemShowName="startDate"
                            itemKey="startDate"
                            initValue={dataParams.startDate}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="startDate"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={306}
                            allowNull={false}
                            isEdit={true}
                            itemShowName="endDate"
                            itemKey="endDate"
                            initValue={dataParams.endDate}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="endDate"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={true}
                            itemShowName="description"
                            itemKey="description"
                            placeholder={"descriptionPlaceholder"}
                            initValue={dataParams.description}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="description"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <GenerationType
                            allowNull={true}
                            isEdit={true}
                            itemShowName="generationType"
                            itemKey="generationType"
                            placeholder={"chooseType"}
                            initValue={dataParams.generationType}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="generationType"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h5">{t("description")}:</Typography>
                        <Typography variant="h6" color={"warning"} pt={2}>
                            {t("ppeWizardDescription1")}
                        </Typography>
                        <Typography variant="h6" pt={2}>
                            {t("ppeWizardDescription2")}
                        </Typography>
                        <Typography variant="h6" color={"warning"} pt={2}>
                            {t("ppeWizardDescription3")}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ width: "100%", paddingBottom: 2, paddingRight: 2, paddingLeft: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button variant="contained" onClick={() => nextAction(dataParams)} disabled={checkVoucherNoBodyErrors(errors)}>
                        {t("nextStep")}
                    </Button>
                </Box>
            </Box>
        </>
        : null
    )
};

export default memo(WizardParamsEdit);