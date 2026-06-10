export enum ScDataTypeList {
    Text = 301,
    Number = 302,
    Password = 303,
    Mobile = 304,
    Email = 305,
    Date = 306,
    DateTime = 307,
    DateDisp = 308,
    DateTimeDisp = 309,

    Gender = 401,
    SwitchYesOrNo = 402,
    CheckYesOrNo = 403,
    SelectYesOrNo = 404,
    VoucherStatus = 405,

    Person = 510,
    SimpDept = 520,
    SimpCSC = 525,
    UserDefineCategory = 530,
    SimpEPC = 540,
    UserDefinedArchive = 550,
    ExecutionProject = 560,
    ConstructionSite = 570,
    EPT = 580,
    RiskLevel = 590,
    SimpDC = 600,
    Position = 610,
    TC = 620,
    PPE = 630,

    AvatarUpload = 901,
    FileUpload = 902,
}


export interface ScDataType {
    id: ScDataTypeList;
    code: string;
    name: string;
    dataType: string;
    frontDb: string;
    inputMode: string;
}

