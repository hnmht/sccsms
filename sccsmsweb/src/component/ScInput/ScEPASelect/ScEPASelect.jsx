import { useState, memo, useEffect } from "react";
import {
    IconButton,
    Stack,
    TextField,
    InputLabel,
    Dialog,
    Tooltip,
    InputBase,
} from "@mui/material";
import { EPAIcon, ClearIcon, ErrorIcon } from "../../PubIcon/PubIcon";
import EPAPicker from "./EPAPicker";
import { useTranslation } from "react-i18next";
const zeroValue = {
    id: 0,
    code: "",
    name: "",
    epc: { id: 0, name: "", description: "", fatherID: 0, status: 0 },
    description: "",
    status: 0,
    resultType: { id: 301, name: "text", dataType: "string", inputMode: "input" },
    udc: { id: 0, name: "", description: "" },
    defaultValue: "",
    isCheckError: 0,
    errorValue: "",
    isRequireFile: 0,
    isOnSitePhoto: 0,
};
//560 The EPA Single-Select Component
const ScEPASelect = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue = zeroValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [selectItem, setSelectItem] = useState(initValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const [dialogOpen, setDialogOpen] = useState(false);
    const id = `560_${itemKey}_${positionID}_${rowIndex}`;
    const { t } = useTranslation();

    useEffect(() => {
        setSelectItem(initValue);
    }, [initValue]);

    useEffect(() => {
        handleTransfer();
        // eslint-disable-next-line
    }, [allowNull, isBackendTest]);
    // Send data to the parent component 
    const handleTransfer = async (item = selectItem) => {
        if (!isEdit) {
            return
        }
        let err = { isErr: false, msg: "" };
        if (item.id === 0 && !allowNull) {
            err = { isErr: true, msg: "cannotEmpty" };
        } else if (isBackendTest) {
            err = await backendTestFunc(item);
        }
        setErrInfo(err);
        setSelectItem(item);

        pickDone(item, itemKey, positionID, rowIndex, err);
    };
    // Close Dialog
    const handleDiagClose = () => {
        setDialogOpen(false);
        handleTransfer();
    };
    // Actions after click the ok button in dialog
    const handleOkClick = () => {
        // Send data to the parent component
        handleTransfer();
        // Close dialog
        setDialogOpen(false);
    }
    // Actions after click the clear button 
    const handleClear = () => {
        setSelectItem(zeroValue);
        handleTransfer(zeroValue);
    }
    // Actions after click item
    const handleClickItem = (item) => {
        setSelectItem(item);
    };
    // Actions after double click item
    const handleDoubleClickItem = (item) => {
        setSelectItem(item);
        handleTransfer(item);
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
                    value={selectItem.name}
                    error={errInfo.isErr}
                    InputProps={{
                        endAdornment:
                            <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                                {errInfo.isErr
                                    ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                    : null
                                }
                                {selectItem.id !== 0 && isEdit && allowNull
                                    ? <Tooltip title={t("clear")} placement="top">
                                        <span>
                                            <IconButton onClick={handleClear} size="small">
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                    : null
                                }
                                <Tooltip title={t("choose")} placement="top">
                                    <span>
                                        <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                            <EPAIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
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
                    name={id}
                    placeholder={isEdit ? t(placeholder) : ""}
                    value={selectItem.name}
                    error={errInfo.isErr}
                    endAdornment={
                        <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                            {selectItem.id !== 0 && isEdit && allowNull
                                ? <Tooltip title={t("clear")} placement="top">
                                    <span>
                                        <IconButton onClick={handleClear} size="small">
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                                : null
                            }
                            {errInfo.isErr
                                ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                : null
                            }
                            <Tooltip title={t("choose")} placement="top">
                                <span>
                                    <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                        <EPAIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Stack>}
                />
            }
            <Dialog
                open={dialogOpen}
                fullWidth={true}
                maxWidth={"lg"}
                onClose={handleDiagClose}
                closeAfterTransition={false}
            >
                <EPAPicker
                    clickItemAction={handleClickItem}
                    doubleClickItemAction={handleDoubleClickItem}
                    cancelClickAction={handleDiagClose}
                    okClickAction={handleOkClick}
                    currentItem={selectItem}
                />
            </Dialog>
        </>
    );
};
export default memo(ScEPASelect);

