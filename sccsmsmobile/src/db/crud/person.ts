import { reqGetPersons, reqGetPersonsCache } from "../../api/person";
import { Person, PersonCache } from "../../dataType/types/person";
import { MasterDataRepository } from "./masterDataRespository";
import { getEmptyPerson } from "../../dataType/dataZero/person";

// Person
const fixFileUrl = (url: string | undefined) => {
    if (!url) return "";
    return url.replace(
        /(\d+)(jpg|jpeg|png|webp)(\?|$)/i,
        (_m, id, ext, tail) => `${id}.${ext}${tail}`
    );
};

export const personRepo = new MasterDataRepository <Person, PersonCache>({
    table: "person",
    recentTable: "person_recent",
    primaryKey: "id",
    primaryPath: "id",
    valueField: "value",
    fieldsMap: {
        "code":"code",
        "name": "name",
        "deptid":"deptID",
        "positionid":"positionID",
        "ts": "ts",
    },
    emptyFn:getEmptyPerson,
    convertToFront: (data: Person[]) =>
        data.map(p => ({
            ...p,
            avatar: {
                ...p.avatar,
                fileUrl: fixFileUrl(p.avatar?.fileUrl),
            },
        })),
    getFullData: reqGetPersons,
    getCacheData: reqGetPersonsCache,
    extractTs: d => d.ts!,
    extractId: d => d.id,
});



