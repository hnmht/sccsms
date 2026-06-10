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
import { PersonIcon, ClearIcon, ErrorIcon } from "../../PubIcon/PubIcon";
import PersonPicker from "./PersonPicker";
import { useTranslation } from "react-i18next";

const zeroValue = { id: 0, code: "", name: "", avater: { filekey: 0, fileUrl: "" }, deptID: 0, deptCode: "", description: "" };
//510 Person Archive selection input component
const ScPersonSelect = ({
    positionID = -1,
    rowIndex = -1,
    allowNull = false,
    isEdit = true,
    itemShowName = "",
    itemKey,
    initValue = zeroValue,
    pickDone,
    placeholder,
    isBackendTest = false,
    backendTestFunc,
}) => {
    const {t} = useTranslation();
    const [person, setPerson] = useState(initValue);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const id = `510_${itemKey}_${positionID}_${rowIndex}`;

    useEffect(() => {
        setPerson(initValue);
    }, [initValue]);

    useEffect(() => {
        handleTransfer();
        // eslint-disable-next-line
    }, [allowNull, isBackendTest]);

    // Close the dialog window
    const handleDiagClose = () => {
        setDialogOpen(false);
        handleTransfer();
    };

    // Actions after clicking a person
    const handlePersonClick = (item) => {
        setPerson(item);
    };
    // Actions after double-clicking a person
    const handlePersonDoubleClick = (item) => {
        setPerson(item);
        handleOkClick();
    };

    // Check the value and pass it to the parent component
    const handleTransfer = async (doc = person) => {
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
    // Acitons after clicking the clear button
    const handleClear = () => {
        setPerson(zeroValue);
        handleTransfer(zeroValue);
    };
    // Actions after clicking the ok button
    const handleOkClick = () => {        
        handleTransfer();
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
                    value={person.name}
                    error={errInfo.isErr}
                    InputProps={{
                        endAdornment:
                            <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                                {errInfo.isErr
                                    ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                    : null
                                }
                                {person.id !== 0 && isEdit && allowNull
                                    ? <Tooltip title={t("clear")} placement="top">
                                        <span>
                                            <IconButton onClick={handleClear} size="small">
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                    : null
                                }
                                <Tooltip title={t("choose")} placement="top" >
                                    <span>
                                        <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small" id="testId1">
                                            <PersonIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
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
                    value={person.name}
                    error={errInfo.isErr}
                    endAdornment={
                        <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }} >
                            {errInfo.isErr
                                ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                : null
                            }
                            {person.id !== 0 && isEdit && allowNull
                                ? <Tooltip title={t("clear")} placement="top">
                                    <span>
                                        <IconButton onClick={handleClear} size="small">
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                                : null
                            }
                            <Tooltip title={t("choose")} placement="top" >
                                <span>
                                    <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small" id="testId2">
                                        <PersonIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
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
                <PersonPicker
                    clickItemAction={handlePersonClick}
                    doubleClickItemAction={handlePersonDoubleClick}
                    cancelClickAction={handleDiagClose}
                    okClickAction={handleOkClick}
                    currentItem={person}
                />
            </Dialog>
        </>
    );
};

export default memo(ScPersonSelect);
