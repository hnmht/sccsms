import { reqGetEPList, reqGetEPCache } from "../../api/epa";
import { EPCache, ExecutionProject } from "../../dataType/types/epa";
import { MasterDataRepository } from "./masterDataRespository";
import { personRepo } from "./person";
import { simpDeptRepo } from "./department";
import { simpCSCRepo } from "./csc";
import { UDARepo } from "./uda";
import { UDCRepo } from "./udc";
import { simpEPCRepo } from "./epc";
import { getEmptyEP } from "../../dataType/dataZero/epa";

// Execution Order convert to Frontend 
const transEPsToFrontend = (eps: ExecutionProject[]): ExecutionProject[] => {
    for (let newEP of eps) {
        switch (newEP.resultType.id) {
            case 301:
            case 306:
            case 307:
                break;
            case 302:
                newEP.defaultValue = parseFloat(newEP.defaultValue);
                newEP.errorValue = parseFloat(newEP.errorValue);
                break;
            case 401:
            case 404:
                newEP.defaultValue = parseInt(newEP.defaultValue);
                newEP.errorValue = parseInt(newEP.errorValue);
                break;
            case 510:
                newEP.defaultValue = personRepo.getDetailByID(parseInt(newEP.defaultValue));
                newEP.errorValue = personRepo.getDetailByID(parseInt(newEP.errorValue));
                break
            case 520:
                newEP.defaultValue = simpDeptRepo.getDetailByID(parseInt(newEP.defaultValue));
                newEP.errorValue = simpDeptRepo.getDetailByID(parseInt(newEP.errorValue));
                break;
            case 525:
                newEP.defaultValue = simpCSCRepo.getDetailByID(parseInt(newEP.defaultValue));
                newEP.errorValue = simpCSCRepo.getDetailByID(parseInt(newEP.errorValue));
                break;
            case 530:
                newEP.defaultValue = UDCRepo.getDetailByID(parseInt(newEP.defaultValue));
                newEP.errorValue = UDCRepo.getDetailByID(parseInt(newEP.errorValue));
                break;
            case 540:
                newEP.defaultValue = simpEPCRepo.getDetailByID(parseInt(newEP.defaultValue));
                newEP.errorValue = simpEPCRepo.getDetailByID(parseInt(newEP.errorValue));
                break;
            case 550:
                newEP.defaultValue = UDARepo.getDetailByID(parseInt(newEP.defaultValue));
                newEP.errorValue = UDARepo.getDetailByID(parseInt(newEP.errorValue));
                break;
            default:
                console.error("No matching DataType");
                throw new Error("transEPsToFrontend failed: No matching DataType");
        }
    }
    return eps;
};

// Execution Project Archive
export const EPARepo = new MasterDataRepository<ExecutionProject, EPCache>({
    table: "epa",
    recentTable: "epa_recent",
    primaryKey: "id",
    primaryPath: "id",
    valueField: "value",
    fieldsMap: {
        "code": "code",
        "name": "name",
        "epcid": "epc.id",
        "resulttypeid": "resultType.id",
    },
    emptyFn: getEmptyEP,
    convertToFront: transEPsToFrontend,
    getFullData: reqGetEPList,
    getCacheData: reqGetEPCache,
    extractTs: d => d.ts!,
    extractId: d => d.id,
});


