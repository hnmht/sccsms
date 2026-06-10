import { ExecutionOrder } from "../../dataType/types/executionOrder";
import { VoucherRepository } from "./voucherRespository";

export const EORepo = new VoucherRepository<ExecutionOrder>({
    table: "executionorder",
    primaryKey: "id",
});
