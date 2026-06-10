import { cloneDeep } from "lodash";

interface BaseNode {
    id: number | string;
    fatherID: number | string | null;
}

type TreeResult<T> = T & {
    children?: TreeResult<T>[];
}

export function toTree<T extends BaseNode>(list: T[], parId: T['fatherID']): TreeResult<T>[] {
    const newList: TreeResult<T>[] = cloneDeep(list);
    const len = newList.length;

    function loop(pId: T['fatherID']): TreeResult<T>[] {
        const res: TreeResult<T>[] = [];

        for (let i = 0; i < len; i++) {
            const item = newList[i];

            if (item.fatherID === pId) {
                const child = loop(item.id);
                if (child.length > 0) {
                    item.children = child;
                }
                res.push(item);
            }
        }
        return res;
    }

    return loop(parId);
}