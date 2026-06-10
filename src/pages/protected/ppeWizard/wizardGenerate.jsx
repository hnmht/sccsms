import { memo } from "react";
import {
    Box,
    Button,
    Typography
} from "@mui/material";
import { steps } from "./constructor";

const WizardGenerate = ({ params, recipients, activeStep, resetAction, backAction, nextAction, t, height }) => {
    const personNumbers = recipients.length;
    const voucherNumber = params.generationType === 0 ? 1 : recipients.length;
    return (
        <>
            <Box sx={{ width: "90%", flex: 1, marginTop: 8, height: height }} >
                <Typography variant="h4">{t("wizardCompleted")} </Typography>
                <Typography variant="h4" pt={4}>{t("ppeWizardTip1", { personNumbers: personNumbers, voucherNumber: voucherNumber })}</Typography>
            </Box>
            <Box sx={{ width: "100%", height: 48, paddingBottom: 2, paddingRight: 2, paddingLeft: 2 }}>
                {activeStep === steps.length
                    ? (<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button variant="contained" onClick={resetAction}>{t("generateMore")}</Button>
                    </Box>)
                    : (<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            variant="contained"
                            disabled={activeStep === 0}
                            onClick={backAction}
                            sx={{ mr: 1 }}
                        >
                            {t("previousStep")}
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button variant="contained" onClick={nextAction}>
                            {t("generate")}
                        </Button>
                    </Box>)
                }
            </Box>
        </>
    );
};

export default memo(WizardGenerate);