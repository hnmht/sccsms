export function formatWithThousands(value: string) {
    if (!value) return "";

    // 处理中间态
    if (
        value === "-" ||
        value === "." ||
        value === "-."
    ) {
        return value;
    }

    const isNegative = value.startsWith("-");
    const normalized = isNegative ? value.slice(1) : value;

    const [integer, decimal] = normalized.split(".");

    const formattedInt = integer
        ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : "";

    const result =
        decimal !== undefined
            ? `${formattedInt}.${decimal}`
            : formattedInt;

    return isNegative ? `-${result}` : result;
}

export function sanitizeInput(text: string) {
    let value = text.replace(/,/g, "");

    // 只保留数字、小数点、负号
    value = value.replace(/[^\d.-]/g, "");

    // 负号只能在最前面
    value = value.replace(/(?!^)-/g, "");

    // 只允许一个小数点
    value = value.replace(/(\..*)\./g, "$1");

    return value;
}

export function parseToNumber(value: string): number  {
    if (
        value === "" ||
        value === "-" ||
        value === "." ||
        value === "-."
    ) {
        return 0;
    }

    const num = Number(value);
    return Number.isNaN(num) ? 0 : num;
}

