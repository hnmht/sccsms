import { UserInfo } from "../types/user";
import { getEmptyFile } from "./file";
import { getEmptyPerson } from "./person";
import { getEmptySimpDept } from "./department";

export function getEmptyUser(): UserInfo {
    const user: UserInfo = {
        id: 0,
        code: "",
        name: "",
        mobile: "",
        email: "",
        gender: 0,
        description: "",
        avatar: getEmptyFile(),
        token: "",
        menuList: [],
        person: getEmptyPerson(),
        department: getEmptySimpDept(),
    }
    return user;
}