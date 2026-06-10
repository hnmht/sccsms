import { TFunction } from "i18next";
import { View } from "react-native";
import { MD3Theme, Text } from "react-native-paper";

interface ScTableCellProps {
    title: string;
    content: string | number | any;
    isEndCell: boolean;
    theme: MD3Theme;
    t:TFunction
}

function ScTableCell({ title, content, theme, isEndCell,t }: ScTableCellProps) {
    return (
        <View style={{ width: "100%", flexDirection: "row" }}>
            <Text
                variant="bodyMedium"
                style={{
                    width: "30%",
                    borderColor: "grey",
                    color: theme.colors.primary,
                    borderWidth: 1,
                    borderRightWidth: 0,
                    borderBottomWidth: isEndCell ? 1 : 0,
                    textAlign: "right",
                    padding: 2,
                    paddingRight: 4
                }}
                maxFontSizeMultiplier={1.2}
            >
                {t(title)}
            </Text>
            <Text
                variant="bodyMedium"
                style={{
                    width: "70%",
                    borderColor: "grey",
                    borderWidth: 1,
                    textAlign: "right",
                    borderBottomWidth: isEndCell ? 1 : 0,
                    padding: 2,
                    paddingRight: 4
                }}
                maxFontSizeMultiplier={1.2}
            >
                {content}
            </Text>
        </View>
    );
};

export default ScTableCell;