import { dayjs } from "../i18n/dayjs";
import ScTextInputIcon from '@mui/icons-material/TextFields'; //301
import ScNumberInputIcon from '@mui/icons-material/LooksOne'; //302
// import ScPasswordInputIcon from '@mui/icons-material/Password'; //303
// import ScMobileInputIcon from '@mui/icons-material/PhoneAndroid'; //304
// import ScEmailInputIcon from '@mui/icons-material/Email';//305
import ScSelectGenderIcon from '@mui/icons-material/Transgender';//401
import ScCheckYesOrNoIcon from '@mui/icons-material/Rule';
import ScDateInputIcon from '@mui/icons-material/CalendarMonth'; //306
import ScPersonSelectIcon from "@mui/icons-material/Group"; //
import ScDateTimeInputIcon from "@mui/icons-material/AccessTime";
import ScUDCSelectIcon from '@mui/icons-material/Category';
import ScUDDSelectIcon from '@mui/icons-material/SnippetFolderOutlined';
import ScDeptSelectIcon from "@mui/icons-material/Apartment";//520
import ScEICSelectIcon from "@mui/icons-material/Widgets";//540
import ScSicSelectIcon from '@mui/icons-material/HolidayVillage';//525
// Data Type Icon map
const dataIconMap = new Map([
    [301, ScTextInputIcon],
    [302, ScNumberInputIcon],
    [306, ScDateInputIcon],
    [307, ScDateTimeInputIcon],
    [401, ScSelectGenderIcon],
    [404, ScCheckYesOrNoIcon],
    [510, ScPersonSelectIcon],
    [520, ScDeptSelectIcon],
    [525, ScSicSelectIcon],
    [530, ScUDCSelectIcon],
    [540, ScEICSelectIcon],
    [550, ScUDDSelectIcon],
    [525, ScSicSelectIcon],
]);
// Seacloud Data Type List
export const DataTypes = [
    { id: 301, code: "ScTextInput", name: "text", dataType: "string", inputMode: "Input" },
    { id: 302, code: "ScNumberInput", name: "number", dataType: "number", inputMode: "Input" },
    { id: 306, code: "ScDateInput", name: "date", dataType: "string", inputMode: "Input" },
    { id: 307, code: "ScDateTimeInput", name: "dateTime", dataType: "string", inputMode: "Input" },
    { id: 401, code: "ScSelectGender", name: "gender", dataType: "int16", inputMode: "Select" },
    { id: 404, code: "ScSelectYesOrNo", name: "bool", dataType: "int16", inputMode: "Select" },
    { id: 510, code: "ScPersonSelect", name: "person", dataType: "Person", inputMode: "Select" },
    { id: 520, code: "ScDeptSelect", name: "simpDept", dataType: "SimpDept", inputMode: "Select" },
    { id: 525, code: "ScCSCSelect", name: "csc", dataType: "csc", inputMode: "Select" },
    { id: 530, code: "ScUDCSelect", name: "udc", dataType: "udc", inputMode: "Select" },
    { id: 540, code: "ScEPCSelect", name: "epc", dataType: "epc", inputMode: "Select" },
    { id: 550, code: "ScUDASelect", name: "uda", dataType: "uda", inputMode: "Select" },
];

// Get the Secloud Date type default value
export const GetDataTypeDefaultValue = (typeid) => {
    switch (typeid) {
        case 301:
            return "";
        case 302:
            return 0;
        case 306:
            return dayjs(new Date());
        case 307:
            return dayjs(new Date());
        case 401:
            return 0;
        case 404:
            return 0;
        case 510:
            return { id: 0, code: "", name: "", avatar: { filekey: 0, fileUrl: "" }, deptid: 0, deptcode: "", description: "" };
        case 520:
            return { id: 0, code: "", name: "", fatherID: 0, leader: { id: 0, code: "", name: "" }, description: "", status: 0 };
        case 525:
            return { id: 0, name: "", description: "", fatherID: 0, status: 0 };
        case 530:
            return { id: 0, name: "", description: "" };
        case 540:
            return { id: 0, name: "", description: "", fatherID: 0, status: 0 };
        case 550:
            return { id: 0, code: "", name: "", description: "", udc: { id: 0, name: "" }, fatherID: 0 };
        default:
            return undefined;
    }
};

// Get Icon
export const DataIcon = (props) => {
    const { datacode, ...otherPorps } = props;
    const Icon = dataIconMap.get(datacode);
    return <Icon {...otherPorps} />;
};

// Voucher status
export const VoucherStatus = ["free", "confirmed", "executing", "completed"];

// Get Period's StartDate and EndDate
export const PeriodStartandEnd = (period) => {
    const currentTime = dayjs(new Date());
    const thisDay = currentTime.date();
    const thisMonth = currentTime.month();
    switch (period) {
        case "month":
            return { startDate: currentTime.startOf("month"), endDate: currentTime.endOf("month") };
        case "day":
            return { startDate: currentTime.startOf("day"), endDate: currentTime.endOf("day") };
        case "week":
            return { startDate: currentTime.startOf("week"), endDate: currentTime.endOf("week") };
        case "tenDayPeriod":
            if (thisDay <= 10) {
                return { startDate: currentTime.startOf("month"), endDate: currentTime.startOf("month").add(9, "day") };
            } else {
                if (thisDay <= 20) {
                    return { startDate: currentTime.startOf("month").add(10, "day"), endDate: currentTime.startOf("month").add(19, "day") };                
                } else {
                    return { startDate: currentTime.startOf("month").add(20, "day"), endDate: currentTime.endOf("month") };
                }
            }
        case "halfMonth":
            if (thisDay <= 15) {
                return { startDate: currentTime.startOf("month"), endDate: currentTime.startOf("month").add(14, "day") };
            } else {
                return { startDate: currentTime.startOf("month").add(15, "day"), endDate: currentTime.endOf("month") };
            }
        case "quarter":
            return { startDate: currentTime.startOf("quarter"), endDate: currentTime.endOf("quarter") };
        case "halfAYear":
            if (thisMonth <= 5) {
                return { startDate: currentTime.startOf("year"), endDate: currentTime.startOf("year").add(5, "month").endOf("month") };
            } else {
                return { startDate: currentTime.startOf("year").add(6, "month"), endDate: currentTime.endOf("year") };
            }
        case "year":
            return { startDate: currentTime.startOf("year"), endDate: currentTime.endOf("year") };
        default:
            return { startDate: currentTime.startOf("day"), endDate: currentTime.endOf("day") };
    };
};

