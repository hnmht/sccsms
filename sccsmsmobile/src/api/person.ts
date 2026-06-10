import { Person, PersonCache } from "../dataType/types/person";
import { APIResponse } from "../dataType/types/response";
import request from "../utils/request";

// Get Person list
export function reqGetPersons(isLoading: boolean = true): Promise<APIResponse<Person[]>> {
    return request({
        url: "/person/list",
        method: 'post',
        isLoading
    });
}

// Get latest Person front-end cache
export function reqGetPersonsCache(data: PersonCache, isLoading: boolean = true): Promise<APIResponse<PersonCache>> {
    return request({
        url: "/person/cache",
        method: "post",
        data,
        isLoading
    })
}

