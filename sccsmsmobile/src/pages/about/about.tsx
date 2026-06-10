import { useTranslation } from "react-i18next";
import { Linking, ScrollView, Alert ,View} from "react-native";
import { Card, Text, Button,useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../../store/hooks";
import { useSettingNavigation } from "../../navigation/config/screenParams";
import { displayName, appVersion, author, backendName } from "../../../app.json";
const maxScale = 1.2;

function About() {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigation= useSettingNavigation();
    const appInfo = useAppSelector(state => state.appInfo);

    const handleLinkGPLPress = async () => {
        const url = "https://www.gnu.org/licenses/";
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(t("tip"), t("cannotOpenBrowser"));
        }
    }

    const handleEmailPress = async () => {
        const mailto = `mailto:${encodeURIComponent("haitao.m@outlook.com")}`;
        try {
            const supported = await Linking.canOpenURL(mailto);
            if (supported) {
                await Linking.openURL(mailto);
            } else {
                Alert.alert(t("tip"), t("cannotOpenMailClient"));
            }
        } catch (err) {
            console.warn("open mail error", err);
            Alert.alert(t("tip"), t("cannotOpenMailClient"));
        }
    }

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
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
            <ScrollView>
                <Card style={{ marginHorizontal: 4, marginTop: 16, marginBottom: 8 }}>
                    <Card.Title
                        title={displayName}
                        titleMaxFontSizeMultiplier={maxScale}
                        titleNumberOfLines={2}
                        titleStyle={{ color: theme.colors.primary }}
                    />
                    <Card.Content>
                        <Text>{t("version")}: {appVersion}</Text>
                        <Text>{t("author")}: {author}</Text>
                    </Card.Content>
                </Card>
                <Card style={{ marginHorizontal: 4, marginTop: 8, marginBottom: 8 }}>
                    <Card.Title
                        title={backendName}
                        titleMaxFontSizeMultiplier={maxScale}
                        titleNumberOfLines={2}
                        titleStyle={{ color: theme.colors.primary }}
                    />
                    <Card.Content>
                        <Text>{t("serverAddress")} : {appInfo.serverAddr}</Text>
                        <Text>{t("dbID")} : {appInfo.dbID}</Text>
                        <Text>{t("version")} : {appInfo.serverInfo.serverSoft?.scServerVersion}</Text>
                        <Text>{t("dbVersion")} : {appInfo.serverInfo.dbVersion}</Text>
                    </Card.Content>
                </Card>
                <Card style={{ marginHorizontal: 4, marginTop: 8, marginBottom: 8 }}>
                    <Card.Title
                        title={t("contact")}
                        titleMaxFontSizeMultiplier={maxScale}
                        titleNumberOfLines={1}
                        titleStyle={{ color: theme.colors.primary }}
                    />
                    <Card.Content>
                        <Text>
                            {t("email")} : {" "}
                            <Text
                                style={{ color: theme.colors.primary, textDecorationLine: "underline" }}
                                onPress={handleEmailPress}
                            >
                                haitao.m@outlook.com
                            </Text>
                        </Text>
                        <Text>
                            {t("website")} : {" "}
                            <Text
                                style={{ color: theme.colors.primary, textDecorationLine: "underline" }}
                                onPress={handleWebsitePress}
                            >
                                https://github.com/hnmht
                            </Text>
                        </Text>
                    </Card.Content>
                </Card>
                <Card style={{ marginHorizontal: 4, marginTop: 8, marginBottom: 8 }}>
                    <Card.Title
                        title={t("openSourceLicense")}
                        titleMaxFontSizeMultiplier={maxScale}
                        titleStyle={{ color: theme.colors.primary }}
                    />
                    <Card.Content>
                        <Text onPress={handleLinkGPLPress} style={{ color: theme.colors.primary, textDecorationLine: "underline", fontWeight: "bold" }}>
                            GNU GPL 3.0 License
                        </Text>
                    </Card.Content>
                </Card>
            </ScrollView>
            <View style={{ width: "100%", alignItems: "center", justifyContent: "center", margin: 8 }}>
                <Button mode="elevated" onPress={() => navigation.goBack()} style={{ width: "40%" }} >{t("back")}</Button>
            </View>
        </SafeAreaView>
    )
}

export default About; 