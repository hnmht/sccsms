import { reqGetCSOs, reqGetCSOCache } from "../../api/cso";
import { getEmptyCSO } from "../../dataType/dataZero/cso";
import { ConstructionSiteOption, ConstructionSiteOptionCache } from "../../dataType/types/cso";
import { MasterDataRepository } from "./masterDataRespository";

// Construction Site Options
export const CSORepo = new MasterDataRepository<ConstructionSiteOption, ConstructionSiteOptionCache>({
    table: "cso",
    recentTable: "",
    primaryKey: "id",
    primaryPath: "id",
    valueField: "value",
    fieldsMap: {
        "code": "code",
        "name": "name",
        "ts": "ts",
    },
    emptyFn: getEmptyCSO,
    convertToFront: (data: ConstructionSiteOption[]) => data,
    getFullData: reqGetCSOs,
    getCacheData: reqGetCSOCache,
    extractTs: d => d.ts!,
    extractId: d => d.id,
});