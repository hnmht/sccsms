import { SimpDept } from "./department";
import { Person } from "./person";
import { TC } from "./tc";
import { VoucherFile } from "./voucherFile";

// Training Record Row
export interface TrainingRecordRow {
    id: number; // BID
    hid: number;
    rowNumber: number;
    student: Person;
    positionName: string;
    deptName: string;
    startTime: string;
    endTime: string;
    classHour: number;
    description: string;
    examRes: number;
    examScore: number;
    status: 0 | 1 | 2 | 3 | 4; // 0 Free 1 Confirmed 2 Executing 3 Completed 4 none
    files: VoucherFile[]; // BFiles
    createDate: string;
    creator: Person;
    confirmDate: string;
    confirmer: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: 0 | 1;
}

// Training Record Header
export interface TrainingRecord {
    id: number; // HID
    billNumber: string;
    billDate: string;
    department: SimpDept;
    description: string;
    lecturer: Person;
    trainingDate: string;
    tc: TC;
    startTime: string;
    endTime: string;
    classHour: number;
    isExam: 0 | 1;
    hFiles: VoucherFile[];
    body: TrainingRecordRow[];
    status: 0 | 1 | 2 | 3 | 4; // 0 Free 1 Confirmed 2 Executing 3 Completed 4 none
    createDate: string;
    creator: Person;
    confirmDate: string;
    confirmer: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: 0 | 1;
}
// Taught Lessons Report 
export interface TaughtLessonsReport {
    hid: number;
    billNumber: string;
    billDate: string;
    id: number; // Dept ID
    deptCode: string;
    deptName: string;
    description: string;
    lecturerID: number;
    lecturerCode: string;
    lecturerName: string;
    trainingDate: string;
    tcID: number;
    tcCode: string;
    tcName: string;
    startTime: string;
    endTime: string;
    classHour: number;
    isExam: 0 | 1;
    studentNumber: number;
    qualifiedNumber: number;
    disqualificationNumber: number;
    status: 0 | 1 | 2 | 3 | 4; // 0 Free 1 Confirmed 2 Executing 3 Completed 4 none
    creatorID: number;
    creatorCode: string;
    creatorName: string;
}
// Recireved Training Report
export interface ReceivedTrainingReport {
    hid: number;
    bid: number;
    billNumber: string;
    billDate: string;
    id: number; // Dept ID
    deptCode: string;
    deptName: string;
    lecturerID: number;
    lecturerCode: string;
    lecturerName: string;
    tcID: number;
    tcCode: string;
    tcName: string;
    startTime: string;
    endTime: string;
    tcClassHour: number;
    isExam: 0 | 1;
    hStatus: 0 | 1 | 2 | 3 | 4; // 0 Free 1 Confirmed 2 Executing 3 Completed 4 none
    hDescription: string;
    studentID: number;
    studentCode: string;
    studentName: string;
    studentPositionName: string;
    studentDeptName: string;
    signStartTime: string;
    signEndTime: string;
    bClassHour: number;
    bDescription: string;
    examRes: 0 | 1;
    examScore: number;
    bStatus: 0 | 1 | 2 | 3 | 4; // 0 Free 1 Confirmed 2 Executing 3 Completed 4 none
    creatorID: number;
    creatorCode: string;
    creatorName: string;
}