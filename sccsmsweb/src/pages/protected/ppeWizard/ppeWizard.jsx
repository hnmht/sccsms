import { useState, useEffect, useCallback } from "react";
import {
    Box,
    Paper as MuiPaper,
    Stepper,
    Step,
    StepLabel,
} from "@mui/material";
import { spacing } from "@mui/system";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import PageTitle from "../../../component/PageTitle/PageTitle";
import { Divider } from "../../../component/ScMui/ScMui";

import store from "../../../store";
import useContentHeight from "../../../hooks/useContentHeight";
import { dayjs } from "../../../i18n/dayjs";
import { MultiSortByArr } from "../../../utils/tools";

import { steps } from "./constructor";
import WizardParamsEdit from "./wizardParamsEdit";
import WizardPositionsEdit from "./wizardPositionsEdit";
import WizardRecipientsEdit from "./wizardRecipientsEdit";
import WizardGenerate from "./wizardGenerate";
import WizardReset from "./wizardReset";
import { reqGetPeriodPositions } from "../../../api/ppeQuota";
import { reqWizardAddPPEIF } from "../../../api/ppeIssuanceForm";
import { cloneDeep } from "lodash";

const Paper = styled(MuiPaper)(spacing);
// Generate Wizard Options
const generateWizardOptions = () => {
    const { user } = store.getState();
    const { person, department } = user;
    const currentTime = dayjs(new Date());
    let params = {
        billDate: currentTime.startOf("day"),
        department: department,
        description: "",
        period: "month",
        startDate: currentTime.startOf("month"),
        endDate: currentTime.endOf("month"),
        creator: person,
        generationType: 0,
    }
    return params;
};

// Wizard from Issuing PPE
const PPEWizard = () => {
    const height = useContentHeight();
    const [activeStep, setActiveStep] = useState(0);
    const [params, setParams] = useState(undefined);
    const [positions, setPositions] = useState([]);
    const [selectedOps, setSelectedOps] = useState([]);
    const [recipients, setRecipients] = useState([]);
    const [voucherNumbers, setVoucherNumbers] = useState([]);
    const [tips, setTips] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const initParams = () => {
            setParams(generateWizardOptions());
        };
        initParams();
    }, []);

    // Actions after click the nextStep button in the "Define Parameters" step
    const handleParamsNext = useCallback(async (value) => {
        // Request Positions from backend by period
        const positionsRes = await reqGetPeriodPositions({ period: value.period });
        let newPositions = [];
        if (positionsRes.status) {
            newPositions = positionsRes.data.positions;
        }
        setPositions(newPositions);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setParams(value);
    }, []);

    // Actions after click the nextStep button in the "Select Positions" step
    const handlerPositonsNext = useCallback((value) => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSelectedOps(value);
    }, []);

    // Actions after click the nextStep button in the "Select Recipients" step
    const handleRecipientsNext = useCallback((value) => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setRecipients(value);
    }, []);
    // Actions after click the nextStep button in the "Generate Voucher" step
    const handleGenerate = async (value) => {
        let newRs = cloneDeep(recipients);
        newRs.sort(MultiSortByArr([{ field: "deptID", order: "asc" }, { field: "positionID", order: "asc" }]));
        const wizardRes = await reqWizardAddPPEIF({
            params: params,
            recipients: newRs
        });
        let vNumbers = [];
        let resTips = "";

        if (wizardRes.status) {
            resTips = "generatePPEIFSuccessful";
            vNumbers = wizardRes.data.vouchernumbers;
        } else {
            resTips = "generatePPEIFFailed";
        }
        setTips(resTips);
        setVoucherNumbers(vNumbers);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);

    };

    // Actions after click the previousStep button
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    // Actions after click the GenerateMore button
    const handleReset = () => {
        setParams(generateWizardOptions);
        setPositions([]);
        setSelectedOps([]);
        setRecipients([]);
        setActiveStep(0);
    };

    // Display content in Step
    const StepContent = ({ step }) => {
        switch (step) {
            case 0:
                return <WizardParamsEdit
                    initParams={params}
                    nextAction={handleParamsNext}
                    t={t}
                />
            case 1:
                return <WizardPositionsEdit
                    allOps={positions}
                    initOps={selectedOps}
                    nextAction={handlerPositonsNext}
                    backAction={handleBack}
                    t={t}
                    height={height - 48}
                />;
            case 2:
                return <WizardRecipientsEdit
                    initRecipients={recipients}
                    positions={selectedOps}
                    activeStep={step}
                    nextAction={handleRecipientsNext}
                    backAction={handleBack}
                    t={t}
                    height={height - 48}
                />;
            case 3:
                return <WizardGenerate
                    params={params}
                    recipients={recipients}
                    activeStep={step}
                    nextAction={handleGenerate}
                    backAction={handleBack}
                    t={t}
                    height={height - 48}
                />;
            case 4:
                return <WizardReset
                    activeStep={step}
                    tips={tips}
                    voucherNumbers={voucherNumbers}
                    resetAction={handleReset}
                    backAction={handleBack}
                    t={t}
                    height={height - 48}
                />;
            default:
                return null;
        }
    };

    return (
        <>
            <PageTitle pageName={t("MenuPPEWizard")} displayHelp={false} helpUrl="#" />
            <Divider my={2} />
            <Paper sx={{ width: '100%', minHeight: height, overflow: 'auto', display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Box sx={{ width: "90%", height: 32, mt: 4 }}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>{t(label)}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", height: height - 48, width: "100%" }}>
                    <StepContent step={activeStep} />
                </Box>
            </Paper>
        </>
    );
};

export default PPEWizard;