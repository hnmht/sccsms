import { useState } from "react";
import { View } from "react-native";
import { Menu, Text, Button, MD3Theme } from "react-native-paper";
import { TFunction } from "i18next";
import { DateTimeFormat, dayjs } from "../../i18n/dayjs";
import { DateInterval } from "../../dataType/types/dashboard";

interface ActionsProps {
    interval: DateInterval;
    dateIntervals: DateInterval[];
    setInterval: (value: DateInterval) => void;
    theme: MD3Theme;
    t: TFunction
}

function Actions({ interval, dateIntervals, setInterval, theme, t }: ActionsProps) {
    const [menuVisible, setMenuVisible] = useState(false);
    const handleSelectInterval = (item: DateInterval) => {
        setInterval(item);
        setMenuVisible(false);
    };

    return (
        <View style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                    <View style={{width:"100%"}}>
                        <Button mode="contained" onPress={() => setMenuVisible(true)} maxFontSizeMultiplier={1.2}>{t(interval.label)}</Button>
                    </View>
                }
                anchorPosition="bottom"
            >
                {dateIntervals.map(item =>
                    <Menu.Item onPress={() => handleSelectInterval(item)} key={item.id} title={t(item.label)} />
                )}
            </Menu>
            <View style={{ justifyContent: "center", alignItems: "center", paddingRight: 8 }}>
                <Text variant="titleMedium" allowFontScaling={false} >{t("dateRangeDescription", { startDate: DateTimeFormat(interval.startDate, "L"), endDate: DateTimeFormat(interval.endDate, "L") })}</Text>
            </View>

        </View>);
};

export default Actions;