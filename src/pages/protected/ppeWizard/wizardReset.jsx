import { memo } from "react";
import {
    Box,
    Button,
    Typography
} from "@mui/material";

const WizardReset = ({ tips, voucherNumbers, activeStep, resetAction, backAction, t, height }) => {
    return (
        <>
            <Box sx={{ width: "90%", flex: 1, marginTop: 8, height: height }} >
                <Typography variant="h4">{t(tips)}</Typography>
                {voucherNumbers.length > 0
                    ? voucherNumbers.length > 1
                        ? <Typography variant="h4">{t("ppeWizardTip2", { numbers: voucherNumbers.length, billNumber: voucherNumbers.toString() })}</Typography>
                        : <Typography variant="h4">{t("ppeWizardTip3", { billNumber: voucherNumbers[0] })}</Typography>
                    : null
                }

            </Box>
            <Box sx={{ width: "100%", height: 48, paddingBottom: 2, paddingRight: 2, paddingLeft: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button variant="contained" onClick={resetAction}>
                        {t("generateMore")}
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default memo(WizardReset);