import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../pages/login/login";
import Setup from "../pages/setup/setup";
import { AuthStackParmList } from "./config/screenParams";
import { useTranslation } from "react-i18next";

const AuthStack = createNativeStackNavigator<AuthStackParmList>();

const AuthStackScreen = () => {
    const {t} = useTranslation();
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }} >
            <AuthStack.Screen name="Login" component={Login} options={{ headerShown: false, title: t("login")}} />
            <AuthStack.Screen name="Setup" component={Setup} options={{ headerShown: false, title: t("serverAddress") }} />
        </AuthStack.Navigator>
    )
};

export default AuthStackScreen;