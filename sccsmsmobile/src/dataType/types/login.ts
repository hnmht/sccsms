export interface ParamLogin {
    userCode:string;
    password:string;
}

export interface ParamChangePwd {
    id:number;
    code?:string;
    name?:string;
    password:string;
    newPassword:string;
    confirmNewPassword:string;
}