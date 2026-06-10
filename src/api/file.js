import request from "../utils/request";
// Upload Files
export function reqUploadFiles(data,isLoading=true) {
    return request({
        url: "/file/receive",
        method: "post",
        headers: { "Content-Type": "multipart/form-data" },        
        data,
        isLoading
    });
}
// Get file detail by file hash
export function reqGetFileByHash(data, isLoading = true) {
    return request({
        url: "/file/getfilebyhash",
        method: "post",
        data,
        isLoading
    });
}

// Get file details by hash array
export function reqGetFilesByHash(data, isLoading = true) {
    return request({
        url: "/file/getfilesbyhash",
        method: "post",
        data,
        isLoading
    });
}