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
import { useTranslation } from "react-i18next";
import { DocumentClassIcon, ClearIcon, ErrorIcon } from "../../PubIcon/PubIcon";
import DCPicker from "./DcPIcker";

const zeroValue = { id: 0, name: "", description: "", fatherid: 0, status: 0 };
// 600 Document Category Select Single Component
const ScDCSelect = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue = zeroValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [currentDoc, setCurrentDoc] = useState(initValue);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const id = `600_${itemKey}_${positionID}_${rowIndex}`;
    const { t } = useTranslation();

    useEffect(() => {
        setCurrentDoc(initValue);
    }, [initValue])

    useEffect(() => {
        handleOnBlur();
        // eslint-disable-next-line
    }, [allowNull, isBackendTest]);

    // Close Dialog
    const handleDiagClose = () => {
        setDialogOpen(false);
        handleOnBlur();
    };
    // Action on dialog cancel button click
    const handleDiagCancel = () => {
        setDialogOpen(false);
    };
    // Action on dialog ok button click
    const handleDiagOk = () => {
        setDialogOpen(false);
        handleOnBlur();
    };
    // Check and pick value
    const handleOnBlur = async (doc = currentDoc) => {
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
    // Clear current selected value
    const handleClear = () => {
        setCurrentDoc(zeroValue);
        handleOnBlur(zeroValue);
    }
    // Actions after click the item in the dialog.
    const handleDocClick = (item, type) => {
        setCurrentDoc(item);
        handleOnBlur(item);
    };
    // Actions after double click the item in the dialog.
    const handleDocDoubleClick = (item, type) => {
        setCurrentDoc(item);
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
                    name={itemKey}
                    placeholder={t(isEdit ? placeholder : "")}
                    value={currentDoc.name}
                    onBlur={() => handleOnBlur()}
                    error={errInfo.isErr}
                    InputProps={{
                        endAdornment:
                            <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                                {currentDoc.id !== 0 && isEdit && allowNull
                                    ? <Tooltip title={t("clear")} placement="top">
                                        <span>
                                            <IconButton onClick={handleClear} size="small"><ClearIcon /></IconButton>
                                        </span>
                                    </Tooltip>
                                    : null
                                }
                                {errInfo.isErr
                                    ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                    : null
                                }
                                <Tooltip title={t("chooseCategory")} placement="top">
                                    <span>
                                        <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                            <DocumentClassIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            </Stack>,
                    }}
                />
                : <InputBase
                    fullWidth
                    type="text"
                    id={id}
                    disabled={!isEdit}
                    name={itemKey}
                    placeholder={t(isEdit ? placeholder : "")}
                    value={currentDoc.name}
                    onBlur={() => handleOnBlur()}
                    error={errInfo.isErr}
                    endAdornment={
                        <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                            {currentDoc.id !== 0 && isEdit && allowNull
                                ? <Tooltip title={t("clear")} placement="top">
                                    <span>
                                        <IconButton onClick={handleClear} size="small"><ClearIcon /></IconButton>
                                    </span>
                                </Tooltip>
                                : null
                            }
                            {errInfo.isErr
                                ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                : null
                            }
                            <Tooltip title={t("chooseCategory")} placement="top">
                                <span>
                                    <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                        <DocumentClassIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
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
                <DCPicker
                    clickItemAction={handleDocClick}
                    doubleClickItemAction={handleDocDoubleClick}
                    cancelClickAction={handleDiagCancel}
                    okClickAction={handleDiagOk}
                    currentItem={currentDoc}
                />
            </Dialog>
        </>
    );
};

export default memo(ScDCSelect);
