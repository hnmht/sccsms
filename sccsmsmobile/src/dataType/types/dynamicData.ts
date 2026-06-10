import { ConstructionSiteOption } from "./cso";
import { ReferExecutionOrder } from "./executionOrder";
import { CommentMessage } from "./message";
import { WorkOrderRow } from "./workOrder";

export interface DynamicData {
    csos: ConstructionSiteOption[];
    eoRefs: ReferExecutionOrder[];
    messages: CommentMessage[];
    woRefs: WorkOrderRow[];
}