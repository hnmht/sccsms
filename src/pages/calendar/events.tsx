import { View } from "react-native";
import { Text, IconButton, Surface, MD3Theme } from "react-native-paper";
import { DateTimeFormat, dayjs } from "../../i18n/dayjs";
import { Calendar } from "../../dataType/types/calendar";
import { VoucherStatus } from "../../constant/voucherStatus";
import { TFunction } from "i18next";

interface EventsProps {
    events: Calendar[];
    theme: MD3Theme;
    t: TFunction
}

const Events = ({ events, theme, t }: EventsProps) => {    
    return (
        <>
            {events.length > 0
                ? events.map(dayEvents => {
                    return (
                        <Surface key={dayEvents.date} style={{ display: "flex", flexDirection: "row", marginHorizontal: 4 }}>
                            <View style={{ flex: 1, alignItems: "center" }}>
                                <Text variant="headlineLarge" style={{ color: theme.colors.secondary }}> {dayjs(dayEvents.date).format("D")} </Text>
                                <Text variant="titleMedium" style={{ color: theme.colors.secondary }}>{DateTimeFormat(dayEvents.date, "llll")}</Text>
                            </View>
                            <View style={{ flex: 4 }}>
                                {dayEvents.events.map(event => (
                                    <View key={event.id} style={{ backgroundColor: theme.colors.background, margin: 4, width: "100%" }} >
                                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                            <Text variant="titleLarge" style={{ color: theme.colors.primary }}>{DateTimeFormat(event.start, "LT") + "-" + DateTimeFormat(event.end, "LT")}</Text>
                                            <IconButton icon="circle" iconColor={event.backgroundColor} />
                                        </View>
                                        <Text>{event.title}</Text>
                                        <Text>{t("status")} : {t(VoucherStatus[event.status])}</Text>
                                        <Text>{t("creator")} : {event.creator.name}</Text>
                                        <Text>{t("hDescription")} : {event.hDescription}</Text>
                                        <Text>{t("bDescription")}: {event.bDescription}</Text>
                                        <Text>{t("billNumber")}: {event.billNumber}</Text>
                                        <Text>{t("rowNumber")} : {event.rowNumber}</Text>
                                    </View>
                                ))}
                            </View>
                        </Surface>)
                })
                : <View style={{ width: "100%", alignItems: "center", justifyContent: "center", marginTop: 16 }}>
                    <Text variant="bodyMedium">{t("noData")}</Text>
                </View>
            }
        </>
    );
};

export default Events;