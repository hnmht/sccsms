import request from "../utils/request";

// Get Person list
export function reqGetPersons(isLoading=true) {
    return request({
        url: "/person/list",
        method: 'post',
        isLoading
    });
}

// Get latest Person front-end cache
export function reqGetPersonsCache(data,isLoading=true) {
    return request({
        url:"/person/cache",
        method:"post",
        data,
        isLoading
    })
}

