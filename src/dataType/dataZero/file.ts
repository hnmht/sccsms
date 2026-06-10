import { dayjs, EpochTime } from "../../i18n/dayjs";
import { ScFile } from "../types/file";

export function getEmptyFile(): ScFile {
    const file: ScFile = {
        id: 0,
        hash: "",
        minioFileName: "",
        originFileName: "string",
        fileKey: 0,
        filePath: "",
        fileUri: "",
        mime: "",
        fileType: "",
        isImage: 0,
        model: "",
        longitude: 0.01,
        latitude: 0.01,
        size: 0,
        fileUrl: "",
        dateTimeOriginal: dayjs('1970-01-01 00:00:00').format("YYYYMMDDHHmm"),
        uploadTime: EpochTime,
        source: "",
        creatorID: 0,
        creatorName: "",
        dr: 0,
        ts: EpochTime,
    }
    return file;
}