import { memo, useState } from "react";
import {
    Stack,
    FormLabel,
    Avatar,
    Box,
    Typography,
    TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { CameraIcon } from "../../PubIcon/PubIcon";
import imageCompression from "browser-image-compression";
import { message } from "mui-message";
import Loader from "../../Loader/Loader";
import { getFileInfo } from "../../../utils/hash";
import { reqUploadFiles, reqGetFileByHash } from "../../../api/file";

const compressOption = {
    maxWidthOrHeight: 512,
    useWebWorker: true,
    preserveExif: true,
};
// 901 Avator Upload Component
const ScAvatarUpload = (props) => {
    const { fieldIndex = 0, rowIndex = 0, positionID = 0, isEdit, itemKey, initValue, pickDone } = props;
    const [avatar, setAvatar] = useState(initValue);
    const [isLoading, setIsLoading] = useState(false);
    const id = `901_${itemKey}_${positionID}_${rowIndex}`;
    const { t } = useTranslation();
    // Actions after select file
    const handleFileSelect = async (event) => {
        setIsLoading(true);
        let images = event.target.files;
        if (images.length === 0) {
            message.error(t("noFileSelected"));
            setIsLoading(false);
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
        // Request server check which file is already uploaded
        let getFilesHashRes = await reqGetFileByHash({
            fileKey: 0,
            originFileName: file.name,
            fileType: fileInfo.fileType,
            isImage: fileInfo.isImage,
            model: fileInfo.Model,
            longitude: fileInfo.longitude,
            latitude: fileInfo.latitude,
            hash: fileInfo.fileHash,
            dateTimeOriginal: fileInfo.DateTimeOriginal,
        }, false);
        // Check the request response
        if (!getFilesHashRes.status) {
            setIsLoading(false);
            return
        }
        let newAvatar = {};
        // If id is 0, that means file is not uploaded
        if (getFilesHashRes.data.id === 0) {
            // To compress the image           
            const compressedFile = await imageCompression(file, compressOption);
            formData.append("files", compressedFile);
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
            const uploadRes = await reqUploadFiles(formData, false);
            if (!uploadRes.status) {
                setIsLoading(false);
                return
            }
            newAvatar = uploadRes.data[0];
        } else {
            newAvatar = getFilesHashRes.data;
        }

        setAvatar(newAvatar);
        setIsLoading(false);
        // Pass the value to the parent component
        let err = { isErr: false, msg: "" };
        pickDone(newAvatar, itemKey, fieldIndex, rowIndex, err);
    }

    return (
        <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
            {isLoading
                ? <Loader />
                : null

            }
            <FormLabel
                htmlFor={id}
                sx={{
                    position: 'relative',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    '&:hover .MuiBox-root': { opacity: 1 },
                    cursor: 'pointer'
                }}
            >
                <Avatar alt="Avatar" src={avatar.fileUrl} sx={{ width: 72, height: 72 }} />
                {isEdit
                    ? <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            backgroundColor: 'rgba(0,0,0,.65)',
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Stack spacing={0.5} alignItems="center">
                            <CameraIcon style={{ color: "blue", fontSize: '2rem' }} />
                            <Typography sx={{ color: 'blue', fontWeight: "bold" }}>{t("upload")}</Typography>
                        </Stack>
                    </Box>
                    : null
                }
            </FormLabel>
            <TextField
                disabled={!isEdit}
                type="file"
                inputProps={{
                    multiple: false,
                    accept: "image/*",
                }}
                id={id}
                label="Outlined"
                variant="outlined"
                sx={{ display: 'none' }}
                onChange={handleFileSelect}
            />
        </Stack>
    );
}

export default memo(ScAvatarUpload);