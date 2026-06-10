/**
 * 根据路径字符串获取对象中的值
 */
export function getValue<
    T extends Record<string, any>,
    R = any
>(obj: T, path: string): R {
    if (typeof path !== "string") {
        throw new Error("参数类型错误");
    }
    const keys = path.split(".");
    let result: any = obj;
    for (const key of keys) {
        if (result != null && key in result) {
            result = result[key];
        } else {
            throw new Error("传入取值路径有误");
        }
    }

    return result as R;
}

export type SortOrder = "asc" | "desc";

export interface SortField<T> {
    field: keyof T | string; // 允许嵌套路径
    order?: SortOrder;
}

/**
 * 多字段排序
 */
export function multiSortByArr<T>(
    sortFields: SortField<T>[]
) {
    return (a: T, b: T): number => {
        for (const item of sortFields) {
            const { field, order = "asc" } = item;
            const rev = order === "desc" ? -1 : 1;

            let aValue: any;
            let bValue: any;

            if (typeof field === "string" && field.includes(".")) {
                aValue = getValue(a as any, field);
                bValue = getValue(b as any, field);
            } else {
                aValue = a[field as keyof T];
                bValue = b[field as keyof T];
            }

            if (aValue !== bValue) {
                if (aValue > bValue) return rev;
                if (aValue < bValue) return -rev;
            }
        }

        return 0;
    };
}