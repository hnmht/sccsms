import { SimpDept } from "./department";
import { ScFile } from "./file";
import { Person } from "./person";
import { SystemMenus } from "./sysMenu";
// User Information
export interface UserInfo {
    id: number,
    code: string,
    name: string,
    mobile: string;
    email: string;
    gender: 0 | 1 | 2;
    description:string;
    avatar: ScFile,
    token: string,
    menuList: SystemMenus,
    person: Person,
    department: SimpDept
}
