import { memo, useState, useEffect } from "react";
import {
    TextField,
    InputBase,
    Tooltip,
    InputLabel,
    Stack,
    IconButton,
    Dialog,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { OperatingPostIcon, ClearIcon, ErrorIcon } from "../../PubIcon/PubIcon";
import PositionPicker from "./PositionPicker";

const zeroValue = { id: 0, name: "", description: "", status: 0 };

//610 Seacloud Position Select Input Component
const ScPositionSelect = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue = zeroValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [selectItem, setSelectItem] = useState(initValue ? initValue : { id: 0, name: "" });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const id = `610_${itemKey}_${positionID}_${rowIndex}`;
    const { t } = useTranslation();

    useEffect(() => {
        setSelectItem(initValue);
    }, [initValue]);

    useEffect(() => {
        handleTransfer();
        // eslint-disable-next-line
    }, [allowNull, isBackendTest]);

    // Transmit data to parnent component
    const handleTransfer = async (item = selectItem) => {
        let err = { isErr: false, msg: "" };
        if (item.id === 0 && !allowNull) {
            err = { isErr: true, msg: "cannotEmpty" };
        } else if (isBackendTest) {
            err = await backendTestFunc(item);
        }
        setErrInfo(err);
        if (!isEdit) {
            return
        }
        pickDone(item, itemKey, positionID, rowIndex, err);
    };
    // Actions after click item.
    const handleClickItem = (item) => {
        setSelectItem(item);
    };
    // Actions after double click item
    const handleDoubleClickItem = (item) => {
        setSelectItem(item);
        handleTransfer(item);
        setDialogOpen(false);
    };
    // Actions after click the clear button
    const handleClear = () => {
        setSelectItem(zeroValue);
        handleTransfer(zeroValue);
    };

    // Close dialog
    const handleDiagClose = () => {
        setDialogOpen(false);
        handleTransfer();
    };
    // Actions after click the ok button 
    const handleOkClick = () => {
        // Transmit data to parnent component
        handleTransfer();
        // Close dialog
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
                    placeholder={t(placeholder)}
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
                                <Tooltip title={t("choosePosition")} placement="top" >
                                    <span>
                                        <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                            <OperatingPostIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
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
                    placeholder={placeholder}
                    value={selectItem.name}
                    error={errInfo.isErr}
                    endAdornment={
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
                            <Tooltip title={t("choosePosition")} placement="top" >
                                <span>
                                    <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                        <OperatingPostIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
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
                <PositionPicker
                    id={id}
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

export default memo(ScPositionSelect);
