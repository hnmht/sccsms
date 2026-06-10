import { IssueResolutionForm } from "../../dataType/types/issueResolutionForm";
import { VoucherRepository } from "./voucherRespository";

export const IRFRepo = new VoucherRepository<IssueResolutionForm>({
    table: "issueresolutionform",
    primaryKey: "id",
});