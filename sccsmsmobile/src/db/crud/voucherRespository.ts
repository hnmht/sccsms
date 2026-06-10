import { executeSQL, executeSQLWithParams } from "../db";

export interface VoucherRepoConfig<T> {
    table: string;
    primaryKey: string;
}

export class VoucherRepository<T> {
    constructor(private cfg: VoucherRepoConfig<T>) { console.log(`${cfg.table} constructor.`) }
    saveVoucher(voucher: T, userId: number): void {
        console.log(`Saving voucher to table ${this.cfg.table}`);
        const { table } = this.cfg;
        // Implementation for saving voucher
        const sql = `insert into ${table} (creatorid,value) values (?,?)`;
        const params = [userId, JSON.stringify(voucher)];
        executeSQLWithParams(sql, params);
    }
    getUserVouchers(userId: number): T[] {
        console.log(`Getting voucher for user ${userId} from table ${this.cfg.table}`);
        const vouchers: T[] = [];
        // Implementation for retrieving voucher
        const sql = `select id,value from ${this.cfg.table} where creatorid = ?`;
        const params = [userId];
        const { rows } = executeSQLWithParams(sql, params);
        if (rows && rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                const voucher = JSON.parse(rows._array[i].value);
                voucher.id = rows._array[i].id;
                vouchers.push(voucher);
            }
        }
        return vouchers;
    }
    getAllVouchers(): T[] {
        console.log(`Getting all vouchers from table ${this.cfg.table}`);
        const vouchers: T[] = [];
        // Implementation for retrieving all vouchers
        const sql = `select id,value from ${this.cfg.table}`;
        const { rows } = executeSQL(sql);
        if (rows && rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                const voucher = JSON.parse(rows._array[i].value);
                voucher.id = rows._array[i].id;
                vouchers.push(voucher);
            }
        }
        return vouchers;
    }
    delUserVouchers(userId: number): void {
        console.log(`Deleting voucher for user ${userId} from table ${this.cfg.table}`);
        // Implementation for deleting voucher
        const sql = `DELETE FROM ${this.cfg.table} WHERE creatorid=?`;
        const params = [userId];
        executeSQLWithParams(sql, params);
    }
    delAllVouchers(): void {
        console.log(`Deleting all vouchers from table ${this.cfg.table}`);
        // Implementation for deleting all vouchers
        const sql = `DELETE FROM ${this.cfg.table}`;
        executeSQL(sql);
    }
    delVoucher(voucher: T): void {
        console.log(`Delete Voucher in the table ${this.cfg.table}`);
        const sql = `delete from ${this.cfg.table} where id=?`;
        const params: any[] = [(voucher as any).id];
        executeSQLWithParams(sql, params);
    }
    editVoucher(voucher: T): void {
        console.log(`Editing voucher in table ${this.cfg.table}`);
        const sql = `UPDATE ${this.cfg.table} SET value=? WHERE id=?`;
        const params: any[] = [JSON.stringify(voucher), (voucher as any).id];
        executeSQLWithParams(sql, params);
    }
}