import { AppInfo, ServerInfo } from "../types/appInfo";

export function getEmptyServerInfo(): ServerInfo {
    const serverInfo: ServerInfo = {
        dbID: "",
        serialNumber: "",
        macArray: "",
        machineHash: "",
        machineID: "",
        publicKey: "",
        dbVersion: "",
        timeZone: "",
        utcOffset: "",
        organization: {},
        serverSoft: {},
    }
    return serverInfo;
}

export function getEmptyAppInfo(): AppInfo {
    const appInfo: AppInfo = {
        dbID: "",
        token: "",
        serverAddr: "",
        globalPath: "",
        serverInfo: getEmptyServerInfo(),
        isOffline: 0,
    }
    return appInfo;
}