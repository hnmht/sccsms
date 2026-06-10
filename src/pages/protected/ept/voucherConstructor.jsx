
export const bodyColumns = [
    { id: "action", label: "action", alignment: "center",width:80,maxWidth:80, minWidth: 80, visible: true, allowNul: true, sortField: "action", sort: true, display: { type: 0, cell1: null } },
    { id: "rowNumber", label: "rowNumber", alignment: "left", width: 60, maxWidth: 60, minWidth: 60, visible: true, allowNul: true, sortField: "rowNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "epa", label: "epa", alignment: "left", width: 260, maxWidth: 512, minWidth: 80, visible: true, allowNul: false, sortField: "epa.name", sort: true, display: { type: 0, cell1: null } },
    { id: "riskLevel", label: "riskLevel", alignment: "left", width: 150, maxWidth: 200, minWidth: 60, visible: true, allowNul: false, sortField: "riskLevel", sort: true, display: { type: 0, cell1: null } },
    { id: "allowDelRow", label: "allowDeletion", alignment: "left", width: 60, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "allowDelRow", sort: true, display: { type: 0, cell1: null } },
    { id: "description", label: "description", alignment: "left", width: 260, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "description", sort: true, display: { type: 0, cell1: null } }, 
    { id: "defaultValue", label: "defaultValue", alignment: "left", width: 200, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "defaultValue", sort: true, display: { type: 0, cell1: null } },
    { id: "isCheckError", label: "isCheckError", alignment: "left", width: 100, maxWidth: 128, minWidth: 20, visible: true, allowNul: true, sortField: "isCheckError", sort: true, display: { type: 0, cell1: null } },
    { id: "errorValue", label: "errorValue", alignment: "left", width: 200, maxWidth: 512, minWidth: 20, visible: true, allowNul: true, sortField: "errorValue", sort: true, display: { type: 0, cell1: null } },
    { id: "isRequireFile", label: "isRequireFile", alignment: "left", width: 60, maxWidth: 128, minWidth: 20, visible: true, allowNul: true, sortField: "isRequireFile", sort: true, display: { type: 0, cell1: null } },
    { id: "isOnSitePhoto", label: "isOnSitePhoto", alignment: "left", width: 60, maxWidth: 128, minWidth: 20, visible: true, allowNul: true, sortField: "isOnSitePhoto", sort: true, display: { type: 0, cell1: null } },
];

export const voucherRow = {
    id: 0,
    hid: 0,
    rowNumber: 10,
    epa: {
        id: 0,
        code: "",
        name: "",
        epc: { id: 0, name: "", description: "", fatherID: 0, status: 0 },
        description: "",
        status: 0,
        resultType: { id: 301, name: "text", dataType: "string", inputMode: "input" },
        udc: { id: 0, name: "", description: "" },
        defaultValue: "",
        isCheckError: 0,
        errorValue: "",
        isRequireFile: 0,
        isOnSitePhoto: 0,
        riskLevel:{id:0,name:"",color:"white",description:""}
    },
    allowDelRow:1,
    description: "",
    defaultValue: "",
    defaultValueDisp: "",
    isCheckError: 0,
    errorValue: "",
    errorValueDisp: "",
    isRequireFile: 0,
    isOnSitePhoto: 0,
    riskLevel: { id: 0, name: "", color: "white", description: "" },
    dr: 0,
};

