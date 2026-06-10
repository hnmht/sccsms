import { name } from "../../app.json";
import { clearTableData, executeSQL } from "./db";
import { saveDBID } from "./crud/appInfo";

import { simpDeptRepo } from "./crud/department";
import { simpCSCRepo } from "./crud/csc";
import { CSRepo } from "./crud/csa";
import { CSORepo } from "./crud/cso";
import { simpDCRepo } from "./crud/dc";
import { personRepo } from "./crud/person";
import { simpEPCRepo } from "./crud/epc";
import { UDCRepo } from "./crud/udc";
import { riskLevelRepo } from "./crud/risklevel";
import { UDARepo } from "./crud/uda";
import { EPARepo } from "./crud/epa";
import { EPTRepo } from "./crud/ept";
import { positionRepo } from "./crud/position";
import { TCRepo } from "./crud/tc";
import { PPERepo } from "./crud/ppe";
// Local database table array
const localTables: string[] = [
    "appinfo",
    "lang",
    'tsinfo',
    'department',
    'department_recent',
    'epa',
    'epa_recent',
    'epc',
    'epc_recent',
    'ept',
    'ept_recent',
    'person',
    'person_recent',
    'csa',
    'csa_recent',
    'csc',
    'csc_recent',
    'cso',
    'udc',
    'udc_recent',
    `risklevel`,
    `risklevel_recent`,
    `dc`,
    `dc_recent`,
    `position`,
    `position_recent`,
    `tc`,
    `tc_recent`,
    `ppe`,
    `ppe_recent`,
    'uda',
    'uda_recent',
    'workorderref',
    'executionorderref',
    'workorder',
    'executionorder',
    'issueresolutionform'
];

// Initialize Local Data
export const initLoaclData = async (newDbid: string) => {
    // Get existing dbid
    let dbid = getLocalDBID();
    if (dbid === "") {//if no dbid exists, save the new one
        dbid = newDbid;
        // Save dbid to local appinfo table
        saveDBID(dbid);
    }
    // Check if the new dbid is different from the existing one
    if (newDbid !== dbid) {// If different, it means a different server has logged in
        // Clear all table data
        localTables.forEach(tableName => {
            clearTableData(tableName);
        });
    }

    // Request all repos to initialize their caches
    await simpDeptRepo.initCache();
    await simpEPCRepo.initCache();
    await personRepo.initCache();
    await simpCSCRepo.initCache();
    await CSRepo.initCache();
    await CSORepo.initCache();
    await UDCRepo.initCache();
    await riskLevelRepo.initCache();
    await UDARepo.initCache();
    await EPARepo.initCache();
    await EPTRepo.initCache();
    await simpDCRepo.initCache();    
    await positionRepo.initCache();
    await TCRepo.initCache();
    await PPERepo.initCache();
};

// Get DBID
const getLocalDBID = () => {
    let sqlStr = `select dbid from appinfo where appname='${name}' limit 1`;
    let { rows } = executeSQL(sqlStr);
    let dbid = "";
    if (rows && rows.length > 0) {
        dbid = rows._array[0].dbid;
    }
    return dbid;
};