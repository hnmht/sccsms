import { useState } from "react";
import { View } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import ReadMessage from "./readMessage";
import UnReadMessages from "./unReadMessage";

const Message = () => {
    const [content, setContent] = useState("unRead");
    const { t } = useTranslation();
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ marginTop: 8, padding: 2 }}>
                <SegmentedButtons
                    value={content}
                    onValueChange={setContent}
                    buttons={[
                        {
                            value: 'unRead',
                            label: t('unreadMessages'),
                            icon: "email-outline"
                        },
                        {
                            value: 'read',
                            label: t('readMessages'),
                            icon: "email-open-outline"
                        }
                    ]}
                />
            </View>
            <View style={{ flex: 1 }}>
                {content === "unRead"
                    ? <UnReadMessages />
                    : <ReadMessage />
                }
            </View>
        </SafeAreaView>
    );
};

export default Message;

