import { i18n,dayjs } from "../../../i18n/i18n";
export const fieldNames = {
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
}

export const initDateIntervals = () => {
    const currentTime = dayjs(new Date());
    return [
        { id: "today", label: "today", startDate: currentTime.startOf("day"), endDate: currentTime.endOf("day") },
        { id: "yesterday", label: "yesterday", startDate: currentTime.subtract(1, "day").startOf("day"), endDate: currentTime.subtract(1, "day").endOf("day") },
        { id: "thisweek", label: "thisWeek", startDate: dayjs().weekday(0).startOf("day"), endDate: currentTime.endOf("day") },
        { id: "lastweek", label: "lastWeek", startDate: dayjs().add(-1, 'week').startOf('week'), endDate: dayjs().add(-1, 'week').endOf('week') },
        { id: "thismonth", label: "thisMonth", startDate: dayjs().startOf('month'), endDate: currentTime.endOf("day") },
        { id: "lastmonth", label: "lastMonth", startDate: dayjs().add(-1, 'month').startOf('month'), endDate: dayjs().add(-1, 'month').endOf('month') }
    ];
};


export const transProblemDataToPieData = (problemdata, field) => {
    let newMap = new Map();
    // Aggregate by field
    problemdata.forEach(item => {
        let problemNumber = 0;
        if (isNaN(newMap.get(item[field]))) {
            problemNumber = 0;
        } else {
            problemNumber = newMap.get(item[field]);
        }
        newMap.set(item[field], problemNumber + 1);
    })

    let pieData = {
        labels: [],
        datasets: [
            {
                label: i18n.t('count'),
                data: [],
                borderWidth: 1,
            },
        ],
    };
    // Convert map to Array
    let rows = [];
    for (let [key, value] of newMap.entries()) {
        let row = {};
        row.value = value;
        row[field] = key;
        rows.push(row);
        pieData.labels.push(key);
        pieData.datasets[0].data.push(value);
    }
    return {
        columns: ['ranking', fieldNames[field], "count"],
        rows: rows,
        pieData: pieData
    };
};

export const transReviewDataToTable = (reviewData, field) => {
    let newMap = new Map();
    // Aggregate by Field 
    reviewData.forEach(item => {
        let consumeSeconds = 0;
        if (isNaN(newMap.get(item[field]))) {
            consumeSeconds = 0;
        } else {
            consumeSeconds = newMap.get(item[field]);
        }
        newMap.set(item[field], consumeSeconds + item.consumeSeconds);
    })

    // Convert map to Array
    let rows = [];
    for (let [key, value] of newMap.entries()) {
        let row = {};
        row.value = value;
        row[field] = key;
        rows.push(row);
    }
    return {
        columns: ['ranking', fieldNames[field], "timeSeconds"],
        rows: rows
    };
};

export const transProblemDataToPolarArea = (problemdata) => {
    let newMap = new Map();
    // Aggregate by Field
    problemdata.forEach(item => {
        let problemNumber = 0;
        if (!newMap.get(item.rlName)) {
            problemNumber = 0;
        } else {
            problemNumber = newMap.get(item.rlName).count;
        }
        newMap.set(item.rlName, { id: item.respid, color: item.rlcolor, name: item.rlName, count: problemNumber + 1 });
    })

    const data = {
        labels: [],
        datasets: [
            {
                label: i18n.t('count'),
                data: [],
                backgroundColor: [],
                borderWidth: 1,
            },
        ],
    };
    // Map to Array
    for (let [key, value] of newMap.entries()) {
        data.labels.push(key);
        data.datasets[0].data.push(value.count);
        data.datasets[0].backgroundColor.push(value.color)
    }
    return data;
};

export const transRiskTrendsToPolarArea = (rlData) => {
    let newMap = new Map();
    // Aggregate by Field
    rlData.forEach(item => {
        let problemNumber = 0;
        if (!newMap.get(item.riskLevel.name)) {
            problemNumber = item.totalNumber;
        } else {
            problemNumber = newMap.get(item.riskLevel.name).count + item.totalNumber;
        }
        newMap.set(item.riskLevel.name, { id: item.riskLevel.id, color: item.riskLevel.color, name: item.riskLevel.name, count: problemNumber });
    })

    const data = {
        labels: [],
        datasets: [
            {
                label: i18n.t('count'),
                data: [],
                backgroundColor: [],
                borderWidth: 1,
            },
        ],
    };

    // Map to Array
    for (let [key, value] of newMap.entries()) {
        data.labels.push(key);
        data.datasets[0].data.push(value.count);
        data.datasets[0].backgroundColor.push(value.color)
    }

    return data;

};

export const transRiskTrendsToLine = (rlData, groupby) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        stacked: false,
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                showLabelBackdrop: false,
            },
        },
    };
    let rlMap = new Map();
    let rlArr = [];
    let xMap = new Map();
    let xArr = [];

    // Get label  and date
    rlData.forEach(item => {
        if (!rlMap.get(item.riskLevel.name)) {
            rlMap.set(item.riskLevel.name, item.riskLevel);
            rlArr.push(item.riskLevel)
        }
        if (!xMap.get(item[groupby])) {
            xMap.set(item[groupby], 1);
            xArr.push(item[groupby]);
        }
    });
    var datasets = [];
    rlArr.forEach((rl, index) => {
        var data = {
            label: rl.name,
            data: [],
            borderColor: rl.color,
            backgroundColor: rl.color,
            yAxisID: `y`
        };
        // Fill data
        xArr.forEach(x => {
            var total = 0;
            rlData.forEach(item => {
                if (item[groupby] === x && item.riskLevel.id === rl.id) {
                    total = total + item.totalNumber;
                }
            })
            data.data.push(total);
        })
        datasets.push(data);
    });
    return {
        data: {
            labels: xArr,
            datasets: datasets,
        },
        options: options,
    }
};

