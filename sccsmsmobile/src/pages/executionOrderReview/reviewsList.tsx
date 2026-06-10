import { ScrollView, View } from "react-native";
import { MD3Theme, Text, Card } from "react-native-paper";
import { TFunction } from "i18next";
import { DateTimeFormat } from "../../i18n/dayjs";
import ScFunctionTitle from "../../components/ScFunctionTitle/ScFunctionTitle";
import { EOReviewedRecord } from "../../dataType/types/executionOrder";
import ScHandSwitch from "../../components/ScHandSwitch/ScHandSwitch";
import PersonAvatar from "../../components/PersonAvatar/PersonAvatar";
import { pubParams } from "../../components/pub/pubParams";

interface ReviewsListProps {
    reviews: EOReviewedRecord[];
    onCancel: () => void;
    theme: MD3Theme;
    t: TFunction;
}

function ReviewsList({ reviews, onCancel, theme, t }: ReviewsListProps) {
    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScFunctionTitle icon={"playlist-star"} title="reviewRecords" theme={theme} t={t} />
            <ScrollView style={{ flex: 1 }}>
                {reviews.length > 0
                    ? reviews.map(item => {
                        return (
                            <Card key={item.id}>
                                <Card.Title
                                    title={`${item.creator.name}`}
                                    subtitle={DateTimeFormat(item.createDate, "LL")}
                                    left={() => <PersonAvatar url={item.creator.avatar.fileUrl} name={item.creator.name} />}
                                    titleStyle={{ fontSize: 20 / pubParams.screen.fontScale }}
                                    subtitleStyle={{ fontSize: 16 / pubParams.screen.fontScale }}
                                />
                                <Card.Content>
                                    <Text variant="bodyMedium" maxFontSizeMultiplier={1.5}>{t("startTime")} : {DateTimeFormat(item.startTime, "LTS")}</Text>
                                    <Text variant="bodyMedium" maxFontSizeMultiplier={1.5}>{t("endTime")} : {DateTimeFormat(item.endTime, "LTS")}</Text>
                                    <Text variant="bodyMedium" maxFontSizeMultiplier={1.5}>{t("timeSeconds")} : {item.consumeSeconds}</Text>
                                </Card.Content>
                            </Card>
                        )
                    })
                    : <View style={{ width: "100%", alignItems: "center", justifyContent: "center", marginTop: 16 }}>
                        <Text variant="bodyMedium" maxFontSizeMultiplier={1}>{t("noData")}</Text>
                    </View>
                }
            </ScrollView>
            <ScHandSwitch
                refreshDisplay={false}
                docRefresh={() => { }}
                cancelAction={onCancel}
                theme={theme}
                t={t}
            />
        </View>
    );
};

export default ReviewsList;