import { ScrollView, View } from "react-native";
import { ActivityIndicator, Card, MD3Theme, Text } from "react-native-paper";

import { DateTimeFormat } from "../../i18n/dayjs";
import PersonAvatar from "../../components/PersonAvatar/PersonAvatar";
import ScFunctionTitle from "../../components/ScFunctionTitle/ScFunctionTitle";
import { pubParams } from "../../components/pub/pubParams";
import { EOCommentRecord } from "../../dataType/types/executionOrder";
import { TFunction } from "i18next";
import ScHandSwitch from "../../components/ScHandSwitch/ScHandSwitch";

interface CommentListProps {
    comments: EOCommentRecord[];
    onCancel: () => void;
    theme: MD3Theme;
    t: TFunction;
}
function CommentsList({
    comments = [],
    onCancel,
    theme,
    t }: CommentListProps) {
    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScFunctionTitle icon={"playlist-star"} title="commentsList" theme={theme} t={t} />
            <View style={{ flex: 1 }}>
                {comments
                    ? <ScrollView>
                        {comments.length > 0
                            ? comments.map(item => {
                                let hasRead = item.isRead === 0 ? t("unread") : t("read");
                                return (
                                    <Card key={item.id} style={{ marginVertical: 4 }}>
                                        <Card.Title
                                            title={`${item.creator.name} ${t("sendTo")} ${item.sendTo.name} ${hasRead}`}
                                            subtitle={DateTimeFormat(item.createDate, "LLL") + " " + t("rowNumber") + " : " + item.rowNumber}
                                            left={() => <PersonAvatar url={item.creator.avatar.fileUrl} name={item.creator.name} />}
                                            titleStyle={{ fontSize: 20 / pubParams.screen.fontScale }}
                                            subtitleStyle={{ fontSize: 16 / pubParams.screen.fontScale }}
                                        />
                                        <Card.Content>
                                            <Text variant="bodyLarge" style={{ color: theme.colors.primary }} maxFontSizeMultiplier={1.5}>{item.content}</Text>
                                        </Card.Content>
                                    </Card>
                                )
                            })
                            : <View style={{ width: "100%", alignItems: "center", justifyContent: "center", marginTop: 16 }}>
                                <Text variant="bodyMedium" maxFontSizeMultiplier={1}>{t("noData")}</Text>
                            </View>
                        }
                    </ScrollView>
                    : <ActivityIndicator animating={true} style={{ marginTop: 16 }} />
                }
            </View>
            <ScHandSwitch
                refreshDisplay={false}
                docRefresh={() => { }}
                cancelAction={onCancel}
                theme={theme}
                t={t}
            />
        </View>
    )
};

export default CommentsList;