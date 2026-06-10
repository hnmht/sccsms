import { cloneDeep } from "lodash";

//  The method of sorting an array of objects by multiple attributes
//  Example：sortByArr([{field:"sales",order:"desc"},{field:"salebillno",order:"asc"}])
export function MultiSortByArr(arr) {
    return function (a, b) {
        for (let i = 0; i < arr.length; i++) {
            let attr = arr[i].field;
            let rev = 1;
            if (arr[i].order === "desc") {
                rev = -1;
            }
            let aValue, bValue;
            if (attr.indexOf(".") < 0) {
                aValue = a[attr];
                bValue = b[attr];
            } else {
                aValue = getValue(a, attr);
                bValue = getValue(b, attr);
            }
            if (aValue !== bValue) {
                if (aValue > bValue) {
                    return rev * 1;
                } else {
                    return rev * -1;
                }
            }       
        }
    }
}
// Move a specified element down one position in an array of objects
export function ArrayElementDownOne(arr, element, elementKey) {
    let newArr = cloneDeep(arr);
    let index = newArr.findIndex((value) => value[elementKey] === element[elementKey]);
    if (index < newArr.length - 1 && index >= 0) {
        [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
    }
    return newArr;
}
// Move a specified element up on position in an array of objects
export function ArrayElementUpOne(arr, element, elementKey) {
    let newArr = cloneDeep(arr);
    let index = newArr.findIndex((value) => value[elementKey] === element[elementKey]);
    if (index > 0) {
        [newArr[index], newArr[index - 1]] = [newArr[index - 1], newArr[index]];
    }
    return newArr;
}
// Move a specified element to the top of an array of objects
export function ArrayElementToTop(arr, element, elementKey) {
    let newArr = cloneDeep(arr);
    let index = newArr.findIndex((value) => value[elementKey] === element[elementKey]);
    if (index > 0) {
        newArr.unshift(newArr[index]);
        newArr.splice(index + 1, 1);
    }
    return newArr;
}
// Move a specified element to the bottom of an array of objects
export function ArrayElementToBottom(arr, element, elementKey) {
    let newArr = cloneDeep(arr);
    let index = newArr.findIndex((value) => value[elementKey] === element[elementKey]);
    if (index < arr.length - 1 && index >= 0) {
        newArr.push(newArr[index]);
        newArr.splice(index, 1);
    }
    return newArr;
}
// Deduplication of an array of objects
export function RemoveDupObjectArr(arr, uniId) {
    const res = new Map();
    return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
}
// Convert a number to a comma-separated string with two decimal places
export function ConvertFloatFormat(number) {
    let a = parseFloat(number);
    return a.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}







