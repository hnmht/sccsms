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
import { SceneIcon, ClearIcon, ErrorIcon } from "../../PubIcon/PubIcon";
import CSAPicker from "./CSAPicker";
import { GetLocalCache } from "../../../storage/db/db";
import { columns, GetDynamicColumns } from "./tableConstructor";

const zeroValue = { id: 0, code: "", name: "", csc: {}, status: 0, respDept: {}, respPerson: {} };
//570 Seacloud Construction Site Archive Select Input Component
const ScCSASelect = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue = zeroValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [csa, setCsa] = useState(initValue);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const [dynamicColumns, setDynamicColumns] = useState(columns);
    const id = `570_${itemKey}_${positionID}_${rowIndex}`;
    const { t } = useTranslation();

    useEffect(() => {
        async function getDycols() {
            const options = await GetLocalCache("cso");
            let newDyCols = GetDynamicColumns(columns, options);
            setDynamicColumns(newDyCols);
        }
        getDycols();
    }, []);

    useEffect(() => {
        setCsa(initValue);
    }, [initValue]);

    useEffect(() => {
        handleTransfer();
        // eslint-disable-next-line
    }, [allowNull, isBackendTest]);

    // Close Dialog
    const handleDiagClose = () => {
        setDialogOpen(false);
        handleTransfer();
    };

    // Actions after click CSA item 
    const handleCSAClick = (item) => {
        setCsa(item);
    };
    // Actions after Double Click CSA item
    const handleCSADoubleClick = (item) => {
        setCsa(item);
        handleOkClick();
    };

    // Transmit data to the parent component
    const handleTransfer = async (doc = csa) => {
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
    // Actions after click the clear button
    const handleClear = () => {
        setCsa(zeroValue);
        handleTransfer(zeroValue);
    };
    // Actions after click the ok button
    const handleOkClick = () => {
        // Transmit data 
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
                    placeholder={isEdit ? t(placeholder) : ""}
                    value={csa.name}
                    error={errInfo.isErr}
                    InputProps={{
                        endAdornment:
                            <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                                {errInfo.isErr
                                    ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                    : null
                                }
                                {csa.id !== 0 && isEdit && allowNull
                                    ? <Tooltip title={t("clear")} placement="top">
                                        <span>
                                            <IconButton onClick={handleClear} size="small">
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                    : null
                                }
                                <Tooltip title={t("chooseCSA")} placement="top" >
                                    <span>
                                        <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                            <SceneIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
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
                    value={csa.name}
                    error={errInfo.isErr}
                    endAdornment={
                        <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                            {errInfo.isErr
                                ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                : null
                            }
                            {csa.id !== 0 && isEdit && allowNull
                                ? <Tooltip title={t("clear")} placement="top">
                                    <span>
                                        <IconButton onClick={handleClear} size="small">
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                                : null
                            }
                            <Tooltip title={t("chooseCSA")} placement="top" >
                                <span>
                                    <IconButton onClick={() => setDialogOpen(!dialogOpen)} disabled={!isEdit} size="small">
                                        <SceneIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
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
                <CSAPicker
                    clickItemAction={handleCSAClick}
                    doubleClickItemAction={handleCSADoubleClick}
                    cancelClickAction={handleDiagClose}
                    okClickAction={handleOkClick}
                    currentItem={csa}
                    columns={dynamicColumns}
                />
            </Dialog>
        </>
    );
};

export default memo(ScCSASelect);

