import { reqGetUDAAll, reqGetUDACache } from "../../api/uda";
import { MasterDataRepository } from "./masterDataRespository";
import { UserDefinedArchive,UDACache } from "../../dataType/types/uda";
import { getEmptyUDA } from "../../dataType/dataZero/uda";

// User Define Archive
export const UDARepo = new MasterDataRepository<UserDefinedArchive, UDACache>({
    table: "uda",
    recentTable: "uda_recent",
    primaryKey: "id",
    primaryPath: "id",
    valueField: "value",
    fieldsMap: {
        "udcid": "udc.id",
        "status": "status",
        "ts": "ts",
    },
    emptyFn: getEmptyUDA,
    convertToFront: (data: UserDefinedArchive[]) => data,
    getFullData: reqGetUDAAll,
    getCacheData: reqGetUDACache,
    extractTs: d => d.ts!,
    extractId: d => d.id,
});