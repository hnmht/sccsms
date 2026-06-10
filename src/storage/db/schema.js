// Define indexedDB name
export const dbName = "scDb";
// Define the database table schema
export const table = {
    dbinfo: "infoname",
    tsinfo: "docname,ts",
    department: "id,status,ts",
    person: "id,deptID,positionID,status,ts",
    udc: "id,status,ts",
    uda: "id,udc.id,status,ts",
    epc: "id,status,ts",
    csc: "id,status,ts",
    cso: "id,code,status,ts",
    csa: "id,code,csc.id,status,ts",
    epa: "id,code,epc.id,resultType.id,status,ts",
    ept: "id,code,status,ts",
    risklevel: "id,status,ts",
    dc: "id,status,ts",
    position: "id,status,ts",
    tc: "id,status,ts",
    ppe: "id,status,ts",
};

// Define wether the table needs to be encrypted.
export const tableEncrypted = {
    dbinfo: false,
    tsinfo: false,
    department: false,
    person: true,
    udc: false,
    uda: false,
    epc: false,
    csc: false,
    cso: false,
    csa: false,
    epa: false,
    ept: false,
    risklevel: false,
    dc: false,
    position: false,
    tc: false,
    ppe: false,
};
 

// Field selector
export const pickFields = (data, fieldsStr) => {
    const fields = fieldsStr.split(",").map(f => f.trim());
    const result = {};
    fields.forEach(field => {
        const keys = field.split(".");
        let src = data;
        let dst = result;
        keys.forEach((key, idx) => {
            if (src == null || !(key in src)) return; 
            if (idx === keys.length - 1) {
                dst[key] = src[key];
            } else {
                dst[key] = dst[key] || {};
                dst = dst[key];
                src = src[key];
            }
        });
    });
    return result;
};

