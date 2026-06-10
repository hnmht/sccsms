import { reqGetPositionCache, reqGetPositionList } from "../../api/position";
import { MasterDataRepository } from "./masterDataRespository";
import { Position, PositionCache } from "../../dataType/types/postion";
import { getEmptyPosition } from "../../dataType/dataZero/position";
// Position
export const positionRepo = new MasterDataRepository<Position, PositionCache>({
    table: "position",
    recentTable: "position_recent",
    primaryKey: "id",
    primaryPath: "id",
    valueField: "value",
    fieldsMap: {
        "name": "name",
        "status": "status",
        "ts": "ts",
    },
    emptyFn: getEmptyPosition,
    convertToFront: (data: Position[]) => data,
    getFullData: reqGetPositionList,
    getCacheData: reqGetPositionCache,
    extractTs: d => d.ts!,
    extractId: d => d.id,
});
