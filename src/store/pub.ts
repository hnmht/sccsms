import RNFS from "react-native-fs";
import { reqUnReadComments, reqUserEORefs, reqUserWORefs } from "../api/message";
import { reqGetCSOs } from "../api/cso";
import { sortBy } from "lodash";
import { store } from "./index";
import { setDynamicEORefs, setDynamicMessages, setDynamicCSOs, setDynamicWORefs } from "./slice/dynamicData";
import { ConstructionSiteOption } from "../dataType/types/cso";
import { CommentMessage } from "../dataType/types/message";
import { WorkOrderRow } from "../dataType/types/workOrder";
import { ReferExecutionOrder } from "../dataType/types/executionOrder";
import { bulkSaveWORefs } from "../db/crud/workorderref";
import { bulkSaveEoRefs } from "../db/crud/executionOrderRef";

export async function getAllDynamicDataOnline() {
    // Request Construction Site Options
    const res = await reqGetCSOs();
    let csos: ConstructionSiteOption[] = [];
    if (res.status) {
        csos = res.data;
    }
    const sortedCSOs = sortBy(csos, ["id"], ["asc"]);
    store.dispatch(setDynamicCSOs(sortedCSOs));
    // Get unread messages
    await getDynamicMessages();
    // Get Execution Order References
    await getEORefsData();
    // Get Work Order References
    await getWORefsData();
};
// Request unread messages from server
export async function getDynamicMessages() {
    const res = await reqUnReadComments(false);
    let comments: CommentMessage[] = [];
    if (res.status) {
        comments = res.data;
    }
    store.dispatch(setDynamicMessages(comments));
};

// Request work order reference data from server
export async function getWORefsData() {
    let worRes = await reqUserWORefs();
    let worRefs: WorkOrderRow[] = [];
    if (worRes.status) {
        worRefs = worRes.data;
    }
    // Save work order references to local database
    bulkSaveWORefs(worRefs);
    // Update work order references in Redux store
    store.dispatch(setDynamicWORefs(worRefs));
}
// Request Exection Order reference data from server
export async function getEORefsData() {
    let eorRes = await reqUserEORefs();
    let eorRefs: ReferExecutionOrder[] = [];
    if (eorRes.status) {
        eorRefs = eorRes.data;
    }
    // Save execution order references to local database
    bulkSaveEoRefs(eorRefs);
    // Update execution order references in Redux store
    store.dispatch(setDynamicEORefs(eorRefs));
}

// Get Refer Execution Order with attachments
export const getEORefsDataWithImage = async () => {
    let eorRes = await reqUserEORefs();
    let eorRefs: ReferExecutionOrder[] = [];
    if (eorRes.status) {
        eorRefs = eorRes.data;
    }
    for (let i = 0; i < eorRefs.length; i++) {
        if (eorRefs[i].eoFiles && eorRefs[i].eoFiles.length > 0) {
            for (var ii = 0; ii < eorRefs[i].eoFiles.length; ii++) {
                const filePath = `${RNFS.DownloadDirectoryPath}/${eorRefs[i].eoFiles[ii].file.minioFileName}`;
                const fileExist = await RNFS.exists(filePath);
                if (!fileExist) {
                    await downLoadEOFile({
                        fromUrl: eorRefs[i].eoFiles[ii].file.fileUrl,
                        toFile: filePath
                    });
                }
                eorRefs[i].eoFiles[ii].file.fileUrl = `file://${filePath}`;
            }
        }
    }
    store.dispatch(setDynamicEORefs(eorRefs));
};

// Download Execution Order File
const downLoadEOFile = async (options: RNFS.DownloadFileOptions) => {
    await RNFS.downloadFile(options).promise;
}; 
