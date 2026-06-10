import { reqGetCSList, reqGetCSCache } from "../../api/csa";
import { getEmptyCSA } from "../../dataType/dataZero/csa";
import { ConstructionSite, ConstructionSiteCache } from "../../dataType/types/csa";
import { MasterDataRepository } from "./masterDataRespository";

// Construction Site
export const CSRepo = new MasterDataRepository<ConstructionSite, ConstructionSiteCache>({
    table: "csa",
    recentTable: "csa_recent",
    primaryKey: "id",
    primaryPath: "id",
    valueField: "value",
    fieldsMap: {
        "code": "code",
        "name": "name",
        "cscid": "csc.id",
        "status": "status",
        "ts": "ts",
    },
    emptyFn: getEmptyCSA,
    convertToFront: (data: ConstructionSite[]) => data,
    getFullData: reqGetCSList,
    getCacheData: reqGetCSCache,
    extractTs: d => d.ts!,
    extractId: d => d.id,
});