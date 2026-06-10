import forge from "node-forge";
import exifReader from "exifreader";
import { dayjs } from "../i18n/i18n";

// Get FIle Info
export const getFileInfo = async (file) => {
    let name = file.name; // Get File Name   
    let fileType = name.substring(name.lastIndexOf("."), name.length);
    const arrayBuffer = await file.arrayBuffer();
    const fileHash = await computeFileHash(arrayBuffer);
    // Set the file info default values
    let isImage = 0;
    let imageWidth = 0;
    let imageHeight = 0;
    let Model = "unknown"; // Camera Model
    let DateTimeOriginal = dayjs(file.lastModifiedDate).format("YYYYMMDDHHmm");
    let latitude = 0.01;
    let longitude = 0.01;
    // Check if the file is an image and extract EXIF data
    const uint8Array = new Uint8Array(arrayBuffer);
    const checkRes = checkIsImage(uint8Array);
    if (checkRes.isImage === 1) {
        isImage = checkRes.isImage;
        fileType = checkRes.type
        const tags = await exifReader.load(arrayBuffer);
        // Extract relevant EXIF tags
        if (tags) {
            if (tags.Model) { Model = tags.Model.description };
            if (tags.DateTimeOriginal) { DateTimeOriginal = dayjs(tags.DateTimeOriginal.description, "YYYY:MM:DD HH:mm").format("YYYYMMDDHHmm") };
            if (tags.GPSLatitude) { latitude = tags.GPSLatitude.description };
            if (tags.GPSLongitude) { longitude = tags.GPSLongitude.description };
            if (tags["Image Height"]) (imageHeight = tags["Image Height"].value);
            if (tags["Image Width"]) (imageWidth = tags["Image Width"].value);
        }
    }

    return {
        name,
        fileType,
        fileHash,
        isImage,
        imageHeight,
        imageWidth,
        Model,
        DateTimeOriginal,
        latitude,
        longitude,
    };
};

// Compute file hash
export const computeFileHash = async (arrayBuffer) => {
    let fileHash = "emptyHash";
    const isHttps = typeof window !== 'undefined' && window.crypto && window.crypto.subtle;
    if (isHttps) {
        // Using crypto.subtle
        const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        fileHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
        // Using Forge
        const bufferAdapter = forge.util.createBuffer(arrayBuffer);
        const byteString = bufferAdapter.bytes();
        const md = forge.md.sha256.create();
        md.update(byteString);
        fileHash = md.digest().toHex();
    }
    return fileHash;
}

// Check if the buffer corresponds to an image file (PNG, JPEG, GIF)
const checkIsImage = (buf) => {
    const pngMagic = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    const jpeg_jfif = [0x4a, 0x46, 0x49, 0x46];
    const jpeg_exif = [0x45, 0x78, 0x69, 0x66];
    const jpegMagic = [0xFF, 0xD8, 0xFF, 0xE0];
    const gifMagic0 = [0x47, 0x49, 0x46, 0x38, 0x37, 0x61];
    const getGifMagic1 = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61];
    // 6 bytes
    const isGif = data => (arrayEquals(data, gifMagic0) || arrayEquals(data, getGifMagic1));
    // 4 bytes
    const isJpeg = data => (arrayEquals(data, jpegMagic) || arrayEquals(data, jpeg_jfif) || arrayEquals(data, jpeg_exif));
    // 8 bytes
    const isPng = data => arrayEquals(data, pngMagic);

    const arraycopy = (src, index, dist, distIndex, size) => {
        for (let i = 0; i < size; i++) {
            dist[distIndex + i] = src[index + i]
        }
    };
    const arrayEquals = (arr1, arr2) => {
        if (!arr1 || !arr2) {
            return false
        }
        if (arr1 instanceof Array && arr2 instanceof Array) {
            if (arr1.length !== arr2.length) {
                return false
            }
            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i]) {
                    return false
                }
            }
            return true
        }
        return false;
    };

    if (!buf || buf.length < 8) {
        return { isImage: 0, type: "none" };
    }
    let bytes = [];
    arraycopy(buf, 0, bytes, 0, 6);
    if (isGif(bytes)) {
        return { isImage: 1, type: ".gif" };;
    }
    bytes = [];
    arraycopy(buf, 6, bytes, 0, 4);
    if (isJpeg(bytes)) {
        return { isImage: 1, type: ".jpg" };
    }
    bytes = [];
    arraycopy(buf, 0, bytes, 0, 8);
    if (isPng(bytes)) {

        return { isImage: 1, type: ".png" };;
    }
    return { isImage: 0, type: "none" };
};







