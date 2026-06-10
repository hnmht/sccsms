import { ExecutionOrderRow } from "../../dataType/types/executionOrder";

export function eorHasIssue(eoRows: ExecutionOrderRow[]): boolean {
    let issueNumber: number = 0;
    eoRows.forEach((row) => {
        if (row.isIssue > 0) {
            issueNumber++
        }
    })
    return issueNumber > 0;
}