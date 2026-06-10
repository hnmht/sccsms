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
import { CSCIcon, ClearIcon, ErrorIcon } from "../../PubIcon/PubIcon";
import CSCPicker from "./CscPicker";

const zeroValue = { id: 0, name: "", description: "", fatherid: 0, status: 0 };

// 525 Constriction Site Category
const ScCSCSelect = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue = zeroValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [currentDoc, setCurrentDoc] = useState(initValue);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const id = `525_${itemKey}_${positionID}_${rowIndex}`;
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
    // Actions after click cancel button in the dialog.
    const handleDiagCancel = () => {
        setDialogOpen(false);
    };
    // Actions after click ok button in the dialog.
    const handleDiagOk = () => {
        setDialogOpen(false);
        handleOnBlur();
    };
    // Transmit data to the parent components
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
    // Actions after click the clear button.
    const handleClear = () => {
        setCurrentDoc(zeroValue);
        handleOnBlur(zeroValue);
    }
    // Actions after click the CSC item.
    const handleDocClick = (item, type) => { //type:0 No subcategory 1 Subcategories exist
        setCurrentDoc(item);
        handleOnBlur(item);
    };
    // Actions after double click the CSC item
    const handleDocDoubleClick = (item, type) => {//type:0 No subcategory 1 Subcategories exist
        setCurrentDoc(item);
        handleOnBlur(item);
        setDialogOpen(false);
    }

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
                    disabled={true}
                    name={itemKey}
                    placeholder={isEdit ? t(placeholder) : null}
                    value={currentDoc.name}
                    onBlur={handleOnBlur}
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
                                    ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                    : null
                                }
                                <Tooltip title={t("chooseCategory")} placement="top">
                                    <span>
                                        <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                            <CSCIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
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
                    disabled={false}
                    name={id}
                    placeholder={isEdit ? t(placeholder) : null}
                    value={currentDoc.name}
                    onBlur={handleOnBlur}
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
                                ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                : null
                            }
                            <Tooltip title={t("chooseCategory")} placement="top">
                                <span>
                                    <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                        <CSCIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
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
                <CSCPicker
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

export default memo(ScCSCSelect);
