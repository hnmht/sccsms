import { executeSQL, withTransaction, executeSQLWithParams } from "../db";
import { WorkOrderRow } from "../../dataType/types/workorder";
const dataName = "workorderref";

// Bulk Save Work Order References
export async function bulkSaveWORefs(refs: WorkOrderRow[]) {
    // Delete existing records
    let delStr = `delete from ${dataName}`;
    executeSQL(delStr);
    if (Array.isArray(refs) && refs.length === 0) {
        return
    }
    // Insert new records
    await withTransaction(async () => {
        refs.forEach(ref => {
            const sqlStr = `insert into ${dataName}(id,hid,billdate,billnumber,status,ts,value) values(?,?,?,?,?,?,?)`;
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
// Change Work Order Reference Status
export function updateWORefStatus(id: number, status: number) {
    const sqlStr = `update ${dataName} set status=? where id=?`;
    executeSQLWithParams(sqlStr, [status, id]);
}

// Get Local Work Order References
export function getLocalWOR(): WorkOrderRow[] {
    let sqlStr = `select json(value) as value from ${dataName} where status=1`;
    let { rows } = executeSQL(sqlStr);
    let docs: WorkOrderRow[] = [];
    if (rows && rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}