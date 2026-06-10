import { ExecutionOrder, ExecutionOrderRow, ReferExecutionOrder } from "../../dataType/types/executionOrder";
import { IssueResolutionForm } from "../../dataType/types/issueResolutionForm";
import { WorkOrder, WorkOrderRow } from "../../dataType/types/workOrder";

export interface WorkOrderParams {
    isLocal: boolean;
    isNew: boolean;
    isModify: boolean;
    oriWO: WorkOrder | undefined;
    onGoBack: (shouldRefresh: boolean) => void;
}

export interface ExecutionOrderParams {
    isLocal: boolean;
    isNew: boolean;
    isModify: boolean;
    oriWOR: WorkOrderRow | undefined;
    oriEO: ExecutionOrder | undefined;
    onGoBack: (shouldRefresh: boolean) => void;
}

export interface ExecutionOrderReviewParams {
    isLocal: boolean;
    isNew: boolean;
    isModify: boolean;
    oriWOR: WorkOrderRow | undefined;
    oriEO: ExecutionOrder | undefined;
    startTime: string;
    onGoBack: (shouldRefresh: boolean) => void;
}

export interface IssueResolutionFormParams {
    isLocal: boolean;
    isNew: boolean,
    isModify: boolean,
    oriEOR: ReferExecutionOrder | undefined;
    oriIRF: IssueResolutionForm | undefined;
    onGoBack: (shouldRefresh: boolean) => void;
}