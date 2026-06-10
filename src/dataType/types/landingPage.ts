import { ScFile } from "./file";
import { Person } from "./person";
// Landing Page Info
export interface LandingPageInfo {
    sysNameDisp: string;
    introText: string;
    file: ScFile;
    modifyDate: string;
    modifier: Person;
    ts: string;
}