import { useEffect, } from "react";
import { View, ImageBackground } from "react-native";
import { useTheme, ActivityIndicator } from "react-native-paper";
import { useDispatch } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { queryAppinfo } from "../../db/crud/appInfo";
import { setInfoFromDb } from "../../store/slice/appInfo";
import { queryUserInfo } from "../../db/crud/userInfo";
import { setUserInfoFromDb } from "../../store/slice/user";
import { useRootNavigation } from "../../navigation/config/screenParams";

// Splash Page
function Splash() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigation = useRootNavigation();
    let attempts = 0;
    // Load initial data from the database
    const LoadApp = () => {
        // const startTime:any = new Date();
        // Retrieve AppInfo from database
        let appInfo = queryAppinfo();
        // Write AppInfo to Redux
        dispatch(setInfoFromDb(appInfo));
        // Retrieve UserInfo from database 
        let userInfo = queryUserInfo();
        // Write UserInfo to Redux
        dispatch(setUserInfoFromDb(userInfo));
        // Check if appInfo.serverAddr is empty
        if (appInfo.serverAddr === "") {
            // If it is empty, it means the inital login setup is incomplete,
            // and the user should be directed to the Setup page.
            navigation.replace("AuthStack", { screen: "Setup" });
        } else {
            // If it is not empty, then navigate to the Login page.       
            navigation.replace("AuthStack", { screen: "Login" });
        }
    };

    // Set a timer
    let myInterval: number | null = null;

    useEffect(() => {
        myInterval = setInterval(() => {
            attempts++;
            // Wait for 2 seconds here so that the splash screen does't disapper too quickly
            if (attempts === 2) {
                LoadApp();
                // Clear the timer
                if (myInterval !== null) {
                    clearInterval(myInterval);
                }
            }
        }, 1000);
        // Clear the timer
        return () => {
            if (myInterval !== null) {
                clearInterval(myInterval);
            }
        }
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ImageBackground source={require("./image/background.png")} resizeMode="cover" style={{ width: "100%", height: "100%", flex: 1, justifyContent: "center" }}>
                    <ActivityIndicator animating={true} color={theme.colors.primary} style={{ marginTop: 128 }} />
                </ImageBackground>
            </View>
        </SafeAreaView>
    );
};

export default Splash;

