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
import { UDDIcon, ClearIcon, ErrorIcon } from "../../PubIcon/PubIcon";
import UdaPicker from "./UdaPicker";

const zeroValue = { id: 0, code: "", name: "", description: "", docclass: { id: 0, name: "" }, fatherid: 0 };
const udcZeroValue = { id: 0, name: "", description: "" }

//550 User-defined Archive selection input component
const ScUDDSelect = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue = zeroValue, pickDone, placeholder, isBackendTest, backendTestFunc, udc = udcZeroValue } = props;
    const [selectItem, setSelectItem] = useState(initValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const [dialogOpen, setDialogOpen] = useState(false);
    const id = `550_${itemKey}_${positionID}_${rowIndex}`;
    const { t } = useTranslation();

    useEffect(() => {
        setSelectItem(initValue);
    }, [initValue]);

    useEffect(() => {
        handleTransfer();
        // eslint-disable-next-line
    }, [allowNull, isBackendTest]);


    // Check the value and pass it to parent
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
    // Close the dialog
    const handleDiagClose = () => {
        setDialogOpen(false);
        handleTransfer();
    };
    // Actions after click the ok button in the dialog
    const handleOkClick = () => {
        // Pass data to the parent component
        handleTransfer();
        // Close dialog
        setDialogOpen(false);
    }
    // Actions after click the clear button 
    const handleClear = () => {
        setSelectItem(zeroValue);
        handleTransfer(zeroValue);
    }
    // Acitions after click item
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
                ? <InputLabel
                    htmlFor={id}
                    sx={{ color: allowNull ? "primary" : "blue" }}
                >
                    {t(itemShowName)}
                </InputLabel>
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
                                <Tooltip title={t("chooseUDA",{udcName:udc.name})} placement="top" >
                                    <span>
                                        <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                            <UDDIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
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
                    endAdornment={<Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
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
                        <Tooltip title={t("chooseUDA")} placement="top" >
                            <span>
                                <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                    <UDDIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
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
                <UdaPicker
                    udc={udc}
                    clickItemAction={handleClickItem}
                    doubleClickItemAction={handleDoubleClickItem}
                    cancelClickAction={handleDiagClose}
                    okClickAction={handleOkClick}
                    currentItem={selectItem} />
            </Dialog>
        </>
    );
};

export default memo(ScUDDSelect);

