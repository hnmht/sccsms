import { executeSQL } from "../db";
import { name } from "../../../app.json";
import { AppInfo, ServerInfo } from "../../dataType/types/appInfo";
// Retrieve AppInfo from database
export function queryAppinfo(): AppInfo {
    let sqlStr = `select dbid,serveraddr,globalpath,token,serverinfo,isoffline from appinfo where appname='${name}' limit 1`;
    let { rows } = executeSQL(sqlStr);

    let appInfo: AppInfo = {
        dbID: "",
        token: "",
        serverAddr: "",
        globalPath: "",
        serverInfo: {},
        isOffline: 0,
    };

    if (rows && rows.length > 0) {
        appInfo = {
            dbID: rows._array[0].dbid,
            token: rows._array[0].token,
            serverAddr: rows._array[0].serveraddr,
            globalPath: rows._array[0].globalpath,
            serverInfo: JSON.parse(rows._array[0].serverinfo),
            isOffline: rows._array[0].isoffline
        };
    }
    return appInfo;
}

// Write Token into database
export function saveToken(token: string) {
    let sqlStr = `update appinfo set token='${token}' where appname='${name}'`;
    executeSQL(sqlStr);
}

// Write dbID into database
export function saveDBID(dbid: string) {
    let sqlStr = `update appinfo set dbid='${dbid}' where appname='${name}'`;
    executeSQL(sqlStr);
}

// Write server address into database
export function saveServerAddr(serveraddr:string) {
    let sqlStr = `update appinfo set serveraddr='${serveraddr}' where appname='${name}'`;
    executeSQL(sqlStr);
}
// Write gloabalPath into database
export function saveGlobalPath(globalpath:string) {
    let sqlStr = `update appinfo set globalpath='${globalpath}' where appname='${name}'`;
    executeSQL(sqlStr);
}

// Write ServerInfo into database
export function saveServerInfo(serverInfo:ServerInfo) {
    let sqlStr = `update appinfo set serverinfo='${JSON.stringify(serverInfo)}' where appname='${name}'`;
    executeSQL(sqlStr);
}

// Write isOffLine into database
export function saveIsOffLine(status:number) {
    let sqlStr = `update appinfo set isoffline=${status} where appname='${name}'`;
    executeSQL(sqlStr);
}