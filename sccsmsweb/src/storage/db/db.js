import Dexie from "dexie";
import { cloneDeep } from "lodash";
import { dayjs } from "../../i18n/dayjs";
import { GetDataTypeDefaultValue } from "../dataTypes";
import { reqGetSimpDepts, reqGetSimpDeptsCache } from "../../api/department";
import { reqGetPersons, reqGetPersonsCache } from "../../api/person";
import { reqGetUDCList, reqGetUDCsCache } from "../../api/udc";
import { reqGetUDAAll, reqGetUDACache } from "../../api/uda";
import { reqGetSimpEPCList, reqGetSimpEPCCache } from "../../api/epc";
import { reqGetEPList, reqGetEPCache } from "../../api/epa";
import { reqGetEPTList, reqGetEPTCache } from "../../api/ept";
import { reqGetCSList, reqGetCSCache } from "../../api/csa";
import { reqGetCSOCache, reqGetCSOs } from "../../api/cso";
import { reqGetSimpCSCList, reqGetSimpCSCCache } from "../../api/csc";
import { reqGetPositionList, reqGetPositionCache } from "../../api/position";
import { reqGetRLList, reqGetRLsCache } from "../../api/riskLevel";
import { reqGetSimpDCList, reqGetSimpDCCache } from "../../api/dc";
import { reqGetTCList, reqGetTCCache } from "../../api/tc";
import { reqGetPPEList, reqGetPPECache } from "../../api/ppe";
import { reqPubSysInfo, reqGenerateFrontDBID, reqGetFrontDBID } from "../../api/pub";
import { dbName, table, tableEncrypted } from "./schema";
import { importCryptoKey, encryptData, decryptDataArr, decryptData } from "./encrypt";
import { getToken } from "../token";

const db = new Dexie(dbName);
db.version(1).stores(table);

// Get Archive by ID
export const GetCacheDocById = async (archive, id) => {      
    let value = await db[archive].get(id);
    if (tableEncrypted[archive]) {
        value = decryptData(value);
    }
    return value;
};

// Generic conversion function
const commonTransDoc = async (docs) => {
    return docs;
};

// The backend persons encrypt the data and then transfer it to the frontend-comsumble data
const transPersonToFrontend = async (persons) => {
    const newPersons = [];
    for (const p of persons) {
        const newP = await encryptData("person", p);
        newPersons.push(newP)
    }
    return newPersons;
};

