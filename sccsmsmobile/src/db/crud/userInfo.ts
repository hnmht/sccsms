import { executeSQL } from "../db";
import { name } from "../../../app.json";
import { UserInfo } from "../../dataType/types/user";
import { getEmptyFile } from "../../dataType/dataZero/file";
import { getEmptyPerson } from "../../dataType/dataZero/person";
import { getEmptySimpDept } from "../../dataType/dataZero/department";

// Retrieve User Info from database
export function queryUserInfo(): UserInfo {
    let sqlStr = `select json(userinfo) as userinfo from appinfo where appname='${name}' limit 1`
    let { rows } = executeSQL(sqlStr);
    let userInfo: UserInfo = {
        id: 0,
        code: "",
        name: "",
        token: "",
        avatar: getEmptyFile(),
        menuList: [],
        person: getEmptyPerson(),
        department: getEmptySimpDept(),
    };
    if (rows && rows.length > 0) {
        userInfo = JSON.parse(rows._array[0].userinfo);
    }
    return userInfo;
}

// Write UserInfo into database
export function saveUserInfo(userInfo:UserInfo) {
    let userInfoJson = JSON.stringify(userInfo);
    let sqlStr = `update appinfo set userinfo='${userInfoJson}' where appname='${name}'`;
    executeSQL(sqlStr);
}