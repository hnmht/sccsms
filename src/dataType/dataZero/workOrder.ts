import { dayjs, EpochTime } from "../../i18n/dayjs";
import { SimpDept } from "../types/department";
import { Person } from "../types/person";
import { WorkOrder, WorkOrderRow } from "../types/workOrder";
import { getEmptyCSA } from "./csa";
import { getEmptyEPT } from "./ept";
import { getEmptyPerson } from "./person";

// Generate empty Work Order Row
export function getDefaultWorkOrderRow(person: Person, dept: SimpDept, currentDay: string): WorkOrderRow {
    return {
        id: 0,
        hid: 0,
        rowNumber: 10,
        csa: getEmptyCSA(),
        executor: getEmptyPerson(),
        description: "",
        ept: getEmptyEPT(),
        startTime: dayjs(new Date()).startOf("day").add(9, "hour").toISOString(),
        endTime: dayjs(new Date()).startOf("day").add(17, "hour").toISOString(),
        status: 0,
        eoID: 0,
        eoNumber: "",
        createDate: currentDay,
        creator: person,
        confirmDate: EpochTime,
        confirmer: getEmptyPerson(),
        modifyDate: EpochTime,
        modifier: getEmptyPerson(),
        ts: currentDay,
        dr: 0,
        billNumber: "",
        billDate: currentDay,
        department: dept,
        headerDescription: "",
        workDate: currentDay,
    }
}


// Generate empty Work Order
export function getEmptyWorkOrder(person: Person, dept: SimpDept): WorkOrder {
    const emptyPerson = getEmptyPerson();
    const currentDay = dayjs(new Date()).toISOString();
    return {
        id: 0,
        billNumber: "",
        billDate: dayjs().startOf("day").toISOString(),
        department: dept,
        description: "",
        status: 0,
        workDate: currentDay,
        body: [getDefaultWorkOrderRow(person, dept, currentDay)],
        createDate: currentDay,
        creator: person,
        confirmDate: EpochTime,
        confirmer: emptyPerson,
        modifyDate: EpochTime,
        modifier: emptyPerson,
        ts: currentDay,
        dr: 0,
    }
}