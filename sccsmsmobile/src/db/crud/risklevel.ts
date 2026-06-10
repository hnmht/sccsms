import { reqGetRLList, reqGetRLsCache } from "../../api/riskLevel";
import { MasterDataRepository } from "./masterDataRespository";
import { RiskLevel,RLCache} from "../../dataType/types/riskLevel";
import { getEmptyRiskLevel } from "../../dataType/dataZero/riskLevel";

// Risk Level
export const riskLevelRepo = new MasterDataRepository<RiskLevel, RLCache>({
    table: "risklevel",
    recentTable: "risklevel_recent",
    primaryKey: "id",
    primaryPath: "id",
    valueField: "value",
    fieldsMap: {
        "name": "name",
        "status": "status",
        "ts": "ts",
    },
    emptyFn: getEmptyRiskLevel,
    convertToFront: (data: RiskLevel[]) => data,
    getFullData: reqGetRLList,
    getCacheData: reqGetRLsCache,
    extractTs: d => d.ts!,
    extractId: d => d.id,
});