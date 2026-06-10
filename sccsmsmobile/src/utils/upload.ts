import { Platform } from "react-native";
import { ScFile } from "../dataType/types/file";

type UploadFilePart = {
    uri: string;
    type: string;
    name: string;
};

export function normalizeUploadUri(uri: string): string {
    if (!uri) {
        return uri;
    }
    if (uri.startsWith("content://") || uri.startsWith("file://")) {
        return uri;
    }
    if (Platform.OS === "android") {
        return `file://${uri}`;
    }
    return uri;
}

export function createUploadFilePart(uri: string, type: string, name: string): UploadFilePart {
    return {
        uri: normalizeUploadUri(uri),
        type,
        name
    };
}

export function appendUploadField(formData: FormData, key: string, value: unknown): void {
    formData.append(key, value === undefined || value === null ? "" : String(value));
}

type BuildUploadFormDataResult = {
    formData: FormData;
    uploadedFileNumber: number;
    existingFiles: ScFile[];
};

export function buildUploadFormData(files: ScFile[]): BuildUploadFormDataResult {
    let uploadedFileNumber = 0;
    let fileKey = 0;
    const existingFiles = files.filter(file => file.id !== 0);
    const formData = new FormData();

    for (const uploadFile of files) {
        if (uploadFile.id !== 0) {
            continue;
        }
        const uploadUri = uploadFile.filePath || uploadFile.fileUri || "";
        if (!uploadUri) {
            console.error("Skip upload file due to empty uri", uploadFile);
            continue;
        }
        uploadedFileNumber++;
        const file = createUploadFilePart(
            uploadUri,
            uploadFile.mime ?? "application/octet-stream",
            uploadFile.originFileName ?? "unknown"
        );
        formData.append("files", file);
        appendUploadField(formData, "fileKey", fileKey++);
        appendUploadField(formData, "hash", uploadFile.hash);
        appendUploadField(formData, "fileName", uploadFile.originFileName);
        appendUploadField(formData, "fileType", uploadFile.fileType);
        appendUploadField(formData, "isImage", uploadFile.isImage);
        appendUploadField(formData, "model", uploadFile.model);
        appendUploadField(formData, "DateTimeOriginal", uploadFile.dateTimeOriginal);
        appendUploadField(formData, "latitude", uploadFile.latitude);
        appendUploadField(formData, "longitude", uploadFile.longitude);
        appendUploadField(formData, "source", uploadFile.source);
    }

    return {
        formData,
        uploadedFileNumber,
        existingFiles
    };
}
