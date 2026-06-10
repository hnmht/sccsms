import { reqGetUDCList, reqGetUDCsCache } from "../../api/udc";
import { MasterDataRepository } from "./masterDataRespository";
import { UserDefineCategory, UDCCache } from "../../dataType/types/udc";
import { getEmptyUDC } from "../../dataType/dataZero/udc";

// User Define Category
export const UDCRepo = new MasterDataRepository<UserDefineCategory, UDCCache>({
    table: "udc",
    recentTable: "udc_recent",
    primaryKey: "id",
    primaryPath: "id",
    valueField: "value",
    fieldsMap: {
        "name": "name",
        "status": "status",
        "ts": "ts",
    },
    emptyFn: getEmptyUDC,
    convertToFront: (data: UserDefineCategory[]) => data,
    getFullData: reqGetUDCList,
    getCacheData: reqGetUDCsCache,
    extractTs: d => d.ts!,
    extractId: d => d.id,
});