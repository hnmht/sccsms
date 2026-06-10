import { reqGetEPTList, reqGetEPTCache } from "../../api/ept";
import { getEmptyEPT } from "../../dataType/dataZero/ept";
import { EPT, EPTCache } from "../../dataType/types/ept";
import { MasterDataRepository } from "./masterDataRespository";
import { personRepo } from "./person";
import { simpDeptRepo } from "./department";
import { simpCSCRepo } from "./csc";
import { UDARepo } from "./uda";
import { UDCRepo } from "./udc";
import { simpEPCRepo } from "./epc";

// EPT convert to Frontend
const transEPTsToFrontend = (epts: EPT[]): EPT[] => {
    for (let ept of epts) {
        for (let row of ept.body) {
            switch (row.epa.resultType.id) {
                case 301:
                case 306:
                case 307:
                    break;
                case 302:
                    row.defaultValue = parseFloat(row.defaultValue);
                    row.errorValue = parseFloat(row.errorValue);
                    row.epa.defaultValue = parseFloat(row.epa.defaultValue);
                    row.epa.errorValue = parseFloat(row.epa.errorValue);
                    break;
                case 401:
                case 404:
                    row.defaultValue = parseInt(row.defaultValue);
                    row.errorValue = parseInt(row.errorValue);
                    row.epa.defaultValue = parseInt(row.epa.defaultValue);
                    row.epa.errorValue = parseInt(row.epa.errorValue);
                    break;
                case 510:
                    row.defaultValue = personRepo.getDetailByID(parseInt(row.defaultValue));
                    row.errorValue = personRepo.getDetailByID(parseInt(row.errorValue));
                    break;
                case 520:
                    row.defaultValue = simpDeptRepo.getDetailByID(parseInt(row.defaultValue));
                    row.errorValue = simpDeptRepo.getDetailByID(parseInt(row.errorValue));
                    row.epa.defaultValue = simpDeptRepo.getDetailByID(parseInt(row.epa.defaultValue));
                    row.epa.errorValue = simpDeptRepo.getDetailByID(parseInt(row.epa.errorValue));
                    break;
                case 525:
                    row.defaultValue = simpCSCRepo.getDetailByID(parseInt(row.defaultValue));
                    row.errorValue = simpCSCRepo.getDetailByID(parseInt(row.errorValue));
                    row.epa.defaultValue = simpCSCRepo.getDetailByID(parseInt(row.epa.defaultValue));
                    row.epa.errorValue = simpCSCRepo.getDetailByID(parseInt(row.epa.errorValue));
                    break;
                case 530:
                    row.defaultValue = UDCRepo.getDetailByID(parseInt(row.defaultValue));
                    row.errorValue = UDCRepo.getDetailByID(parseInt(row.errorValue));
                    row.epa.defaultValue = UDCRepo.getDetailByID(parseInt(row.epa.defaultValue));
                    row.epa.errorValue = UDCRepo.getDetailByID(parseInt(row.epa.errorValue));
                    break;
                case 540:
                    row.defaultValue = simpEPCRepo.getDetailByID(parseInt(row.defaultValue));
                    row.errorValue = simpEPCRepo.getDetailByID(parseInt(row.errorValue));
                    row.epa.defaultValue = simpEPCRepo.getDetailByID(parseInt(row.epa.defaultValue));
                    row.epa.errorValue = simpEPCRepo.getDetailByID(parseInt(row.epa.errorValue));
                    break;
                case 550:
                    row.defaultValue = UDARepo.getDetailByID(parseInt(row.defaultValue));
                    row.errorValue = UDARepo.getDetailByID(parseInt(row.errorValue));
                    row.epa.defaultValue = UDARepo.getDetailByID(parseInt(row.epa.defaultValue));
                    row.epa.errorValue = UDARepo.getDetailByID(parseInt(row.epa.errorValue));
                    break;
                default:
                    console.error("No matching DataType");
                    throw new Error("transEPTsToFrontend failed: No matching DataType");
            }
        }
    }
    return epts;
};


// Execution Project Template
export const EPTRepo = new MasterDataRepository<EPT, EPTCache>({
    table: "ept",
    recentTable: "ept_recent",
    primaryKey: "id",
    primaryPath: "id",
    valueField: "value",
    fieldsMap: {
        "code": "code",
        "name": "name",
        "status": "status",
        "ts": "ts",
    },
    emptyFn: getEmptyEPT,
    convertToFront: transEPTsToFrontend,
    getFullData: reqGetEPTList,
    getCacheData: reqGetEPTCache,
    extractTs: d => d.ts!,
    extractId: d => d.id,
});
