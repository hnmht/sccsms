export interface SystemMenu {
    id: number;
    fatherID: number;
    title: string;
    path: string;
    icon: string;
    component: string;
    selected: boolean;
    indeterminate: boolean;
    addFromVersion: string;
}