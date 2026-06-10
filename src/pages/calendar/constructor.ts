
import { i18n, dayjs } from "../../i18n/dayjs";
import { multiSortByArr } from "../../components/tools/sort";
import { StatusColors } from "../../constant/eventStatusColors";
import { Event, UserEvents } from "../../dataType/types/event";
import { Calendar } from "../../dataType/types/calendar";
import { WorkOrderRow } from "../../dataType/types/workOrder";
import { ReferExecutionOrder } from "../../dataType/types/executionOrder";
import { getEmptyEPT } from "../../dataType/dataZero/ept";
import { store } from "../../store";

//  convert events to calendars 
export function transEventsToCalendar(events: Event[]): Calendar[] {
    if (!Array.isArray(events) || events.length === 0) {
        return [];
    }
    let newMap = new Map<string, Event[]>();
    events.forEach(event => {
        let startDate = dayjs(event.start).format("YYYY-MM-DD");
        if (event.billType === "WO") {
            event.title = `${i18n.t("executeInstruction")} : ${event.csa.name}<${event.ept.name}>`
        }

        if (event.billType === "EO") {
            event.title = `${i18n.t("handleIssue")} : ${event.csa.name}<${event.epaName}>`
        }
        if (newMap.has(startDate)) {
            let oldValues = newMap.get(startDate);
            if (oldValues === undefined) {
                oldValues = [];
            } else {
                oldValues.push(event);
            }
            newMap.set(startDate, oldValues);
        } else {
            let value: Event[] = [event];
            newMap.set(startDate, value);
        }
    });

    // convert map to array
    let calendars: Calendar[] = [];
    for (let [key, value] of newMap.entries()) {
        calendars.push({
            date: key,
            events: value
        });
    };
    calendars.sort(multiSortByArr([{ field: "date", order: "asc" }]));
    calendars.map(calendar => {
        if (calendar.events.length > 1) {
            calendar.events.sort(multiSortByArr([{ field: "start", order: "asc" }]));
        }
    })
    return calendars;
}

// convert Work order Rows and Refer Execution order to calendars
export function transEdrsAndWorsToCalendar(worefs: WorkOrderRow[], eorefs: ReferExecutionOrder[]): Calendar[] {
    if (!Array.isArray(worefs) || !Array.isArray(eorefs)) {
        return [];
    }
    const sumArray: Event[] = [];
    if (worefs.length > 0) {
        worefs.forEach(ref => {
            const event: Event = {
                date: dayjs(ref.startTime).format("YYYY-MM-DD"),
                id: ref.id,
                hid: ref.hid,
                start: ref.startTime,
                end: ref.endTime,
                title: `${i18n.t("executeInstruction")} : ${ref.csa.name}<${ref.ept.name}>`,
                csa: ref.csa,
                ept: ref.ept,
                editable: false,
                allDay: false,
                billType: "WO",
                epaName: "",
                epaValueDisp: "",
                files: [],
                status: ref.status,
                creator: ref.creator,
                hDescription: ref.headerDescription,
                bDescription: ref.description,
                billNumber: ref.billNumber,
                rowNumber: ref.rowNumber,
                backgroundColor: StatusColors[ref.status],
            }
            sumArray.push(event);
        });
    }

    if (eorefs.length > 0) {
        eorefs.forEach(ref => {
            const event: Event = {
                date: dayjs(ref.handleStartTime).format("YYYY-MM-DD"),
                id: ref.id,
                hid: ref.hid,
                start: ref.handleStartTime,
                end: ref.handleEndTime,
                title: `${i18n.t("handleIssue")} : ${ref.csa.name}<${ref.epa.name}>`,
                csa: ref.csa,
                ept: getEmptyEPT(),
                editable: false,
                allDay: false,
                billType: "EO",
                epaName: ref.epa.name,
                epaValueDisp: ref.executionValueDisp,
                files: [],
                status: ref.status,
                creator: ref.executor,
                hDescription: "",
                bDescription: ref.description,
                billNumber: ref.billNumber,
                rowNumber: ref.rowNumber,
                backgroundColor: StatusColors[ref.status],
            }
            sumArray.push(event);
        });
    }

    if (sumArray.length === 0) {
        return [];
    }
    // convert array to map
    let newMap = new Map<string, Event[]>();
    sumArray.forEach(event => {
        const startDate = event.date;
        if (newMap.has(startDate)) {
            let oldValues = newMap.get(startDate);
            if (oldValues === undefined) {
                oldValues = [];
            } else {
                oldValues.push(event);
            }
            newMap.set(startDate, oldValues);
        } else {
            let value = [event];
            newMap.set(startDate, value);
        }
    });

    // convert map to array
    let calendars: Calendar[] = [];
    for (let [key, value] of newMap.entries()) {
        calendars.push({
            date: key,
            events: value
        });
    };
    // Sort calendars by date and events by start time
    calendars.sort(multiSortByArr([{ field: "date", order: "asc" }]));
    calendars.map(calendar => {
        if (calendar.events.length > 1) {
            calendar.events.sort(multiSortByArr([{ field: "start", order: "asc" }]));
        }
    })
    return calendars;
}

// Generate default UserEvents
export function generateDefaultUserEvents(): UserEvents {
    const { user } = store.getState();
    const ue: UserEvents = {
        userID: user.id,
        person: user.person,
        start: dayjs().weekday(0).startOf("day").toISOString(),
        end: dayjs().endOf("day").toISOString(),
        resultNumber: 0,
        events: []
    };
    return ue;
}