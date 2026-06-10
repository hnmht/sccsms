import { memo, useState, useEffect } from "react";
import {
    InputLabel,
    TextField,
    Stack,
    Tooltip,
    IconButton,
    InputBase,
    Dialog,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { FileIcon, ErrorIcon } from "../../PubIcon/PubIcon";
import FilePicker from "./FilePicker";

import { voucherFilesToFiles, filesToVoucherFiles } from "./constructor";

//902 Multi file upload
const ScFileUpload = (props) => {
    const { fileMaxSize = 20, chooseType = "image/*", positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc, isOnSitePhoto = false } = props;
    const [files, setFiles] = useState(voucherFilesToFiles(initValue));
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const id = `902_${itemKey}_${positionID}_${rowIndex}`;
    const {t} = useTranslation();

    useEffect(() => {
        handleTransfer();
        // eslint-disable-next-line
    }, [allowNull, isBackendTest]);

    useEffect(() => {
        setFiles(voucherFilesToFiles(initValue));
    }, [initValue]);

    // Close dialog
    const handleDiagClose = () => {
        setDialogOpen(false);
    };
    const handleSelectedOk = (items) => {
        setDialogOpen(false);
        handleTransfer(items);
    };
    // Actions after click icon button
    const handleIconClick = () => {
        setDialogOpen(true);
    };

    // Transfer files to parent component
    const handleTransfer = async (items = files) => {
        if (!isEdit) {
            return
        }
        let voucherFiles = filesToVoucherFiles(initValue, items);
        let err = { isErr: false, msg: "" };
        if (items.length === 0 && !allowNull) {
            err = { isErr: true, msg: "cannotEmpty" };
        } else if (isBackendTest) {
            err = await backendTestFunc(voucherFiles);
        }
        setFiles(items);
        setErrInfo(err);
        pickDone(voucherFiles, itemKey, positionID, rowIndex, err);
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
                    type="number"
                    id={id}
                    disabled
                    name={id}
                    placeholder={t(placeholder)}
                    value={files.length}
                    error={errInfo.isErr}
                    InputProps={{
                        endAdornment:
                            <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                                {errInfo.isErr
                                    ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                    : null
                                }
                                <Tooltip title={t("files")} placement="top">
                                    <IconButton onClick={handleIconClick} size="small">
                                        <FileIcon color="success" fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Stack>,
                    }}
                />
                : <InputBase
                    fullWidth
                    type="text"
                    id={id}
                    disabled
                    name={id}
                    placeholder={t(placeholder)}
                    value={files.length}
                    error={errInfo.isErr}
                    endAdornment={
                        <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                            {errInfo.isErr
                                ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                : null
                            }
                            <Tooltip title={t("files")} placement="top">
                                <IconButton onClick={handleIconClick} size="small">
                                    <FileIcon color="success" fontSize="small" />
                                </IconButton>
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
                <FilePicker
                    fileMaxSize={fileMaxSize}
                    chooseType={chooseType}
                    initFiles={files}
                    isEdit={isEdit}
                    isOnSitePhoto={isOnSitePhoto}
                    onCancel={handleDiagClose}
                    onOk={handleSelectedOk}
                />
            </Dialog>
        </>
    );
};
export default memo(ScFileUpload);

