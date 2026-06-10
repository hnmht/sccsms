import { QueryResult } from "react-native-quick-sqlite";
import { name } from "../../../app.json"
import { executeSQL, executeSQLWithParams } from "../db";

// Get language
export function getLanguage(): string {
    const sqlStr = `select languagetag from lang where appname='${name}'`;
    const { rows } = executeSQL(sqlStr);
    let languageTag = "en-US";
    if (rows && rows.length > 0) {
        languageTag = rows._array[0]["languagetag"];
    }
    return languageTag;
}

// Set languate
export function setLanguage(languageTag: string): QueryResult {
    const sql = `update lang set languagetag=? where  appname=?`;
    const params = [languageTag, name]
    return executeSQLWithParams(sql, params);
}
