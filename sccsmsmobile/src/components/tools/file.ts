import { Buffer } from "buffer"
import { dayjs, i18n, DateTimeFormat } from "../../i18n/dayjs";
import RNFS from "react-native-fs";
import { Platform } from "react-native";
import RNPhotoManipulator from "react-native-photo-manipulator";
import { Image } from "react-native-image-crop-picker";
import { checkIsImage } from "./image";
import { MarkText, Location } from "../../dataType/types/scInput";
import { ScFile } from "../../dataType/types/file";
// Get ScFile name and file type
export function parseFileName(path: string | null) {
    const safePath = path ?? "";
    const originFileName = safePath.split("/").pop() ?? "unknown"
    const ext = originFileName.includes(".") ? originFileName.slice(originFileName.lastIndexOf(".")) : "";
    return { originFileName, ext }
}
// Read ScFile Header
export async function readFileHeader(path: string, length = 64): Promise<Uint8Array> {
    const base64 = await RNFS.read(path, length, 0, "base64");
    return Uint8Array.from(Buffer.from(base64, "base64"))
}
// Read Image Create time
function resolveDateTime(file: Image) {
    if (file.exif?.DateTimeDigitized) {
        return dayjs(file.exif.DateTimeDigitized, "YYYY:MM:DD HH:mm:ss")
            .format("YYYYMMDDHHmm")
    }

    const ts =
        Platform.OS === "ios"
            ? Number(file.creationDate)
            : Number(file.modificationDate)

    return dayjs(ts || Date.now()).format("YYYYMMDDHHmm")
}
// Read Image location
function resolveLocation(file: Image) {
    let latitude: number = 0.01;
    let longitude: number = 0.01;

    if (file.exif?.Latitude) {
        latitude = file.exif.Latitude;
    }
    if (file.exif?.Longitude) {
        longitude = file.exif.Longitude
    }
    return { latitude, longitude };
};

// Define text font for image watermarks
export const markFontOptions = {
    fontSize: 16,
    textColor: "#FFFAFA",
    margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
    },
    rowHeight: 22,
};
const buildTextBlock = (
    texts: string[],
    startX: number,
    startY: number,
    options = markFontOptions
): MarkText[] => {
    return texts.map((text, index) => ({
        position: {
            x: startX,
            y: startY + index * options.rowHeight,
        },
        text,
        textSize: options.fontSize,
        color: options.textColor,
    }));
};
const estimateTextWidth = (texts: string[], fontSize: number) => {
    if (!texts.length) {
        return 0;
    }

    const getCharWidth = (char: string) => {
        if (/\s/.test(char)) {
            return fontSize * 0.35;
        }
        if (/[\u3000-\u303F\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]/.test(char)) {
            return fontSize;
        }
        if (/[A-Z0-9]/.test(char)) {
            return fontSize * 0.68;
        }
        return fontSize * 0.6;
    };

    return Math.max(
        ...texts.map(text =>
            Array.from(text).reduce((total, char) => total + getCharWidth(char), 0)
        )
    );
};
// Add Water Mark in an image
export const imageAddWaterMark = async (file: Image, markTexts: MarkText[], currentLocation: Location): Promise<ScFile> => {
    const filePath = file.path;
    const imageInfo = await readImageInfo(file);

    // Return immediately if no size is provided
    if (!file.width || !file.height) {
        return imageInfo;
    }
    const marks: MarkText[] = [];
    // Top-left corner, business watermark
    marks.push(
        ...buildTextBlock(
            markTexts.map(t => t.text),
            markFontOptions.margin.left,
            markFontOptions.margin.top
        )
    );
    // Bottom-right: Photo info watermark
    const infoTexts = [
        `${i18n.t("longitude")}: ${currentLocation.longitude}`,
        `${i18n.t("latitude")}: ${currentLocation.latitude}`,
        `${DateTimeFormat()} | ${i18n.t("isOnSitePhoto")}`,
    ];
    imageInfo.longitude = currentLocation.longitude;
    imageInfo.latitude = currentLocation.latitude;
    const blockHeight = infoTexts.length * markFontOptions.rowHeight;
    const blockWidth = estimateTextWidth(
        infoTexts,
        markFontOptions.fontSize
    );
    const startX =
        file.width - blockWidth - markFontOptions.margin.right;
    const startY =
        file.height - blockHeight - markFontOptions.margin.bottom;

    marks.push(
        ...buildTextBlock(infoTexts, startX, startY)
    );
    const markImagePath = await RNPhotoManipulator.printText(
        filePath,
        marks
    );

    imageInfo.filePath = markImagePath;
    imageInfo.fileUrl = markImagePath;
    return imageInfo;
};

// Get Image info
export const readImageInfo = async (file: Image): Promise<ScFile> => {
    const filePath = file.path;
    const { originFileName, ext } = parseFileName(filePath);
    const header = await readFileHeader(filePath, 64);
    const typeInfo = checkIsImage(header);
    const hash = await RNFS.hash(file.path, "sha256");
    const isImage = typeInfo.isImage ? 1 : 0;
    const fileType = typeInfo.isImage ? typeInfo.type : ext;
    const model = file.exif?.Model ?? "unknown";
    const dateTimeOriginal = resolveDateTime(file);
    const { latitude, longitude } = resolveLocation(file);
    const mime = file.mime;
    return {
        id: 0,
        fileKey: 0,
        originFileName,
        fileType,
        mime,
        filePath,
        hash,
        isImage,
        model,
        dateTimeOriginal,
        latitude,
        longitude,
        fileUri: filePath,
        fileUrl: filePath,
        source: "",
        dr: 0
    };
};