// Convert EPs backend data to frontend-consumble data
const transEPsToFrontend = async (epas) => {
    async function transEpas() {
        for (let newEpa of epas) {
            switch (newEpa.resultType.id) {
                case 301:
                    break;
                case 306:
                    break;
                case 307:
                    break;
                case 302:
                    newEpa.defaultValue = parseFloat(newEpa.defaultValue);
                    newEpa.errorValue = parseFloat(newEpa.errorValue);
                    break;
                case 401:
                case 404:
                    newEpa.defaultValue = parseInt(newEpa.defaultValue);
                    newEpa.errorValue = parseInt(newEpa.errorValue);
                    break;
                case 510:
                case 520:
                case 525:
                case 530:
                case 540:
                case 550:
                    newEpa.defaultValue = newEpa.defaultValue !== "0" ? await GetCacheDocById(newEpa.resultType.frontDb, parseInt(newEpa.defaultValue)) : GetDataTypeDefaultValue(newEpa.resultType.id);
                    newEpa.errorValue = newEpa.errorValue !== "0" ? await GetCacheDocById(newEpa.resultType.frontDb, parseInt(newEpa.errorValue)) : GetDataTypeDefaultValue(newEpa.resultType.id);
                    break;
                default:
                    console.error("No matching DataType");
            }
        }
    }
    await transEpas();
    return epas;
};
// Convert EPTs backend data to frontend-consumble data
const transEPTsToFrontend = async (epts) => {
    // let startTime = new Date();
    async function transEPTs() {
        for (let ept of epts) {
            for (let row of ept.body) {
                switch (row.epa.resultType.id) {
                    case 301:
                    case 306:
                    case 307:
                        break;
                    case 302:
                        row.defaultValue = parseFloat(row.defaultValue);
                        row.errorValue = parseFloat(row.errorValue);
                        row.epa.defaultValue = parseFloat(row.epa.defaultValue);
                        row.epa.errorValue = parseFloat(row.epa.errorValue);
                        break;
                    case 401:
                    case 404:
                        row.defaultValue = parseInt(row.defaultValue);
                        row.errorValue = parseInt(row.errorValue);
                        row.epa.defaultValue = parseInt(row.epa.defaultValue);
                        row.epa.errorValue = parseInt(row.epa.errorValue);
                        break;
                    case 510:
                    case 520:
                    case 525:
                    case 530:
                    case 540:
                    case 550:
                        row.defaultValue = row.defaultValue !== "0" ? await GetCacheDocById(row.epa.resultType.frontDb, parseInt(row.defaultValue)) : GetDataTypeDefaultValue(row.epa.resultType.id);
                        row.errorValue = row.errorValue !== "0" ? await GetCacheDocById(row.epa.resultType.frontDb, parseInt(row.errorValue)) : GetDataTypeDefaultValue(row.epa.resultType.id);
                        row.epa.defaultValue = row.epa.defaultValue !== "0" ? await GetCacheDocById(row.epa.resultType.frontDb, parseInt(row.epa.defaultValue)) : GetDataTypeDefaultValue(row.epa.resultType.id);
                        row.epa.errorValue = row.epa.errorValue !== "0" ? await GetCacheDocById(row.epa.resultType.frontDb, parseInt(row.epa.errorValue)) : GetDataTypeDefaultValue(row.epa.resultType.id);
                        break;
                    default:
                        console.error("No matching DataType");
                }
            }
        }
    }
    await transEPTs();
    return epts;
};

// IndexedDB table definition
export const docTable = new Map([
    ["department", { description: "Department master data", reqAllFunc: reqGetSimpDepts, reqCacheFunc: reqGetSimpDeptsCache, transToFrontFunc: commonTransDoc }],
    ["person", { description: "Person master date", reqAllFunc: reqGetPersons, reqCacheFunc: reqGetPersonsCache, transToFrontFunc: transPersonToFrontend }],
    ["position", { description: "Position master data", reqAllFunc: reqGetPositionList, reqCacheFunc: reqGetPositionCache, transToFrontFunc: commonTransDoc }],
    ["risklevel", { description: "Risk Level", reqAllFunc: reqGetRLList, reqCacheFunc: reqGetRLsCache, transToFrontFunc: commonTransDoc }],
    ["udc", { description: "User-defined Category", reqAllFunc: reqGetUDCList, reqCacheFunc: reqGetUDCsCache, transToFrontFunc: commonTransDoc }],
    ["uda", { description: "User-defined Archive", reqAllFunc: reqGetUDAAll, reqCacheFunc: reqGetUDACache, transToFrontFunc: commonTransDoc }],
    ["csc", { description: "Construction Site Category", reqAllFunc: reqGetSimpCSCList, reqCacheFunc: reqGetSimpCSCCache, transToFrontFunc: commonTransDoc }],
    ["csa", { description: "Construction Site Archive", reqAllFunc: reqGetCSList, reqCacheFunc: reqGetCSCache, transToFrontFunc: commonTransDoc }],
    ["cso", { description: "Construction Site Options", reqAllFunc: reqGetCSOs, reqCacheFunc: reqGetCSOCache, transToFrontFunc: commonTransDoc }],
    ["epc", { description: "Execution Project Category", reqAllFunc: reqGetSimpEPCList, reqCacheFunc: reqGetSimpEPCCache, transToFrontFunc: commonTransDoc }],
    ["epa", { description: "Execution Project", reqAllFunc: reqGetEPList, reqCacheFunc: reqGetEPCache, transToFrontFunc: transEPsToFrontend }],
    ["ppe", { description: "Personal Protective Equipment", reqAllFunc: reqGetPPEList, reqCacheFunc: reqGetPPECache, transToFrontFunc: commonTransDoc }],
    ["dc", { description: "Document Category", reqAllFunc: reqGetSimpDCList, reqCacheFunc: reqGetSimpDCCache, transToFrontFunc: commonTransDoc }],
    ["tc", { description: "Training Course", reqAllFunc: reqGetTCList, reqCacheFunc: reqGetTCCache, transToFrontFunc: commonTransDoc }],
    ["ept", { description: "Execution Project Template", reqAllFunc: reqGetEPTList, reqCacheFunc: reqGetEPTCache, transToFrontFunc: transEPTsToFrontend }],
]);

