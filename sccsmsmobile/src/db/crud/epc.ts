import { reqGetSimpEPCList, reqGetSimpEPCCache } from "../../api/epc";
import { MasterDataRepository } from "./masterDataRespository";
import { SimpEPC, SimpEPCCache } from "../../dataType/types/epc";
import { getEmptySimpEPC } from "../../dataType/dataZero/epc";


// Simple Execution Project Catetory
export const simpEPCRepo = new MasterDataRepository<SimpEPC, SimpEPCCache>({
    table: "epc",
    recentTable: "epc_recent",
    primaryKey: "id",
    primaryPath: "id",
    valueField: "value",
    fieldsMap: {       
        "name": "name",
        "status": "status",
        "ts": "ts",
    },
    emptyFn: getEmptySimpEPC,
    convertToFront: (data: SimpEPC[]) => data,
    getFullData: reqGetSimpEPCList,
    getCacheData: reqGetSimpEPCCache,
    extractTs: d => d.ts!,
    extractId: d => d.id,
});
