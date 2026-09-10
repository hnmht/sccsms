import { useState } from "react";
import { Button } from "@mui/material";
import { LoadingButton } from "@mui/lab"

function ScEditButton({ isEdit, isModify, disabled, onClick, onCancel, t }) {
    const [loading, setLoading] = useState(false);
    const internalLoading = loading || disabled;
    const internalOnClick = async () => {
        if (internalLoading) return;
        setLoading(true);
        try {
            await onClick();
        } finally {
            setLoading(false);
        }
    };
    return isEdit
        ? <>
            <Button color="error" onClick={onCancel} disabled={loading} >{t("cancel")}</Button>
            <LoadingButton variant="contained"  loading={internalLoading} onClick={internalOnClick}>{t(isModify ? "save" : "add")}</LoadingButton>
        </>
        : <Button variant="contained" onClick={onCancel} >{t("back")}</Button>
}

export default ScEditButton;