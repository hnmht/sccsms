
export interface ServerSoftInfo {
    scSoftName?: string;
    scServerVersion?: string;
    scServerState?: string;
    maxUserNumber?: number;
    author?: string
}

export interface OrganizationInfo {
    registerFlag?: number;
    organizationID?: number;
    organizationCode?: string;
    organizationName?: string;
    contactPerson?: string;
    contactTitle?: string;
    phone?: string;
    email?: string;
    registerTime?: string
}

export interface ServerInfo {
    dbID?: string;
    serialNumber?: string;
    macArray?: string;
    machineHash?: string;
    machineID?: string;
    publicKey?: string;
    dbVersion?: string;
    timeZone?: string;
    utcOffset?: string;
    organization?: OrganizationInfo;
    serverSoft?: ServerSoftInfo;
}


export interface AppInfo {
    dbID: string;
    token: string;
    serverAddr: string;
    globalPath: string;
    serverInfo: ServerInfo;
    isOffline: 0 | 1;
}