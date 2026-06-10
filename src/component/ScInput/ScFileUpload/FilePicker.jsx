import { useState } from "react";
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Grid,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Tooltip,
    IconButton,
    Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { UploadIcon, DeleteIcon, FileIcon, DownloadIcon } from "../../PubIcon/PubIcon";
import imageCompression from "browser-image-compression";
import { message } from "mui-message";
import ModalImage from "react-modal-image";
import { DateTimeFormat } from "../../../i18n/dayjs";
import { Divider } from "../../ScMui/ScMui";
import { getFileInfo } from "../../../utils/hash";
import { RemoveDupObjectArr } from "../../../utils/tools";
import { reqUploadFiles, reqGetFilesByHash } from "../../../api/file";
import Loader from "../../Loader/Loader";
import { cloneDeep } from "lodash";

const compressOption = {
    maxWidthOrHeight: 1024,
    useWebWorker: true,
    preserveExif: true,
};
// Files picker and upload component
const FilePicker = ({ isEdit, isOnSitePhoto, onOk, onCancel, initFiles, fileMaxSize = 20, chooseType = "image/*" }) => {
    const [files, setFiles] = useState(initFiles);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    // Actions after select files
    const handleFileSelect = async (event) => {
        setIsLoading(true);
        // Get the selected files
        let selectedFiles = event.target.files;
        // If no files selected, return 
        if (selectedFiles.length === 0) {
            setIsLoading(false);
            return
        }
        // Prepare formData for upload
        let formData = new FormData();
        // Prepare an array to store all selected file hashes
        let fileArr = [];
        // Get All selected file hashes       
        for (let i = 0; i < selectedFiles.length; i++) {
            // Check file size
            if ((selectedFiles[i].size / 1024) > (fileMaxSize * 1024)) {
                message.error(t("singleFileExceed", { fileName: selectedFiles[i].name, size: fileMaxSize }));
                setIsLoading(false);
                return
            }
            const fileInfo = await getFileInfo(selectedFiles[i], false);
            let file = {
                fileKey: i,
                originFileName: selectedFiles[i].name,
                fileType: fileInfo.fileType,
                isImage: fileInfo.isImage,
                model: fileInfo.Model,
                longitude: fileInfo.longitude,
                latitude: fileInfo.latitude,
                hash: fileInfo.fileHash,
                dateTimeOriginal: fileInfo.DateTimeOriginal,
            };
            fileArr.push(file);
        }
        // Request server check which files are already uploaded
        let getFilesHashRes = await reqGetFilesByHash(fileArr);
        if (!getFilesHashRes.status) {
            setIsLoading(false);
            return
        }
        // Get the file details from server response
        let fileArr1 = getFilesHashRes.data;

        // Upload the filtered,un-uploaded files to server
        let willUploadFileNumber = 0;
        for (let i = 0; i < fileArr1.length; i++) {
            const file = fileArr1[i];
            // If id is 0, means this file is not uploaded
            if (file.id === 0) {
                willUploadFileNumber++
                if (file.isImage === 0) {
                    formData.append("files", selectedFiles[file.fileKey]);
                } else {
                    try {
                        const compressedFile = await imageCompression(selectedFiles[file.fileKey], compressOption);
                        formData.append("files", compressedFile);
                    } catch (error) {
                        formData.append("files", selectedFiles[file.fileKey]);
                    }
                }
                formData.append("fileKey", file.fileKey);
                formData.append("hash", file.hash);
                formData.append("fileName", file.originFileName);
                formData.append("fileType", file.fileType);
                formData.append("isImage", file.isImage);
                formData.append("model", file.model);
                formData.append("DateTimeOriginal", file.dateTimeOriginal);
                formData.append("latitude", file.latitude);
                formData.append("longitude", file.longitude);
                formData.append("source", "browser");
                // Delete this file from fileArr1, so that after upload we only need to merge the two arrays
                fileArr1.splice(i, 1);
                i--;
            }
        }
        // If there are files to be uploaded, upload them
        if (willUploadFileNumber > 0) {
            const uploadRes = await reqUploadFiles(formData, false);
            if (!uploadRes.status) {
                return
            }
            // Get the uploaded files from server response
            const uploadFiles = uploadRes.data;
            // Merge the uploaded files into fileArr1
            fileArr1 = fileArr1.concat(uploadFiles);
        }
        const newFiles = [...files, ...fileArr1];
        const fileNumber = newFiles.length;
        // Remove duplicate files based on id
        const removeDupFiles = RemoveDupObjectArr(newFiles, "id");
        if (fileNumber > removeDupFiles.length) {
            message.warning(t("duplicateFileRemoved", { count: fileNumber - removeDupFiles.length }));
        }
        setIsLoading(false);
        setFiles(removeDupFiles);
    };

    const handleDeleteClick = (index) => {
        let newFiles = cloneDeep(files);
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    const ImageTitle = ({ file, index }) => {
        const handleDownloadFile = () => {
            axios.get(file.fileUrl, { responseType: 'blob' }).then(res => {
                const blob = new Blob([res.data])
                let a = document.createElement('a')
                a.href = URL.createObjectURL(blob)
                if (file.originFileName !== "") {
                    a.download = file.originFileName
                }
                a.click()
            })
        };

        return (
            <Grid container>
                <Grid item xs={11}>
                    <Grid container>
                        {
                            file.isImage === 1
                                ? <>
                                    <Grid item xs={6}>
                                        {t("longitude") + ":" + file.longitude.toFixed(6)}
                                    </Grid>
                                    <Grid item xs={6}>
                                        {t("latitude") + ":" + file.latitude.toFixed(6)}
                                    </Grid>
                                </>
                                : null
                        }
                        <Grid item xs={12}>
                            {t("uploadTime") + ":" + DateTimeFormat(file.uploadTime, "LLL")}
                        </Grid>
                        <Grid item xs={12}>
                            {t("fileSource") + ":" + t(file.source)}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={1}>
                    <Grid item xs={12}>
                        <Tooltip title={t("downloadFile")} sx={{ padding: 0, margin: 0 }}>
                            <span>
                                <IconButton onClick={handleDownloadFile}>
                                    <DownloadIcon color="info" />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12}>
                        {isEdit
                            ? <Tooltip title={t("delete")} sx={{ padding: 0, margin: 0 }}>
                                <span>
                                    <IconButton onClick={() => handleDeleteClick(index)}>
                                        <DeleteIcon color="error" fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            : null
                        }
                    </Grid>
                </Grid>
            </Grid>
        )
    };

    return (
        <>
            {isLoading
                ? <Loader />
                : null
            }
            <DialogTitle
                sx={{ height: 48, pb: 4, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", px: 4 }}>
                {t("files")}
                <Box>
                    <input
                        accept={chooseType}
                        style={{ display: "none" }}
                        id="raised-button-file"
                        multiple
                        type="file"
                        onChange={handleFileSelect}
                        disabled={!isEdit || isOnSitePhoto}
                    />
                    <label htmlFor="raised-button-file">
                        <Tooltip title={t("selectFiles")} sx={{ padding: 0, margin: 0 }}>
                            <span>
                                <Button color="primary" component="span" disabled={!isEdit || isOnSitePhoto}>
                                    <UploadIcon fontSize="medium" />
                                </Button>
                            </span>
                        </Tooltip>
                    </label>
                </Box>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <ImageList
                    sx={{ width: "100%", height: 520 }}
                    cols={3}
                    rowHeight={256}
                    gap={8}
                >
                    {files.map((file, index) => {
                        return (<ImageListItem variant="standard" key={file.id} cols={1} rows={1} sx={{ overflow: "hidden", height: 256 }}>
                            {file.isImage === 1
                                ? <ModalImage
                                    small={file.fileUrl}
                                    large={file.fileUrl}
                                    alt={file.id}
                                    showRotate={true}
                                    hideDownload
                                />
                                : <Box>
                                    <FileIcon color="primary" />
                                    <Typography variant="subtitle1">{file.originFileName}</Typography>
                                </Box>
                            }
                            <ImageListItemBar
                                title={<ImageTitle file={file} index={index} />}
                            />
                        </ImageListItem>)
                    })}
                </ImageList>
            </DialogContent>
            <Divider />
            <DialogActions>
                {isEdit
                    ? <>
                        <Button color="error" onClick={onCancel} >{t("cancel")}</Button>
                        <Button variant="contained" onClick={() => onOk(files)}>{t("ok")}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >{t("back")}</Button>
                }
            </DialogActions>
        </>
    );
};

export default FilePicker;
