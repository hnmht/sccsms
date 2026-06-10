import request from "../utils/request";

// Get RSA Public key
export function reqGetPublicKey(isLoading=true) {
    return request({
        url: "/auth/publickey",
        method: "post",
        isLoading
    });
}