import { Dayjs } from "dayjs";
import { i18n, dayjs } from "./i18n";

const currentTimezone = dayjs.tz.guess();
export const EpochTime = dayjs.utc('1970-01-01 00:00:00').toISOString();

export const DateTimeFormat = (date: Dayjs | Date | string = dayjs(new Date()), formats: string = "L") => {
    if (!dayjs(date).isValid()) {
        return dayjs().format(formats);
    }
    return dayjs(date).format(formats);
};

export const ConvertToUnixSecond = (date: Dayjs | string | Date = dayjs(new Date())) => {
    return dayjs(date).unix();
};

export const CheckTimeEpoch= (date: Dayjs | string | Date = dayjs(new Date())): boolean => {
    if (!dayjs(date).isValid()) {
        return true;
    }

    return dayjs(date).toISOString() === EpochTime;
}

export {
    i18n,
    dayjs
}