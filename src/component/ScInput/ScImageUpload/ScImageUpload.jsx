import { memo, useState } from "react";
import {
    Stack,
    TextField,
    InputLabel,
    Tooltip,
    IconButton,
    InputBase
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ErrorIcon, UploadIcon, ClearIcon } from "../../PubIcon/PubIcon";
import { message } from "mui-message";
import Loader from "../../Loader/Loader";
import { getFileInfo } from "../../../utils/hash";
import { reqUploadFiles, reqGetFileByHash } from "../../../api/file";

const zeroImage = {
    id: 0,
    fileName: "",
    fileUrl: "",
    fileUri: "",
    originFileName: ""
};
// 903 Seacloud Image Upload component
const ScImpageUpload = (props) => {
    const { fieldIndex, positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [image, setImage] = useState(initValue);
    const [isLoading, setIsLoading] = useState(false);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const id = `903_${itemKey}_${positionID}_${rowIndex}`;
    const { t } = useTranslation();
    // Actions after selected filed
    const handleFileSelect = async (event) => {
        setIsLoading(true);
        let images = event.target.files;
        if (images.length === 0) {
            message.error(t("noFileSelected"));
            setIsLoading(false);
            if (!allowNull) {
                setErrInfo({ isErr: true, msg: "cannotEmpty" })
            }
            return
        }
        let file = images[0];
        if ((file.size / 1024) > 5120) {
            message.error(t("singleFileExceed", { fileName: file.name, size: 5 }))
            setIsLoading(false);
            return
        }
        let formData = new FormData();
        // Get file details
        let fileInfo = await getFileInfo(file);
        if (fileInfo.isImage === 0) {
            message.error(t("fileMustBeImage"));
            setIsLoading(false);
            return
        }
        // Execute the validation function passed from the parent component
        let err = { isErr: false, msg: "" };
        if (isBackendTest) {
            err = backendTestFunc(fileInfo)
            if (err.isErr) {
                message.error(t(err.msg));
                setIsLoading(false);
                return
            }
        }
        // Request server check which file is already uploaded
        let getFilesHashRes = await reqGetFileByHash({
            filekey: 0,
            originFileName: file.name,
            fileType: fileInfo.fileType,
            isImage: fileInfo.isImage,
            model: fileInfo.Model,
            longitude: fileInfo.longitude,
            latitude: fileInfo.latitude,
            hash: fileInfo.fileHash,
            dateTimeOriginal: fileInfo.DateTimeOriginal,
        }, false);

        // Chcek the request response
        if (!getFilesHashRes.status) {
            setIsLoading(false);
            return
        }
        let newImage = {};
        // If id is 0, that means file is not uploaded
        if (getFilesHashRes.data.id === 0) {
            // To compress the image           
            formData.append("files", file);
            formData.append("fileKey", 0);
            formData.append("hash", fileInfo.fileHash);
            formData.append("fileName", file.name);
            formData.append("fileType", fileInfo.fileType);
            formData.append("isImage", fileInfo.isImage);
            formData.append("model", fileInfo.Model); 
            formData.append("DateTimeOriginal", fileInfo.DateTimeOriginal); 
            formData.append("latitude", fileInfo.latitude);
            formData.append("longitude", fileInfo.longitude); 
            formData.append("source", "browser");
            // Upload the file to server
            const uploadRes = await reqUploadFiles(formData,false);
            if (!uploadRes.status) {
                setIsLoading(false);
                return
            }
            newImage = uploadRes.data[0];
        } else {
            newImage = getFilesHashRes.data;
        }

        setIsLoading(false);
        // Pass the value to the parent component
        handleTransfer(newImage);
    }
    // Actions after click clear button
    const handleClear = () => {
        handleTransfer(zeroImage);
    };

    // Pass the value to the parent component
    const handleTransfer = (image) => {
        let err = { isErr: false, msg: "" };
        if (image.id === 0 && !allowNull) {
            err = { isErr: true, msg: "cannotEmpty" }
        }
        setImage(image);
        setErrInfo(err);
        pickDone(image, itemKey, fieldIndex, rowIndex, err);
    }

    return (
        <>
            {isLoading
                ? <Loader />
                : null

            }
            {positionID !== 1
                ? <InputLabel htmlFor={id} sx={{ color: allowNull ? "primary" : "blue" }}>{t(itemShowName)}</InputLabel>
                : null
            }
            {positionID !== 1
                ? <TextField
                    fullWidth
                    type="text"
                    id={id}
                    disabled
                    placeholder={t(placeholder)}
                    value={image.originFileName}
                    error={errInfo.isErr}
                    InputProps={{
                        endAdornment:
                            <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                                {errInfo.isErr
                                    ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                    : null
                                }
                                {image.id !== 0 && isEdit && allowNull
                                    ? <IconButton onClick={handleClear} size="small"><ClearIcon /></IconButton>
                                    : null
                                }
                                <Stack> 
                                    <Tooltip title={t("chooseAnImage")} sx={{ margin: 0, padding: 0 }}>                                      
                                        <IconButton
                                            color="primary"
                                            component="label"
                                            size="small"                                           
                                            disabled={!isEdit}
                                        >
                                            <input
                                                accept="image/*"
                                                style={{ display: "none" }}  
                                                id={id}                                             
                                                multiple={false}
                                                type="file"
                                                onChange={handleFileSelect}
                                            />
                                            <UploadIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Stack>,
                    }}
                />
                : <InputBase
                    fullWidth
                    type="text"
                    id={id}
                    disabled
                    name={id}
                    placeholder={placeholder}
                    value={image.originFileName}
                    error={t(errInfo.isErr)}
                    endAdornment={
                        <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                            {errInfo.isErr
                                ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip>
                                : null
                            }
                            {image.id !== 0 && isEdit && allowNull
                                ? <IconButton onClick={handleClear} size="small"><ClearIcon /></IconButton>
                                : null
                            }
                            <Stack>
                                <input
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    id={id}
                                    multiple={false}
                                    type="file"
                                    onChange={handleFileSelect}
                                />
                                <Tooltip title={t("chooseAnImage")} sx={{ margin: 0, padding: 0 }}>
                                    <IconButton
                                        color="primary"
                                        component="label"
                                        size="small"
                                        htmlFor={id}
                                        disabled={!isEdit}
                                    >
                                        <UploadIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Stack>}
                />
            }
        </>
    );
}

export default memo(ScImpageUpload);