import { dayjs, i18n } from "./dayjs";
import { NumOpts } from "../dataType/types/local";

export function formatNumber(value: number, opts: NumOpts = {}): string {
    const locale = (i18n?.language || dayjs.locale() || "en-US").replace("_", "-");

    // try to read your custom locale config if present
    const localeData: any = (dayjs.localeData && (dayjs.localeData() as any)) || {};
    const cfg = localeData.numberFormats || {};

    const minimumFractionDigits = opts.minimumFractionDigits ?? cfg.minimumFractionDigits ?? 0;
    const maximumFractionDigits = opts.maximumFractionDigits ?? cfg.maximumFractionDigits ?? 2;
    const useGrouping = opts.useGrouping ?? true;

    if (typeof Intl !== "undefined" && typeof Intl.NumberFormat === "function") {
        const nf = new Intl.NumberFormat(locale, {
            minimumFractionDigits,
            maximumFractionDigits,
            useGrouping,
            style: opts.style,
            currency: opts.currency,
        } as Intl.NumberFormatOptions);
        return nf.format(value);
    }

    // fallback
    const fixed = value.toFixed(maximumFractionDigits);
    return useGrouping ? fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : fixed;
}