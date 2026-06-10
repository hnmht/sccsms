import { open, QueryResult, QuickSQLiteConnection } from "react-native-quick-sqlite";
import { dbName, appVersion, name } from "../../app.json";
import { createTableSQL, dropAllTableSQL } from "./schema";
import { UserInfo } from "../dataType/types/user";
import { getLocales, Locale } from "react-native-localize"
import { normalizeLocale } from "../utils/normalizeLocale";
import { Person } from "../dataType/types/person";
import { SimpDept } from "../dataType/types/department";

// Open or Create Database
export const DB: QuickSQLiteConnection = open({ name: dbName, location: "default" });

// Initialize database
export function initDb() {
    // Check if the DB exist
    if (!DB) {
        console.error("Open Database failed!")
        return
    }

    //Drop all Table
    // DB.executeBatch(dropAllTableSQL);
    // Check if the sysinfo exist
    let res: QueryResult = DB.execute("select name from sqlite_master where type='table' and name='appinfo'");
    if (res.rows && res.rows.length === 0) {
        // create table
        DB.executeBatch(createTableSQL);
    }

    // Check if there is data in the sysinfo table
    res = DB.execute(`select isfinish from appinfo where appname='${name}'`);
    if (res.rows && res.rows.length === 0) {
        const emptyPerson: Person = {
            id: 0,
            code: "",
            name: "",
            avatar: { id: 0, fileUrl: "", dr: 0, source: "" },
            deptID: 0,
            deptCode: "",
            deptName: "",
            isOperator: 1,
            positionID: 0,
            positionName: "",
            description: "",
            mobile: "",
            email: "",
            gender: 0,
            systemFlag: 0,
            status: 0,
            createDate: "1970-01-01T08:00:00+08:00",
            ts: "1970-01-01T08:00:00+08:00",
            dr: 0
        };
        const emptySimpDept: SimpDept = {
            id: 0,
            code: "",
            name: "",
            fatherID: 0,
            leader: emptyPerson,
            description: "",
            status: 0,
            createDate: "1970-01-01T08:00:00+08:00",
            ts: "1970-01-01T08:00:00+08:00",
            dr: 0
        };
        const emptyUserInfo: UserInfo =
        {
            id: 0,
            code: "",
            name: "",
            avatar: { id: 0, fileUrl: "", dr: 0, source: "" },
            token: "",
            menuList: [],
            person: emptyPerson,
            department: emptySimpDept,
            mobile: "",
            email: "",
            gender: 1,
            description: ""
        };
        const userStr: string = JSON.stringify(emptyUserInfo)
        DB.execute(`insert into appinfo(appname,appversion,dbid,serveraddr,globalpath,
            token,serverinfo,isoffline,isfinish,userinfo) 
        VALUES('${name}','${appVersion}','','','',
        '','${JSON.stringify({})}',0,1,'${userStr}')`);
    }
    // Check if the locale table contains data
    res = DB.execute(`select languagetag from lang where appname='${name}'`);
    if (res.rows && res.rows.length === 0) {
        // Get the current device language
        const locales = getLocales();
        const currentLocale: Locale = locales[0];
        const languageTag = normalizeLocale(currentLocale.languageTag);
        const sqlString = `insert into lang(appname,languagetag) VALUES('${name}','${languageTag}')`;
        DB.execute(sqlString);
    } else {
        console.log("Current Language:", res.rows?._array[0]["languagetag"]);
    }
    console.log("Complete DB Initialize...");
}

// Close Database
export function closeDB() {
    if (DB) {
        DB.close();
    }
}
// Execute Query
export function executeSQL(sqlString: string): QueryResult {
    try {
        const dbRes = DB.execute(sqlString);
        return dbRes;
    } catch (err) {
        console.log("DB.execute failed, sql:", sqlString, " error:", err);
        const dbRes: QueryResult = {
            rowsAffected: 0,
        }
        return dbRes;
    }
}
// Execute SQL With Parameters
export function executeSQLWithParams(sqlString: string, params: any[]): QueryResult {
    try {
        return DB.execute(sqlString, params);
    } catch (err) {
        console.log("DB.execute with params failed, sql:", sqlString, " params:", params, " Error:", err);
        throw err;
    }
}
// Execute Transaction
export async function withTransaction(fn: () => Promise<void> | void) {
    try {
        DB.execute("BEGIN TRANSACTION");
        await fn();
        DB.execute("COMMIT");
    } catch (e) {
        DB.execute("ROLLBACK");
        console.error("Transaction rollback:", e);
        throw e;
    }
}

// Delete Table Data
export function clearTableData(tableName: string): QueryResult {
    const sqlStr = `delete from ${tableName}`;
    return DB.execute(sqlStr);
}

