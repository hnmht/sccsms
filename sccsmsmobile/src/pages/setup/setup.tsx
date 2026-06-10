import { useState } from "react";
import { View, Alert, StyleSheet, KeyboardAvoidingView, Linking ,Platform} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Button, useTheme, IconButton, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { ResSuccessCode, APIResponse, ServerStatus } from "../../dataType/types/response";
import { saveGlobalPath, saveServerAddr } from "../../db/crud/appInfo";
import { useAuthNavigation } from "../../navigation/config/screenParams";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setGlobalPath, setServerAddr, setServerInfo } from "../../store/slice/appInfo";
import { resetUser } from "../../store/slice/user";
import { getEmptyServerInfo } from "../../dataType/dataZero/appInfo";


// Setup Server Address Page
function Setup() {
    const { t } = useTranslation();
    const navigation = useAuthNavigation();
    const theme = useTheme();
    const appInfo = useAppSelector(state => state.appInfo)
    const [text, setText] = useState(appInfo.serverAddr);
    const [isLoading, setIsLoading] = useState(false);
    const showLogin = appInfo.serverAddr !== "";
    const dispatch = useAppDispatch();

    // Actions after text input changed
    const handleChangeText = (text: string) => {
        setText(text);
    };
    // Actions after press ok button
    const handleOkPress = async () => {
        // Check if the address has changed
        if (appInfo.serverAddr === text) {
            Alert.alert(t("tip"), t("serverAddressNotChanged"));
            handleToLoginPress();
            return
        }
        setIsLoading(true);
        // Concatenate the Server ping URL
        const url: string = text + "/ping";

        try {
            const response = await fetch(url, {
                method: "POST",
            });      
            const responseData = await response.json() as APIResponse<ServerStatus>;
            if (responseData.resKey === ResSuccessCode && text !== undefined) {
                const serverData = responseData.data;
                // Write Server address into database
                saveServerAddr(text);
                saveGlobalPath(serverData.apiPath);
                // Update Redux state
                dispatch(setServerAddr(text));
                dispatch(setGlobalPath(serverData.apiPath));
                // Resetting User data in redux
                dispatch(resetUser());
                dispatch(setServerInfo(getEmptyServerInfo()));
                setIsLoading(false);
                // Inform the user
                Alert.alert(
                    t("tip",),
                    t("serverConnectSuccefully"),
                    [
                        {
                            text: t("ok"),
                            onPress: () => navigation.navigate("Login")
                        }
                    ]
                )
            } else {
                setIsLoading(false);
                // Inform the user
                Alert.alert(
                    t("error"),
                    t("serverConnectFailed", { msg: responseData.msg }),
                    [{
                        text: t("ok")
                    }]
                )
                return
            }
        }
        catch (error) {
            setIsLoading(false);
            Alert.alert(
                t("error"),
                t("serverUnableConnect"),
                [{
                    text: t("ok"),
                }]);
            return
        }
    };

    // Actions after press login button
    const handleToLoginPress = () => {
        navigation.navigate("Login");
    };

    // Actions after press copy press
      const handleWebsitePress = async () => {
          const url = "https://github.com/hnmht";
          const supported = await Linking.canOpenURL(url);
          if (supported) {
              await Linking.openURL(url);
          } else {
              Alert.alert(t("tip"), t("cannotOpenBrowser"));
          }
      }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ height: 60, width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
                {showLogin
                    ? <IconButton icon="login-variant" style={{ height: 60, width: 60 }} iconColor={theme.colors.primary} onPress={handleToLoginPress} />
                    : null
                }
            </View>
            <KeyboardAvoidingView enabled behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                <Text variant="bodyMedium" style={{ width: "90%", marginBottom: 16 }}>
                    {t("tipInputAddress")}
                </Text>
                <TextInput
                    mode="outlined"
                    placeholder={t("serverAddressPlaceholder")}
                    value={text}
                    onChangeText={handleChangeText}
                    defaultValue={appInfo.serverAddr}
                    style={{ width: "90%", marginBottom: 32 }}
                />
                <Button
                    mode="contained"
                    disabled={text === "" || isLoading}
                    onPress={handleOkPress}
                    loading={isLoading}
                    style={{ width: "70%" }}
                >
                    {t("ok")}
                </Button>
            </KeyboardAvoidingView>
            <View style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 16 }}>
                <Text variant="titleMedium" style={{ width: "90%", color: theme.colors.error }}>
                    {t("tipDownloadBackend")}
                </Text>
                <Text 
                variant="bodyMedium"
                onPress={handleWebsitePress}
                 style={{ color: theme.colors.primary, textDecorationLine: "underline", fontWeight: "bold" }}
                 >
                    https://github.com/hnmht
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%"
    }
});

export default Setup;
