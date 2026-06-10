export type NumOpts = {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    style?: "decimal" | "currency" | "percent";
    currency?: string;
    useGrouping?: boolean;
};