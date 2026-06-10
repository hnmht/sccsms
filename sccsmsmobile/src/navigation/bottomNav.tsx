import { useMemo } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAppSelector } from "../store/hooks";
import Dashboard from "../pages/dashboard/dashboard";
import BusinessNav from "./businessNav";
import SettingNav from "./settingNav";
import Calendar from "../pages/calendar/calendar";
import Message from "../pages/message/message";
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { pubParams } from "../components/pub/pubParams";
import { TabRouteName, TabConfig } from "./config/tab";
import { BottomNavParamList } from "./config/screenParams";
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator<BottomNavParamList>();
const TAB_CONFIG: Record<TabRouteName, TabConfig> = {
    Home: {
        title: 'MenuDashboard',
        icon: 'home',
        component: Dashboard,
        showWhenOffline: false,
    },
    Message: {
        title: 'MenuMessage',
        icon: 'message',
        component: Message,
        showWhenOffline: false,
    },
    Calendar: {
        title: 'MenuCalendar',
        icon: 'calendar',
        component: Calendar,
    },
    BusinessNav: {
        title: 'business',
        icon: 'all-inclusive',
        component: BusinessNav,
    },
    SettingNav: {
        title: 'MenuSettings',
        icon: 'cog',
        component: SettingNav,
    },
};

function BottomNav() {
    const { t } = useTranslation();
    const dynamicData = useAppSelector(state => state.dynamicData);
    const appInfo = useAppSelector(state => state.appInfo);
    const isOffLine = appInfo.isOffline === 1;
    const badgeOptions = useMemo(() => {
        const scale = pubParams.screen.fontScale;
        return scale > 1
            ? { fontSize: 16 / pubParams.screen.fontScale, lineHeight: 16 / pubParams.screen.fontScale + 2 }
            : undefined;
    }, []);
    const badgesNumber = useMemo(() => ({
        Home: 0,
        Message: dynamicData.messages.length,
        Calendar: dynamicData.eoRefs.length + dynamicData.woRefs.length,
        BusinessNav: 0,
        SettingNav: 0,
    }), [dynamicData, appInfo])

    return (
        <Tab.Navigator
            screenOptions={({ route }) => {
                const config = TAB_CONFIG[route.name as TabRouteName];
                return {
                    headerShown: false,
                    tabBarShowLabel: true,
                    tabBarHideOnKeyboard: true,
                    tabBarAllowFontScaling: false,
                    headerTitleAllowFontScaling: false,                    
                    tabBarIcon: ({ color, size }) => (
                        <MaterialDesignIcons
                            name={config?.icon ?? 'help-circle'}
                            size={size}
                            color={color}
                        />
                    ),                  
                };
            }}
        >
            {(Object.keys(TAB_CONFIG) as TabRouteName[]).map(name => {
                const config = TAB_CONFIG[name];
                if (isOffLine && config.showWhenOffline === false) {
                    return null;
                }
                return (
                    <Tab.Screen
                        key={name}
                        name={name}
                        component={config.component}
                        options={{
                            title: t(config.title),
                            tabBarBadge: badgesNumber[name] > 0 ? badgesNumber[name] : undefined,
                            tabBarBadgeStyle: badgeOptions,
                        }}
                    />
                );
            })}
        </Tab.Navigator>
    );
};

export default BottomNav;