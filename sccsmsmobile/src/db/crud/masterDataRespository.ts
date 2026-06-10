import { executeSQL, executeSQLWithParams, withTransaction } from "../db";
import { getEmptyQueryParams } from "../../dataType/dataZero/pubic";
import { APIResponse } from "../../dataType/types/response";

export interface MasterDataRepoConfig<T, TCache> {
    table: string;
    recentTable: string;
    primaryKey: string;
    primaryPath: string;
    valueField: string;
    fieldsMap: Record<string, string>;
    emptyFn: () => T;
    convertToFront: (data: T[]) => T[];
    getFullData: (loading: boolean) => Promise<APIResponse<T[]>>;
    getCacheData: (params: TCache, loading: boolean) => Promise<APIResponse<TCache>>;
    extractTs: (item: T) => string;
    extractId: (item: T) => number;
}

export function getByPath(obj: any, path: string) {
    return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
}

export class MasterDataRepository<T, TCache extends {
    queryTs: string;
    resultNumber: number;
    delItems: T[];
    updateItems: T[];
    newItems: T[];
    resultTs: string;
}> {
    constructor(private cfg: MasterDataRepoConfig<T, TCache>) { console.log(`${cfg.table} constructor.`) }
    // Initialize Cache
    async initCache() {
        const { getFullData, getCacheData, table } = this.cfg;
        console.log(`${table} Initialize Cache`);
        const ts = this.getLatestTs();
        if (ts === "") {
            const res = await getFullData(false);
            if (res.status && res.data.length > 0) {
                const latestTs = this.cfg.extractTs(res.data[0]);
                await withTransaction(async () => {
                    await this.bulkAdd(res.data);
                    this.addTs(latestTs);
                })
            }
        } else {
            const empty = getEmptyQueryParams<TCache>(ts);
            const cacheRes = await getCacheData(empty, false);
            if (cacheRes.status) {
                const cache = cacheRes.data;
                if (cache.resultNumber > 0) {
                    await withTransaction(async () => {
                        await this.bulkDel(cache.delItems);
                        await this.bulkAdd(cache.newItems);
                        await this.bulkUpdate(cache.updateItems);
                        this.updateTs(cache.resultTs);
                    });
                }
            }
        }
    }

    // Batch add 
    async bulkAdd(originItems: T[]) {
        if (!originItems || originItems.length === 0) return;
        const { table, valueField, fieldsMap, primaryKey, primaryPath, convertToFront } = this.cfg;
        // Convert Data
        const items = convertToFront(originItems);
        // Generate Insert SQL
        const fields = Object.keys(fieldsMap);
        const columns = primaryKey + ", " + fields.join(", ") + ", " + valueField;
        const placeholders = "?, " + fields.map(() => "?").join(", ") + ", ?";
        const sql = `INSERT OR IGNORE INTO ${table}(${columns}) VALUES(${placeholders})`;

        items.forEach(item => {
            const params: any[] = [];
            params.push(getByPath(item, primaryPath));
            for (const key of fields) {
                params.push(getByPath(item, fieldsMap[key]));
            }
            params.push(JSON.stringify(item));
            executeSQLWithParams(sql, params);
        });
    }
    // Batch Update
    async bulkUpdate(originItems: T[]) {
        if (!originItems || originItems.length === 0) return;
        const { table, valueField, fieldsMap, primaryKey, primaryPath, recentTable, convertToFront } = this.cfg;
        const items = convertToFront(originItems);
        const hasRecentTable = recentTable !== "";
        // Generate Update SQL
        const fields = Object.keys(fieldsMap);
        const setFields = fields.map(f => `${f}=?`).join(", ") + `, ${valueField}=?`;
        const sql = `UPDATE ${table} SET ${setFields} WHERE ${primaryKey}=?`;
        let sqlRec = "";
        if (hasRecentTable) {
            sqlRec = `UPDATE ${recentTable} SET ${setFields} WHERE ${primaryKey}=?`;
        }
        items.forEach(item => {
            const params: any[] = [];
            for (const key of fields) {
                params.push(getByPath(item, fieldsMap[key]));
            }
            params.push(JSON.stringify(item));
            params.push(getByPath(item, primaryPath));
            executeSQLWithParams(sql, params);
            if (hasRecentTable) {
                executeSQLWithParams(sqlRec, params);
            }
        });
    }
    // Batch Delete
    async bulkDel(items: T[]) {
        if (!items || items.length === 0) return;
        const { table, recentTable, primaryKey } = this.cfg;
        const hasRecentTable = recentTable !== "";
        const sql = `DELETE FROM ${table} WHERE ${primaryKey}=?`;
        let sqlRec = "";
        if (hasRecentTable) {
            sqlRec = `DELETE FROM ${recentTable} WHERE ${primaryKey}=?`;
        }

        items.forEach(item => {
            const id = this.cfg.extractId(item);
            executeSQLWithParams(sql, [id]);
            if (hasRecentTable) {
                executeSQLWithParams(sqlRec, [id]);
            }
        });

    }

    // Add recent used
    addRecent(item: T) {
        const { primaryKey, primaryPath, recentTable, fieldsMap, valueField } = this.cfg;
        if (recentTable === "") {
            return
        }
        // Generate Insert SQL
        const fields = Object.keys(fieldsMap);
        const columns = primaryKey + ", " + fields.join(", ") + ", " + valueField;
        const placeholders = "?, " + fields.map(() => "?").join(", ") + ", ?";
        const sql = `INSERT OR IGNORE INTO ${recentTable}(${columns}) VALUES(${placeholders})`;
        const params: any[] = [];
        params.push(getByPath(item, primaryPath));
        for (const key of fields) {
            const path = fieldsMap[key];
            params.push(getByPath(item, path));
        }
        params.push(JSON.stringify(item));
        executeSQLWithParams(sql, params);
    }

    // Delete recent used
    deleteRecent(item: T) {
        if (!item) return;
        const { recentTable, primaryKey } = this.cfg;
        if (recentTable === "") {
            return
        }
        const sqlRec = `DELETE FROM ${recentTable} WHERE ${primaryKey}=?`;
        const id = this.cfg.extractId(item);
        executeSQLWithParams(sqlRec, [id]);

    }
    // Get Detail by ID
    getDetailByID(id: number): T {
        const { table, primaryKey, valueField, emptyFn } = this.cfg;
        let data: T = emptyFn();
        if (id === 0) {
            return data;
        }
        const sql = `select ${valueField} from ${table} where ${primaryKey}=? limit 1`;
        const { rows } = executeSQLWithParams(sql, [id]);

        if (rows && rows.length > 0) {
            data = JSON.parse(rows._array[0][valueField]);
        }
        return data;
    }
    // Get All Local master data
    getAllData(): T[] {
        const { table, valueField } = this.cfg;
        const sql = `select ${valueField} from ${table}`
        const { rows } = executeSQL(sql);
        if (!rows || rows.length === 0) return [];
        return rows._array.map((i: any) => JSON.parse(i[valueField]));
    }
    // Query Data
    queryData(criteria: string): T[] {
        const { table, valueField } = this.cfg;
        const sql = `select ${valueField} from ${table} where ${criteria}`;
        const { rows } = executeSQL(sql);
        if (!rows || rows.length === 0) return [];
        return rows._array.map((i: any) => JSON.parse(i[valueField]));
    }

    // Get recent used
    getRecent(): T[] {
        const { recentTable, valueField } = this.cfg;
        if (recentTable === "") {
            return [];
        }
        const sql = `SELECT ${valueField} FROM ${recentTable} ORDER BY autoid DESC`;
        const { rows } = executeSQL(sql);
        if (!rows || rows.length === 0) return [];
        return rows._array.map((i: any) => JSON.parse(i[valueField]));
    }

    // Query recent used 
    queryRecent(criteria: string): T[] {
        const { recentTable, valueField } = this.cfg;
        if (recentTable === "") {
            return [];
        }
        const sql = `SELECT ${valueField} FROM ${recentTable} where ${criteria} ORDER BY autoid DESC`;
        const { rows } = executeSQL(sql);
        if (!rows || rows.length === 0) return [];
        return rows._array.map((i: any) => JSON.parse(i[valueField]));
    }


    // Add Ts
    addTs(ts: string) {
        const { table } = this.cfg;
        const sql = `INSERT OR IGNORE INTO tsinfo(dataname,ts) VALUES(?,?)`;
        const params: any[] = [table, ts];
        executeSQLWithParams(sql, params);
    }

    // Update Ts
    updateTs(ts: string) {
        const { table } = this.cfg;
        const sql = `update tsinfo set ts=? where dataname=?`;
        const params: any[] = [ts, table]
        executeSQLWithParams(sql, params);
    }

    // Get Latest Ts
    getLatestTs(): string {
        const { table } = this.cfg;
        const sql = "select ts from tsinfo where dataname=? limit 1";
        const params: any[] = [table];
        let ts = "";
        const { rows } = executeSQLWithParams(sql, params)
        if (rows && rows.length > 0) {
            ts = rows._array[0].ts;
        }
        return ts;
    }


}



