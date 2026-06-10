
import forge from "node-forge";
import { table, pickFields } from "./schema";

let cryptoKey;
const isHttps = typeof window !== 'undefined' && window.crypto && window.crypto.subtle;
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const tagLength = 16;

// Import cryptoKey
export const importCryptoKey = async (key) => {
    let rawKey;
    if (typeof atob === "function") {
        const binary = atob(key);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        rawKey = bytes.buffer;
    } else {
        const buf = Buffer.from(key, 'base64');
        rawKey = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }

    if (isHttps) {
        cryptoKey = await crypto.subtle.importKey(
            "raw", rawKey,
            { name: "AES-GCM" },
            true,
            ["encrypt", "decrypt"]
        );
    } else {
        cryptoKey = forge.util.decode64(key);
    }
};

// Encrypt data
export const encryptData = async (type, data) => {
    // Get table index entries
    const indexFields = table[type];
    const newData = pickFields(data, indexFields);
    const dataEncrypt = encoder.encode(JSON.stringify(data));
    if (isHttps) {
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encryptedData = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            cryptoKey,
            dataEncrypt
        );
        newData.iv = iv;
        newData.tag = "notusedinwebcrypto";
        newData.encryptedData = encryptedData;
        return newData;
    } else {
        const iv = forge.random.getBytesSync(12);
        const cipher = forge.cipher.createCipher('AES-GCM', cryptoKey);
        cipher.start({ iv: iv, tagLength: tagLength * 8 });
        cipher.update(forge.util.createBuffer(dataEncrypt))
        cipher.finish();
        const encryptedData = cipher.output.getBytes();
        const tag = forge.util.encode64(cipher.mode.tag.getBytes());
        newData.iv = iv;
        newData.tag = tag;
        newData.encryptedData = encryptedData;
        return newData;
    }
};

// Encrypt dataArr
export const encryptDataArr = async (type, dataArr) => {
    const newDataArr = [];
    // Get table index entries
    const indexFields = table[type];
    for (const data of dataArr) {
        const newData = pickFields(data, indexFields);
        const dataEncrypt = encoder.encode(JSON.stringify(data));
        if (isHttps) {
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const encryptedData = await window.crypto.subtle.encrypt(
                { name: "AES-GCM", iv: iv },
                cryptoKey,
                dataEncrypt
            );
            newData.iv = iv;
            newData.tag = "notusedinwebcrypto";
            newData.encryptedData = encryptedData;
        } else {
            const iv = forge.random.getBytesSync(12);
            const cipher = forge.cipher.createCipher('AES-GCM', cryptoKey);
            cipher.start({ iv: iv, tagLength: tagLength * 8 });
            cipher.update(forge.util.createBuffer(dataEncrypt))
            cipher.finish();
            const encryptedData = cipher.output.getBytes();
            const tag = forge.util.encode64(cipher.mode.tag.getBytes());
            newData.tag = tag;
            newData.iv = iv;
            newData.encryptedData = encryptedData;
        }
        newDataArr.push(newData);
    }
    return newDataArr;
};

// Decrypt data
export const decryptData = async (data) => {
    if (!data) {
        return
    }
    const { iv, tag, encryptedData } = data;
    if (isHttps) {
        const decrypted = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            cryptoKey,
            encryptedData
        )
        return JSON.parse(decoder.decode(decrypted));
    } else {
        const decipher = forge.cipher.createDecipher('AES-GCM', cryptoKey);
        const tagBytes = forge.util.decode64(tag);
        // decipher.mode.tag = forge.util.createBuffer(tagBytes);
        decipher.start({ iv: iv, tag: tagBytes, tagLength: tagLength * 8 });
        decipher.update(forge.util.createBuffer(encryptedData));
        const pass = decipher.finish();
        if (pass) {
            const decrypted = decipher.output.getBytes();
            return JSON.parse(decoder.decode(new Uint8Array(forge.util.createBuffer(decrypted).toHex().match(/.{1,2}/g).map(byte => parseInt(byte, 16)))));
        } else {
            console.error("Decryption failed");
            throw new Error("Decryption failed");
        }
    }
};

// Decrypt data array
export const decryptDataArr = async (dataArr) => {
    if (!dataArr) {
        return
    }
    // let startTime = new Date();
    const newDataArr = [];
    for (const data of dataArr) {
        const { iv, tag, encryptedData } = data;
        if (isHttps) {
            const decrypted = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                cryptoKey,
                encryptedData
            )
            const decodedData = decoder.decode(decrypted);
            newDataArr.push(JSON.parse(decodedData));
        } else {
            const tagBytes = forge.util.decode64(tag);            
            const decipher = forge.cipher.createDecipher('AES-GCM', cryptoKey);
            // decipher.mode.tag = forge.util.createBuffer(tagBytes);
            decipher.start({ iv:iv, tag:tagBytes, tagLength: tagLength * 8 });
            decipher.update(forge.util.createBuffer(encryptedData));
            const pass = decipher.finish();
            if (pass) {
                const decrypted = decipher.output.getBytes();
                const decodedData = decoder.decode(new Uint8Array(forge.util.createBuffer(decrypted).toHex().match(/.{1,2}/g).map(byte => parseInt(byte, 16))));
                newDataArr.push(JSON.parse(decodedData));
            } else {
                console.error("Decryption failed for one of the entries");
                throw new Error("Decryption failed for one of the entries");
            }
        }
    }
    // console.log("Decryption time:", new Date() - startTime, "ms");
    return newDataArr;
};