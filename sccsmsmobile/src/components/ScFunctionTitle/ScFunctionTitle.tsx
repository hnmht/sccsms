import { MD3Theme, Surface, Text } from "react-native-paper";
import Icon from "@react-native-vector-icons/material-design-icons";
import { TFunction } from "i18next";

interface ScFUnctionTitleProps {
    title: string;
    icon: "bookmark-multiple" | "run-fast" | "clipboard-text-search" | "bell-check" | "book-open-outline" | "folder-open-outline" | "google-classroom" | "face-mask-outline" | "playlist-star";
    theme: MD3Theme;
    t: TFunction
}
const ScFunctionTitle = ({ title, icon, theme, t }: ScFUnctionTitleProps) => {
    return (
        <Surface style={{ height: 48, justifyContent: "flex-start", paddingLeft: 4, flexDirection: "row", alignItems: "center" }}>
            <Icon name={icon} color={theme.colors.secondary} size={24} />
            <Text variant="titleMedium" style={{ paddingLeft: 4 }} allowFontScaling={false}>{t(title)}</Text>
        </Surface>
    );
};

export default ScFunctionTitle;