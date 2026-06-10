import { useState, memo, useEffect } from "react";
import {
    IconButton,
    Stack,
    TextField,
    InputBase,
    InputLabel,
    Dialog,
    Tooltip,
} from "@mui/material";
import { DeptIcon, ClearIcon, ErrorIcon } from "../../PubIcon/PubIcon";
import DeptPicker from "./DeptPicker";
import { useTranslation } from "react-i18next";
const zeroValue = { id: 0, code: "", name: "", fatherid: 0, leader: { id: 0, code: "", name: "" }, description: "", status: 0 };
// 520 Department select component
const ScDeptSelect = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue = zeroValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [currentDept, setCurrentDept] = useState(initValue);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const id = `520_${itemKey}_${positionID}_${rowIndex}`;
    const { t } = useTranslation();

    useEffect(() => {
        setCurrentDept(initValue);
    }, [initValue]);


    useEffect(() => {
        handleOnBlur();
        // eslint-disable-next-line
    }, [allowNull, isBackendTest]);

    // Clost dialog
    const handleDiagClose = () => {
        setDialogOpen(false);
        handleOnBlur();
    };
    // Actions after click the cancel button in dialog.
    const handleDiagCancel = () => {
        setDialogOpen(false);
    };
    // Actions after click the ok button in dialog.
    const handleDiagOk = () => {
        setDialogOpen(false);
        handleOnBlur();
    };
    // Transmit data to the parent component.
    const handleOnBlur = async (doc = currentDept) => {
        if (!isEdit) {
            return
        }
        let err = { isErr: false, msg: "" };
        if (doc.id === 0 && !allowNull) {
            err = { isErr: true, msg: "cannotEmpty" };
        } else if (isBackendTest) {
            err = await backendTestFunc(doc);
        }
        setErrInfo(err);
        pickDone(doc, itemKey, positionID, rowIndex, err);
    };
    // Actions after click the clear button.
    const handleClear = () => {
        setCurrentDept(zeroValue);
        handleOnBlur(zeroValue);
    }
    // Actions after click item.
    const handleDeptClick = (item, type) => { //type:0 No subordinate department 1 subordinate departments
        setCurrentDept(item);
        handleOnBlur(item);
    };
    // Actions after double click item.
    const handleDeptDoubleClick = (item, type) => {//type:0 No subordinate department 1 subordinate departments
        setCurrentDept(item);
        handleOnBlur(item);
        setDialogOpen(false);
    };
    return (
        <>
            {positionID !== 1
                ? <InputLabel htmlFor={id} sx={{ color: allowNull ? "primary" : "blue" }}>{t(itemShowName)}</InputLabel>
                : null
            }
            {positionID !== 1
                ? <TextField
                    fullWidth
                    type="text"
                    id={id}
                    disabled={!isEdit}
                    name={id}
                    placeholder={isEdit ? t(placeholder) : ""}
                    value={currentDept.name}
                    error={errInfo.isErr}
                    InputProps={{
                        endAdornment:
                            <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                                {errInfo.isErr
                                    ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                    : null
                                }
                                {currentDept.id !== 0 && isEdit && allowNull
                                    ? <Tooltip title={t("clear")} placement="top">
                                        <span>
                                            <IconButton onClick={handleClear} size="small"><ClearIcon fontSize="small" /></IconButton>
                                        </span>
                                    </Tooltip>
                                    : null
                                }
                                <Tooltip title={t("choose")} placement="top" >
                                    <span>
                                        <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                            <DeptIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            </Stack>
                    }}
                />
                : <InputBase
                    fullWidth
                    type="text"
                    id={id}
                    disabled={!isEdit}
                    name={id}
                    placeholder={isEdit ? t(placeholder) : ""}
                    value={currentDept.name}
                    error={errInfo.isErr}
                    endAdornment={
                        <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                            {currentDept.id !== 0 && isEdit && allowNull
                                ? <Tooltip title={t("clear")} placement="top">
                                    <span>
                                        <IconButton onClick={handleClear} size="small"><ClearIcon fontSize="small" /></IconButton>
                                    </span>
                                </Tooltip>
                                : null
                            }
                            {errInfo.isErr
                                ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                : null
                            }
                            <Tooltip title={t("choose")} placement="top" >
                                <span>
                                    <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                        <DeptIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Stack>}

                />
            }
            <Dialog
                open={dialogOpen}
                sx={{ minHeight: 600, minWidth: 480 }}
                onClose={handleDiagClose}
                closeAfterTransition={false}
            >
                <DeptPicker
                    clickItemAction={handleDeptClick}
                    doubleClickItemAction={handleDeptDoubleClick}
                    cancelClickAction={handleDiagCancel}
                    okClickAction={handleDiagOk}
                    currentItem={currentDept}
                />
            </Dialog>
        </>
    );
};
export default memo(ScDeptSelect);

