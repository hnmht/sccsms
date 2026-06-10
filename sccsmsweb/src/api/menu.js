import request from "../utils/request";

// Get User Menu
export  function reqMenu(isLoading = false) {
    return request({
        url: "/user/getmenu",
        method: 'post',
        isLoading
    });
}