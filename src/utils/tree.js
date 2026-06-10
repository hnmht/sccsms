import { cloneDeep } from "lodash";
// Array to Tree
export function toTree(list, parId) {
    let newList = cloneDeep(list);
    let len = newList.length;
    function loop(parId) {
        let res = [];
        for (let i = 0; i < len; i++) {
            let item = newList[i];
            if (item.fatherID === parId) {
                let child = loop(item.id)
                if (child.length > 0) {
                    item.children = loop(item.id);
                }
                res.push(item);
            }
        }
        return res;
    }
    return loop(parId);
}
// Tree to Array
export function treeToArr(tree) {
    let res = [];
    tree.forEach(el => {
        res.push(el);
        el.children && res.push(...treeToArr(el.children))
    })
    return res;
}

// Find all parent items in an array
export function findParents(arr1, id1) {
    let parents = [];
    let forFn = function (arr, id) {
        // Get Parent ID
        let fatherId = -1;
        for (let index = 0; index < arr.length; index++) {
            if (arr[index].id === id) {
                fatherId = arr[index].fatherID;
                break
            }
        }
        // Get Parents
        for (let i = 0; i < arr.length; i++) {           
            if (arr[i].id === fatherId) {
                parents.push(arr[i]);            
                forFn(arr, arr[i].id)
                break
            }
        }
    }
    forFn(arr1, id1);
    return parents;
}

// Find all sub-items in an array
export function findChildrens(arr1, id1) {
    let childrens = [];
    let forFn = function (arr, id) {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i].fatherID === id) {
                childrens.push(arr[i]);
                forFn(arr, arr[i].id);
            }
        }
    }
    forFn(arr1, id1);
    return childrens;
}