import { i18n, dayjs } from "./i18n";
const currentTimezone = dayjs.tz.guess();
const EpochTime = dayjs.utc('1970-01-01 00:00:00');

const DateTimeFormat = (date = new Date(), formats = "L") => {
    return dayjs(date).format(formats);
};
const DateTimeFormatSpec = (date = new Date(), formats = "L") => {
    const lang = dayjs.locale();
    var f = dayjs.Ls[lang.toLowerCase()].formats[formats];
    return dayjs(date).format(f);
};

const UnixTimeFormat = (unixSeconds, formats = "L") => {
    return dayjs.unix(unixSeconds).format(formats);
};

const DateInputMask = () => {
    const lang = i18n.language;
    var mask = dayjs.Ls[lang.toLowerCase()].inputMask.L;
    if (mask === undefined) {
        mask = dayjs.Ls["en-US"].inputMask.L;
    }
    return mask;
};

const DateTimeInputMask = () => {
    const lang = i18n.language;
    var mask = dayjs.Ls[lang.toLowerCase()].inputMask.LLLL;
    if (mask === undefined) {
        mask = dayjs.Ls["en-US"].inputMask.LLLL;
    }
    return mask;
};

const DateToLocalDate = (date) => {
    return dayjs(date).format("YYYY-MM-DD HH:mm:ss.SSSSSSZ");
};

const GenerateUTCZero = () => {
    const zeroTime = dayjs.utc("0001-01-01 00:00:00");
    return zeroTime;
};

const ConvertToUnixSecond = (date) => {
    return dayjs(date).unix();
};

const ConvertToUnixNano = (date) => {
    return dayjs(date).valueOf();
};

const IsUTCZero = (date) => {
    const utcZero = dayjs.utc("0001-01-01 00:00:00");
    const utcDate = dayjs(date);
    return utcZero.isSame(utcDate);
};

const CheckTimeZero = (date) => {
    if (!dayjs(date).isValid()) {
        return true;
    }
    return dayjs(date).valueOf() === 0;
};

export {
    dayjs,
    DateTimeFormat,
    DateTimeFormatSpec,
    UnixTimeFormat,
    DateInputMask,
    DateToLocalDate,
    GenerateUTCZero,
    IsUTCZero,
    DateTimeInputMask,
    ConvertToUnixSecond,
    ConvertToUnixNano,
    CheckTimeZero,
    EpochTime
};