
export const storeString = (storageKey,value) => {
    try {
        localStorage.setItem(storageKey,value);
    } catch(err) {
        console.log("storeString error:",err);
    }
};

export const storeObject = (storageKey,value) => {
    try {
        const jsonVlaue = JSON.stringify(value);
        localStorage.setItem(storageKey,jsonVlaue);
    } catch(err) {
        console.log("storeObject error:",err);
    }
};

export const readString = (storageKey) => {
    try {
        const value = localStorage.getItem(storageKey);
        return value !== null  ? value : null;
    } catch(err) {
        console.err("readString error:",err);
        return null;
    }
};

export const readObject = (storageKey) => {
    try {
        const jsonValue = localStorage.getItem(storageKey);
        return jsonValue !== null ? JSON.parse(jsonValue) :null;
    } catch(err) {
        console.err("readObject error:",err);
        return null;
    }
};

export const removeItem = (storageKey) => {
    try {
        localStorage.removeItem(storageKey);
    } catch(err) {
        console.log("removeItem error:",err);
    }
};

export const removeAll = () => {
    try {
        localStorage.clear();
    } catch(err) {
        console.log("removeAll error:",err);
    }
};