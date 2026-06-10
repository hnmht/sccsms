import { pieDataItem } from "react-native-gifted-charts";
import { dayjs, i18n } from "../../i18n/dayjs";
import { multiSortByArr } from "../../components/tools/sort";
import { BeReviewedItem, DateInterval, IssueItem, ReviewedEORecord } from "../../dataType/types/dashboard";

export const fieldNames: Record<string, string> = {
    csaName: "csa",
    respName: "respPerson",
    epaName: "epa",
    epcName: "epc",
    cscName: "csc",
    creatorName: "executor",
    isFinish: "isCompleted",
    isRectify: "isRectify",
    billNumber: "billNumber",
    reviewerName: "reviewer",
    rlName: "riskLevel"
};

export const initDateIntervals = (): DateInterval[] => {
    const currentTime = dayjs(new Date());
    return [
        { id: "today", label: "today", startDate: currentTime.startOf("day").toISOString(), endDate: currentTime.endOf("day").toISOString() },
        { id: "yesterday", label: "yesterday", startDate: currentTime.subtract(1, "day").startOf("day").toISOString(), endDate: currentTime.subtract(1, "day").endOf("day").toISOString() },
        { id: "thisweek", label: "thisWeek", startDate: dayjs().weekday(0).startOf("day").toISOString(), endDate: currentTime.endOf("day").toISOString() },
        { id: "lastweek", label: "lastWeek", startDate: dayjs().add(-1, 'week').startOf('week').toISOString(), endDate: dayjs().add(-1, 'week').endOf('week').toISOString() },
        { id: "thismonth", label: "thisMonth", startDate: dayjs().startOf('month').toISOString(), endDate: currentTime.endOf("day").toISOString() },
        { id: "lastmonth", label: "lastMonth", startDate: dayjs().add(-1, 'month').startOf('month').toISOString(), endDate: dayjs().add(-1, 'month').endOf('month').toISOString() }
    ];
};

export const transIssueDataToPieData = (issueData: IssueItem[], field: keyof IssueItem) => {
    let newMap = new Map<string, number>();
    // Aggregate by field
    issueData.forEach(item => {
        const key = String(item[field]);
        const prev = newMap.get(key) ?? 0;
        newMap.set(key, prev + 1);
    })
    let pieData: pieDataItem[] = [];
    // convert map to array  
    let rows: any[] = [];
    for (let [key, value] of newMap.entries()) {
        let row: any = {};
        row.value = value;
        row[String(field)] = key;
        rows.push(row);
        pieData.push({ value: value, text: key, focused: false });
    }
    pieData.sort(multiSortByArr([{ field: "value", order: "desc" }]));
    return {
        columns: ['ranking', fieldNames[String(field)], "quantity"],
        rows: rows,
        pieData: pieData
    };
};

export const transReviewDataToTable = (reviewData: ReviewedEORecord[], field: keyof ReviewedEORecord) => {
    let newMap = new Map();
    // Aggregate by field
    reviewData.forEach(item => {
        let consumeSeconds = 0;
        if (isNaN(newMap.get(item[field]))) {
            consumeSeconds = 0;
        } else {
            consumeSeconds = newMap.get(item[field]);
        }
        newMap.set(item[field], consumeSeconds + item.consumeSeconds);
    })

    // Convert to array
    let rows: any[] = [];
    for (let [key, value] of newMap.entries()) {
        let row: any = {};
        row.value = value;
        row[field] = key;
        rows.push(row);
    }
    return {
        columns: ['ranking', fieldNames[field], "timeSeconds"],
        rows: rows
    };
};

export const transBeReviewDataToTable = (reviewData: BeReviewedItem[], field: keyof BeReviewedItem) => {
    let newMap = new Map();
    // Aggregate by field
    reviewData.forEach(item => {
        let consumeSeconds = 0;
        if (isNaN(newMap.get(item[field]))) {
            consumeSeconds = 0;
        } else {
            consumeSeconds = newMap.get(item[field]);
        }
        newMap.set(item[field], consumeSeconds + item.consumeSeconds);
    })

    // Convert to array
    let rows: any[] = [];
    for (let [key, value] of newMap.entries()) {
        let row: any = {};
        row.value = value;
        row[field] = key;
        rows.push(row);
    }
    return {
        columns: ['ranking', fieldNames[field], "timeSeconds"],
        rows: rows
    };
};

export const transProblemDataToRiskPie = (issueData: IssueItem[] = []): pieDataItem[] => {

    if (!Array.isArray(issueData) || issueData.length === 0) {
        return [{ value: 0, text: i18n.t("noData"), color: "green" }];
    }
    let newMap = new Map();
    // Aggregate by field
    issueData.forEach(item => {
        let issueNumber = 0;
        if (!newMap.get(item.rlName)) {
            issueNumber = 0;
        } else {
            issueNumber = newMap.get(item.rlName).count;
        }
        newMap.set(item.rlName, { id: item.respID, color: item.rlColor, name: item.rlName, count: issueNumber + 1 });
    })
    // convert map to array    
    let rows: pieDataItem[] = [];
    for (let [key, value] of newMap.entries()) {
        let row: pieDataItem = {
            value: value.count,
            focused: false,
            text: key,
            color: value.color
        };

        rows.push(row);
    }
    return rows;
}

