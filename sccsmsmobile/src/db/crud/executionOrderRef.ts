import { ReferExecutionOrder } from "../../dataType/types/executionOrder";
import { executeSQL, executeSQLWithParams, withTransaction } from "../db";

const dataName = "executionorderref";

// Bulk Save Execution Order References
export async function bulkSaveEoRefs(refs: ReferExecutionOrder[]) {
    let delStr = `delete from ${dataName}`;
    executeSQL(delStr);
    // Delete existing records
    if (Array.isArray(refs) && refs.length === 0) {
        return
    }
    await withTransaction(async () => {
        const sqlStr = `insert into ${dataName}(id,hid,billdate,billnumber,status,ts,value) values(?,?,?,?,?,?,?)`;
        refs.forEach(ref => {
            const params = [
                ref.id,
                ref.hid,
                ref.billDate,
                ref.billNumber,
                ref.status,
                ref.ts,
                JSON.stringify(ref)
            ];
            executeSQLWithParams(sqlStr, params);
        });
    });
}

// Change Execution Order Reference Status
export function updateEoRefStatus(id: number, status: number) {
    const sqlStr = `update ${dataName} set status=? where id=?`;
    executeSQLWithParams(sqlStr, [status, id]);
}

// Get Local Execution Order References
export function getLocalEOR(): ReferExecutionOrder[] {
    const sqlStr = `select json(value) as value from ${dataName} where status=1`;
    const { rows } = executeSQL(sqlStr);
    const docs: ReferExecutionOrder[] = [];
    if (rows && rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}