// Initialize indexedDB database
export const initLocalDb = async () => {
    const token = getToken();
    if (!token || token === null || token === "") {
        return
    }
    // Request the server to get the DBID
    let newDbid;
    const res = await reqPubSysInfo(false);
    if (!res.status) {
        return
    }
    newDbid = res.data.dbID;
    // Access the dbinfo table in indexedDB to get DBID
    let dbId;
    let frontDbId;
    const dbidInfo = await db["dbinfo"].where("infoname").equals("dbid").toArray();
    // If no data is queried, it means this is the first time the initialization has been run
    if (dbidInfo.length === 0) {
        dbId = newDbid
        // Write the DBID information to the dbinfo table
        await db["dbinfo"].add({ infoname: "dbid", infovalue: dbId })
            .then(res => {
                console.log("Successfully wrote the DBID to dbinfo.");
            })
            .catch((err) => {
                console.error("Failed to write the DBID to the dbinfo table:", err);
            })
        // Request the server to generate a frontend DBID
        const generateRes = await reqGenerateFrontDBID({ dbID: dbId });
        if (generateRes.status) {
            await importCryptoKey(generateRes.data.cryptoKey);
            db["dbinfo"].add({ infoname: "frontdbid", infovalue: generateRes.data.frontDbID })
                .then(res => {
                    console.log("Successfully wrote the frontdbid to dbinfo.");
                })
                .catch((err) => {
                    console.error("Failed to write the frontdbid to the dbinfo table:", err);
                })
        } else {
            console.error("Failed to write the DBID to the dbinfo table:", generateRes.msg);
        }
    } else {
        dbId = dbidInfo[0].infovalue;
        const frontDbInfo = await db["dbinfo"].where("infoname").equals("frontdbid").toArray();
        if (frontDbInfo.length === 0) {
            console.error("Frontend DB information not found. Please Delete the frontend database and try again.")
            return
        }
        frontDbId = frontDbInfo[0].infovalue;
        const getRes = await reqGetFrontDBID({ dbID: dbId, frontDbId: frontDbId });
        if (getRes.status) {
            await importCryptoKey(getRes.data.cryptoKey)
        }
    }

    // If the front-end DBID and back-end DBID are not equal,
    // all content in the front-end database needs to ble cleared.
    if (newDbid !== dbId) {
        // Clear all content in the front-end database
        await clearAllDocCache();
        // Update the DBID information in the dbinfo table
        db["dbinfo"].update("dbid", { infoname: "dbid", infovalue: newDbid })
            .then(res => {
                console.log("Successfully update the DBID in dbinfo table.");
            })
            .catch((err) => {
                console.error("Failed to write the DBID to the dbinfo table:", err);
            })

        // Request the server to generate a frontend DBID
        const generateRes = await reqGenerateFrontDBID({ dbID: dbId });
        if (generateRes.status) {
            await importCryptoKey(generateRes.data.cryptoKey);
            db["dbinfo"].add({ infoname: "frontdbid", infovalue: generateRes.data.frontDbID })
                .then(res => {
                    console.log("Successfully wrote the frontdbid to dbinfo.");
                })
                .catch((err) => {
                    console.error("Failed to write the frontdbid to the dbinfo table:", err);
                })
        } else {
            console.error("Failed to write the DBID to the dbinfo table:", generateRes.msg);
        }
    }

    // Request the latest cached data from the server
    await reqAllDocCache();
};
// Clear all content in the front-end database
export const clearAllDocCache = async () => {
    for (let [key] of docTable) {
        await clearLocalDb(key);
    };
};
// Request the latest cached data from the server
export const reqAllDocCache = async () => {
    for (let [key] of docTable) {
        await InitDocCache(key);
    };
}
// Clear all content in the front-end  table
export const clearLocalDb = async (docName) => {
    // Clear all data from the table
    await db[docName].clear()
    // Delete record in tsinfo table
    await db["tsinfo"].delete(docName);
};
// Get Archive list from server for front-end cache
export const InitDocCache = async (docName) => {
    // Get Master Data latest TimeStamp
    const latestTsRes = await db.tsinfo.where("docname").equals(docName).toArray();
    // Get Local database table detail
    const docInfo = docTable.get(docName);
    // Get Archive list from server
    if (latestTsRes.length === 0) {
        // If there are no records in the tsinfo table,
        // this means that all records need to be retrieved
        const res = await docInfo.reqAllFunc(false);
        if (res.status) {
            if (res.data.length === 0) {
                return
            }
            const latestTs = res.data[0].ts;
            const itemAll = await docInfo.transToFrontFunc(res.data);
            // Update the tsinfo table                         
            db.tsinfo.add({ docname: docName, ts: latestTs })
                .then(res => {
                    console.log("Update " + docInfo.description + " latest Ts successfull.");
                })
                .catch((err) => {
                    console.error("Update " + docInfo.description + " latest Ts failed:", err);
                })
            db[docName].bulkAdd(itemAll);
            return
        }
    } else {
        // If there are records in the tsinfo table,
        // this means onle the latest changed data needs to be retrieved.        
        const queryTs = latestTsRes[0].ts;
        const cacheRes = await docInfo.reqCacheFunc({ queryTs: queryTs }, false);
        if (cacheRes.status) {
            const docCache = cacheRes.data;
            if (docCache.resultNumber > 0) {
                // The most recently deleted data.
                if (docCache.delItems !== null) {
                    let keys = [];
                    docCache.delItems.forEach(item => {
                        keys.push(item.id);
                    });
                    // Delete archive
                    db[docName].bulkDelete(keys);
                }
                // The most recently added data.
                if (docCache.newItems !== null) {
                    let newItems = await docInfo.transToFrontFunc(docCache.newItems);
                    db[docName].bulkAdd(newItems);
                }

                // The most recently modified data.
                if (docCache.updateItems !== null) {
                    let transUpdateItems = await docInfo.transToFrontFunc(docCache.updateItems);
                    transUpdateItems.forEach(item => {
                        db[docName].update(item.id, item);
                    })
                }
            }
            // update the tsinfo table
            db.tsinfo.update(docName, { ts: docCache.resultTs });
        } else {
            console.error("Get latest " + docInfo.description + " cache failed:", cacheRes.msg);
        }
    }
};
// Get Local Master Data Cache
export const GetLocalCache = async (archive) => {
    let result = [];
    if (tableEncrypted[archive]) {
        const encryptedArr = await db[archive].toArray();
        result = await decryptDataArr(encryptedArr);
    } else {
        result = await db[archive].toArray();
    }
    return result;
};
// Query data using anyOf
export const GetCacheAnyOf = async (archive, key, arr) => {
    let result = [];

    if (tableEncrypted[archive]) {
        const encryptedArr = await db[archive].where(key).anyOf(arr).toArray();
        result = await decryptDataArr(encryptedArr);
    } else {
        result = await db[archive].where(key).anyOf(arr).toArray();
    }
    return result;
};
// Get the User-defined Archive list based on User-define Category ID
export const GetUDACache = async (categoryID) => {
    const udds = await db.uda.where("udc.id").equals(categoryID).toArray();
    return udds;
};
// Get the Execution Project list based on Execution Project Category ID
export const GetEPCacheByCategoryId = async (categoryID) => {
    return await db.epa.where("epc.id").equals(categoryID).toArray();
};
// Get the Construction Site Archive list based on Construction Site Category ID
export const GetCSACacheByCategoryId = async (categoryID) => {
    return await db["csa"].where("csc.id").equals(categoryID).toArray();
};
// Get Person list based on Postion ID
export const GetPersonsWithPositions = async (positionID) => {
    let persons = await db["person"].where("positionID").anyOf(positionID).and(person => person.status === 0).toArray();
    const decryptPersons = await decryptDataArr(persons);
    return decryptPersons;
};
// Convert EP frontend data to backend-consumable data
export function transEPToBackend(epa) {
    const newEpa = cloneDeep(epa);
    switch (newEpa.resultType.id) {
        case 301:
            newEpa.defaultValueDisp = newEpa.defaultValue;
            newEpa.errorValueDisp = newEpa.errorValue;
            break;
        case 306:
            newEpa.defaultValueDisp = newEpa.defaultValue === "" ? "" : dayjs(newEpa.defaultValue).format("YYYY-MM-DD");
            newEpa.errorValueDisp = newEpa.errorValue === "" ? "" : dayjs(newEpa.errorValue).format("YYYY-MM-DD");
            break;
        case 307:
            newEpa.defaultValueDisp = newEpa.defaultValue === "" ? "" : dayjs(newEpa.defaultValue).format("YYYY-MM-DD HH:mm");
            newEpa.errorValueDisp = newEpa.errorValue === "" ? "" : dayjs(newEpa.errorValue).format("YYYY-MM-DD HH:mm");
            break;
        case 302:
            newEpa.defaultValue = newEpa.defaultValue.toString();
            newEpa.defaultValueDisp = newEpa.defaultValue;
            newEpa.errorValue = newEpa.errorValue.toString();
            newEpa.errorValueDisp = newEpa.errorValue;
            break;
        case 401:
            newEpa.defaultValueDisp = newEpa.defaultValue === 0 ? "" : newEpa.defaultValue === 1 ? "male" : "female";
            newEpa.defaultValue = newEpa.defaultValue.toString();
            newEpa.errorValueDisp = newEpa.errorValue === 0 ? "" : newEpa.errorValue === 1 ? "male" : "female";
            newEpa.errorValue = newEpa.errorValue.toString();
            break;
        case 404:
            newEpa.defaultValueDisp = newEpa.defaultValue === 0 ? "N" : newEpa.defaultValue === 1 ? "Y" : "";
            newEpa.defaultValue = newEpa.defaultValue.toString();
            newEpa.errorValueDisp = newEpa.errorValue === 0 ? "N" : newEpa.errorValue === 1 ? "Y" : "";
            newEpa.errorValue = newEpa.errorValue.toString();
            break;
        case 510:
        case 520:
        case 525:
        case 530:
        case 540:
        case 550:
            newEpa.defaultValueDisp = newEpa.defaultValue.name;
            newEpa.defaultValue = newEpa.defaultValue.id.toString();
            newEpa.errorValueDisp = newEpa.errorValue.name;
            newEpa.errorValue = newEpa.errorValue.id.toString();
            break;
        default:
            console.error("No matching DataType");
    }
    return newEpa;
};
// Convert EPs frontend data to backend-consumble data
export const transEPsToBackend = async (epas) => {
    const newEpas = cloneDeep(epas);
    async function transEpas() {
        for (let newEpa of newEpas) {
            switch (newEpa.resultType.id) {
                case 301:
                    newEpa.defaultValueDisp = newEpa.defaultValue;
                    newEpa.errorValueDisp = newEpa.errorValue;
                    break;
                case 306:
                    newEpa.defaultValueDisp = newEpa.defaultValue === "" ? "" : dayjs(newEpa.defaultValue).format("YYYY-MM-DD");
                    newEpa.errorValueDisp = newEpa.errorValue === "" ? "" : dayjs(newEpa.errorValue).format("YYYY-MM-DD");
                    break;
                case 307:
                    newEpa.defaultValueDisp = newEpa.defaultValue === "" ? "" : dayjs(newEpa.defaultValue).format("YYYY-MM-DD HH:mm");
                    newEpa.errorValueDisp = newEpa.errorValue === "" ? "" : dayjs(newEpa.errorValue).format("YYYY-MM-DD HH:mm");
                    break;
                case 302:
                    newEpa.defaultValue = newEpa.defaultValue.toString();
                    newEpa.defaultValueDisp = newEpa.defaultValue;
                    newEpa.errorValue = newEpa.errorValue.toString();
                    newEpa.errorValueDisp = newEpa.errorValue;
                    break;
                case 401:
                    newEpa.defaultValueDisp = newEpa.defaultValue === 0 ? "" : newEpa.defaultValue === 1 ? "male" : "female";
                    newEpa.defaultValue = newEpa.defaultValue.toString();
                    newEpa.errorValueDisp = newEpa.errorValue === 0 ? "" : newEpa.errorValue === 1 ? "male" : "female";
                    newEpa.errorValue = newEpa.errorValue.toString();
                    break;
                case 404:
                    newEpa.defaultValueDisp = newEpa.defaultValue === 0 ? "N" : newEpa.defaultValue === 1 ? "Y" : "";
                    newEpa.defaultValue = newEpa.defaultValue.toString();
                    newEpa.errorValueDisp = newEpa.errorValue === 0 ? "N" : newEpa.errorValue === 1 ? "Y" : "";
                    newEpa.errorValue = newEpa.errorValue.toString();
                    break;
                case 510:
                case 520:
                case 525:
                case 530:
                case 540:
                case 550:
                    newEpa.defaultValueDisp = newEpa.defaultValue.name;
                    newEpa.defaultValue = newEpa.defaultValue.id.toString();
                    newEpa.errorValueDisp = newEpa.errorValue.name;
                    newEpa.errorValue = newEpa.errorValue.id.toString();
                    break;
                default:
                    console.error("No matching DataType");
            }
        }
    }
    await transEpas();
    return newEpas;
};

