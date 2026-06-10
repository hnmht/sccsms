import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createNavigationContainerRef, ParamListBase } from "@react-navigation/native";
import Splash from "../pages/splash/splash";
import AuthStackScreen from "./authStack";
import BottomNav from "./bottomNav";
import { RootStackParamList } from "./config/screenParams";

const RootStack = createNativeStackNavigator<RootStackParamList>();
export const navigationRef = createNavigationContainerRef<ParamListBase>();

export const RootStackScreen = () => {
    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash" >
            <RootStack.Screen name="AuthStack" component={AuthStackScreen} />
            <RootStack.Screen name="Splash" component={Splash} />
            <RootStack.Screen name="BottomNav" component={BottomNav} />
        </RootStack.Navigator>
    )
}; 
