import { ReactNode, useState } from "react";
import { Surface, Text, Divider, IconButton, MD3Theme } from "react-native-paper";
import ScCollapse from "../ScCollapse/ScCollapse";
import Icon from "@react-native-vector-icons/material-design-icons";
import { TFunction } from "i18next";

interface ScVoucherFootProps {
    children: ReactNode;
    isFooterErr: boolean;
    title: string;
    buttonPosition: "left" | "right";
    theme: MD3Theme;
    t: TFunction;
}

function ScVoucherFooter({
    children,
    isFooterErr = false,
    title = "footer",
    buttonPosition = "right",
    theme,
    t,
}: ScVoucherFootProps) {
    const [footerCollapse, setFooterCollapse] = useState(false);
    
    return (
        <>
            <Surface key="voucherFooterDivider" style={{ flexDirection: buttonPosition === "right" ? "row" : "row-reverse", alignItems: "center",marginBottom: 16, backgroundColor: theme.colors.surfaceVariant }}>
                <Text variant="bodyMedium" style={{ paddingRight: 4 }}>{t(title)}</Text>
                {
                    isFooterErr ? <Icon name="alert" size={24} color="red" /> : <Icon name="check" size={24} color="green" />
                }
                <Divider bold style={{ flex: 1 }} />
                <IconButton
                    mode="contained"
                    icon={footerCollapse ? "chevron-double-up" : "chevron-double-down"}
                    size={16}
                    onPress={() => setFooterCollapse(!footerCollapse)}
                />
            </Surface>
            <ScCollapse expanded={footerCollapse} style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start", padding: 4 }}>
                {children}
            </ScCollapse>
        </>
    );
};

export default ScVoucherFooter;