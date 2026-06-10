import { TouchableOpacity, Text, StyleSheet, useWindowDimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useTranslation } from "react-i18next";
import Icon from "@react-native-vector-icons/material-design-icons";
import { pubParams } from "../pub/pubParams";

const itemSpace = 12;
interface ScFuncIconProps {
    colors: string[];
    iconName: "bookmark-multiple" | "run-fast" | "clipboard-text-search" | "bell-check" | "book-open-outline" | "folder-open-outline" | "google-classroom" | "face-mask-outline";
    title: string;
    onTouch: () => void;
    iconColor: string;
    textColor: string;
    disabled: boolean;
}

function ScFuncIcon({ colors, iconName, title, onTouch, iconColor, textColor, disabled }: ScFuncIconProps) {
    const { t } = useTranslation();
    const screen = useWindowDimensions();
    const rowWidth = screen.width - itemSpace * 2;
    const itemWidth = rowWidth / 2;
    const itemHeight = itemWidth / 1.6;
    return (
        <TouchableOpacity
            style={{
                width: itemWidth,
                height: itemHeight,
                margin: itemSpace / 2,
                borderRadius: 15,
            }}
            onPress={onTouch}
            disabled={disabled}
        >
            <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.linearGradient}>
                <Icon name={iconName} color={iconColor} size={32 / pubParams.screen.fontScale}  />
                <Text style={{ ...styles.text, color: textColor }} allowFontScaling={false} >{t(title)}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

export default ScFuncIcon;

const styles = StyleSheet.create({
    linearGradient: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
    },    
    text: {
        marginTop: 10,
        fontSize: 16,
        textAlign: "center",
    }
});