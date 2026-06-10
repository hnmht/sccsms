import type { ComponentType } from "react";

export type TabRouteName = | 'Home' | 'Message' | 'Calendar' | 'BusinessNav' | 'SettingNav';

export interface TabConfig {
    title: string;
    icon: 'home' | 'message' | 'calendar' | 'all-inclusive' | 'cog';
    component: ComponentType<any>;
    showWhenOffline?: boolean;
}