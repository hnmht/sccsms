import { storeObject,readObject,removeItem } from "./storage";

const tokenKey = "sccsToken";
// Read token from local storage
export const getToken = () => {
    return readObject(tokenKey);
};

// Write token to local storage
export const setToken = (token) => {
    storeObject(tokenKey,token);
};

// Remove token from local storage
export const removeToken = () => {
    removeItem(tokenKey);
};