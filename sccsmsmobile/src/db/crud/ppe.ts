import { reqGetPPEList, reqGetPPECache } from "../../api/ppe";
import { MasterDataRepository } from "./masterDataRespository";
import { PPE, PPECache } from "../../dataType/types/ppe";
import { getEmptyPPE } from "../../dataType/dataZero/ppe";

// Personal Protective Equipment
export const PPERepo = new MasterDataRepository<PPE, PPECache>({
    table: "ppe",
    recentTable: "ppe_recent",
    primaryKey: "id",
    primaryPath: "id",
    valueField: "value",
    fieldsMap: {
        "name": "name",
        "status": "status",
        "ts": "ts",
    },
    emptyFn: getEmptyPPE,
    convertToFront: (data: PPE[]) => data,
    getFullData: reqGetPPEList,
    getCacheData: reqGetPPECache,
    extractTs: d => d.ts!,
    extractId: d => d.id,
});