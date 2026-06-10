import request from "../utils/request";

// Get Landing Page info
export function reqLandingPageInfo(isLoading = true) {
    return request({
        url: "/land/get",
        method: "post",
        isLoading
    });
}