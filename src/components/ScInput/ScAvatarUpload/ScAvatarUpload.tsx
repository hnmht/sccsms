import React, { useState, memo, useEffect } from "react";
import { View, Alert } from "react-native";
import { Avatar, IconButton, useTheme } from "react-native-paper";
import ImageCropPicker, { Image } from "react-native-image-crop-picker";
import { useTranslation } from "react-i18next";
import { reqGetFileByHash, reqUploadFiles } from "../../../api/file";
import { readImageInfo } from "../../tools/file";
import { createUploadFilePart } from "../../../utils/upload";
import { requestPermissions } from "../../tools/permission";
import { ErrMsg, ScInputProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";

// 901 SeaCloud Avatar Upload Component
const ScAvatarUpload = ({
    positionID = 0,
    rowIndex = 0,
    isEdit = false,
    itemKey,
    initValue,
    pickDone,
    width,
    onCancel = () => { console.log("exit") }
}: ScInputProps<ScDataTypeList.AvatarUpload>) => {
    const [avatar, setAvatar] = useState(initValue);
    const [isLoading, setIsLoading] = useState(false);
    const theme = useTheme();
    const { t } = useTranslation();
    // Check Permission
    useEffect(() => {
        const checkPermission = async () => {
            const res = await requestPermissions();
            if (!res) {
                Alert.alert(
                    t("error"),
                    t("insufficientPermission"),
                    [
                        {
                            text: t("ok"),
                            onPress: onCancel
                        }
                    ]
                )
            }
        }
        checkPermission();
    }, []);
    // Actions after choose Image
    const handleFileSelect = async (image: Image) => {
        setIsLoading(true);
        if ((image.size / 1024) > 5120) {
            setIsLoading(false);
            return
        }
        let formData = new FormData(); // Prepare FormData
        // Read Image Information
        let file = await readImageInfo(image);
        if (file.isImage === 0) {
            Alert.alert(t("error"), t("mustImage"));
            setIsLoading(false);
            return
        }
        const getFilesHashRes = await reqGetFileByHash(file, false);
        // Checking server return error message
        if (!getFilesHashRes.status) {
            Alert.alert(t("error"), getFilesHashRes.msg);
            setIsLoading(false);
            return
        }
        let newAvatar = getFilesHashRes.data;
        // If the file does not exist, need upload it.
        if (newAvatar && newAvatar.id === 0) {
            const uploadFile = createUploadFilePart(
                image.path,
                file.mime ?? "application/octet-stream",
                file.originFileName ?? "unknown"
            );
            formData.append("files", uploadFile);
            formData.append("fileKey", 0);
            formData.append("hash", file.hash);
            formData.append("fileName", file.originFileName);
            formData.append("fileType", file.fileType);
            formData.append("isImage", file.isImage);
            formData.append("model", file.model);
            formData.append("DateTimeOriginal", file.dateTimeOriginal);
            formData.append("latitude", file.latitude);
            formData.append("longitude", file.longitude);
            formData.append("source", "mobileChoose");
            // Upload file to server
            const uploadRes = await reqUploadFiles(formData, false);
            if (!uploadRes.status) {
                Alert.alert(t("error"), uploadRes.msg);
                setIsLoading(false);
                return
            }
            newAvatar = uploadRes.data[0];
        }

        setAvatar(newAvatar);
        setIsLoading(false);
        // Call the pickDone function to pass the value to the parent component
        let err: ErrMsg = { isErr: false, msg: "" };
        pickDone(newAvatar, itemKey, positionID, rowIndex, err);
    };

    // Pick Image
    const handlePickImage = async () => {
        ImageCropPicker.openPicker({
            width: 256,
            height: 256,
            cropping: true,
            includeExif: true,
            mediaType: "photo"
        }).then(image => {
            handleFileSelect(image);
        }).catch(err => {
            console.error(t("error"), err)
        })

    };

    return (
        <View style={{ flexDirection: "row", justifyContent: "center", width: width, padding: 8 }}>
            <View style={{
                position: 'relative',
                overflow: 'hidden'
            }}>
                {avatar.fileUrl === ""
                    ? <Avatar.Icon icon="camera" size={90} />
                    : <Avatar.Image source={{ uri: avatar.fileUrl }} size={96} />
                }
                {isEdit
                    ? <View style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        backgroundColor: 'rgba(0,0,0,.65)',
                        width: '100%',
                        height: '100%',
                        opacity: 0.8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 48
                    }}
                    >
                        <View style={{ alignItems: "center" }}>
                            <IconButton icon="camera" disabled={isLoading} iconColor={theme.colors.primary} size={32} onPress={handlePickImage} />
                        </View>
                    </View>
                    : null
                }
            </View>
        </View>
    )
};

export default memo(ScAvatarUpload);
