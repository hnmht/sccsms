import { WorkOrder } from "../../dataType/types/workOrder";
import { VoucherRepository } from "./voucherRespository";

export const WORepo = new VoucherRepository<WorkOrder>({
    table: "workorder",
    primaryKey: "id",
});