// Convert EPT frontend data to backend-consumble data
export function transEPTToBackend(ept) {
    // Copy Data
    const newEit = cloneDeep(ept);
    delete newEit.createDate;
    delete newEit.modifyDate;
    newEit.body.map((row) => {
        switch (row.epa.resultType.id) {
            case 301:
                row.defaultValueDisp = row.defaultValue;
                row.errorValueDisp = row.errorValue;
                break;
            case 306:
                row.defaultValueDisp = row.defaultValue === "" ? "" : dayjs(row.defaultValue, "YYYYMMDD").format("YYYY-MM-DD");
                row.errorValueDisp = row.errorValue === "" ? "" : dayjs(row.errorValue, "YYYYMMDD").format("YYYY-MM-DD");
                break;
            case 307:
                row.defaultValueDisp = row.defaultValue === "" ? "" : dayjs(row.defaultValue, "YYYYMMDDHHmm").format("YYYY-MM-DD HH:mm");
                row.errorValueDisp = row.errorValue === "" ? "" : dayjs(row.errorValue, "YYYYMMDDHHmm").format("YYYY-MM-DD HH:mm");
                break;
            case 302:
                row.defaultValue = row.defaultValue.toString();
                row.defaultValueDisp = row.defaultValue;
                row.errorValue = row.errorValue.toString();
                row.errorValueDisp = row.errorValue;
                break;
            case 401:
                row.defaultValueDisp = row.defaultValue === 0 ? "" : row.defaultValue === 1 ? "male" : "female";
                row.defaultValue = row.defaultValue.toString();
                row.errorValueDisp = row.errorValue === 0 ? "" : row.errorValue === 1 ? "male" : "female";
                row.errorValue = row.errorValue.toString();
                break;
            case 404:
                row.defaultValueDisp = row.defaultValue === 0 ? "N" : row.defaultValue === 1 ? "Y" : "";
                row.defaultValue = row.defaultValue.toString();
                row.errorValueDisp = row.errorValue === 0 ? "" : row.errorValue === 1 ? "Y" : "N";
                row.errorValue = row.errorValue.toString();
                break;
            case 510:
            case 520:
            case 525:
            case 530:
            case 540:
            case 550:
                row.defaultValueDisp = row.defaultValue.name;
                row.defaultValue = row.defaultValue.id.toString();
                row.errorValueDisp = row.errorValue.name;
                row.errorValue = row.errorValue.id.toString();
                break;
            default:
                console.error("No matching DataType");
        }
        row.epa.defaultValue = "";
        row.epa.errorValue = "";
        return row;
    });
    return newEit;
}
// Convert EPTs frontend data to backend-consumble data
export const transEPTsToBackend = async (epts) => {
    const newEits = cloneDeep(epts);
    async function transEits() {
        for (let newEit of newEits) {
            delete newEit.createDate;
            delete newEit.modifyDate;
            for (let row of newEit.body) {
                switch (row.epa.resultType.id) {
                    case 301:
                        row.defaultValueDisp = row.defaultValue;
                        row.errorValueDisp = row.errorValue;
                        break;
                    case 306:
                        row.defaultValueDisp = row.defaultValue === "" ? "" : dayjs(row.defaultValue, "YYYYMMDD").format("YYYY-MM-DD");
                        row.errorValueDisp = row.errorValue === "" ? "" : dayjs(row.errorValue, "YYYYMMDD").format("YYYY-MM-DD");
                        break;
                    case 307:
                        row.defaultValueDisp = row.defaultValue === "" ? "" : dayjs(row.defaultValue, "YYYYMMDDHHmm").format("YYYY-MM-DD HH:mm");
                        row.errorValueDisp = row.errorValue === "" ? "" : dayjs(row.errorValue, "YYYYMMDDHHmm").format("YYYY-MM-DD HH:mm");
                        break;
                    case 302:
                        row.defaultValue = row.defaultValue.toString();
                        row.defaultValueDisp = row.defaultValue;
                        row.errorValue = row.errorValue.toString();
                        row.errorValueDisp = row.errorValue;
                        break;
                    case 401:
                        row.defaultValueDisp = row.defaultValue === 0 ? "" : row.defaultValue === 1 ? "male" : "female";
                        row.defaultValue = row.defaultValue.toString();
                        row.errorValueDisp = row.errorValue === 0 ? "" : row.errorValue === 1 ? "male" : "female";
                        row.errorValue = row.errorValue.toString();
                        break;
                    case 404:
                        row.defaultValueDisp = row.defaultValue === 0 ? "N" : row.defaultValue === 1 ? "Y" : "";
                        row.defaultValue = row.defaultValue.toString();
                        row.errorValueDisp = row.errorValue === 0 ? "N" : row.errorValue === 1 ? "Y" : "";
                        row.errorValue = row.errorValue.toString();
                        break;
                    case 510:
                    case 520:
                    case 525:
                    case 530:
                    case 540:
                    case 550:
                        row.defaultValueDisp = row.defaultValue.name;
                        row.defaultValue = row.defaultValue.id.toString();
                        row.errorValueDisp = row.errorValue.name;
                        row.errorValue = row.errorValue.id.toString();
                        break;
                    default:
                        console.error("No matching DataType:", row);
                }
                row.epa.defaultValue = "";
                row.epa.errorValue = "";
            }
        }
    }
    await transEits();
    return newEits;
}
