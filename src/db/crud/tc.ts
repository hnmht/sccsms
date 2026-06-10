import { reqGetTCList, reqGetTCCache } from "../../api/tc";
import { MasterDataRepository } from "./masterDataRespository";
import { TC, TCCache } from "../../dataType/types/tc";
import { getEmptyTC } from "../../dataType/dataZero/tc";
// Training Course
export const TCRepo = new MasterDataRepository<TC, TCCache>({
    table: "tc",
    recentTable: "tc_recent",
    primaryKey: "id",
    primaryPath: "id",
    valueField: "value",
    fieldsMap: {
        "name": "name",
        "status": "status",
        "ts": "ts",
    },
    emptyFn: getEmptyTC,
    convertToFront: (data: TC[]) => data,
    getFullData: reqGetTCList,
    getCacheData: reqGetTCCache,
    extractTs: d => d.ts!,
    extractId: d => d.id,
});