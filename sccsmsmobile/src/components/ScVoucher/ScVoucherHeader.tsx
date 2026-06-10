import { ReactNode, useState } from "react";
import { Surface, Text, Divider, IconButton, MD3Theme } from "react-native-paper";
import Icon from "@react-native-vector-icons/material-design-icons";
import ScCollapse from "../ScCollapse/ScCollapse";
import { TFunction } from "i18next";

interface ScVoucherHeaderProps {
    children: ReactNode;
    isHeaderErr: boolean;
    title: string;
    theme: MD3Theme;
    t: TFunction;
    buttonPosition: "left" | "right";
}

function ScVoucherHeader({
    children,
    isHeaderErr = false,
    title = "header",
    buttonPosition = "right",
    theme,
    t,
}: ScVoucherHeaderProps
) {
    const [headerCollapse, setHeaderCollapse] = useState(true);
    return (
        <>
            <Surface key="voucherHeadDivider" style={{ flexDirection: buttonPosition === "right" ? "row" : "row-reverse", alignItems: "center",  marginBottom: 16, backgroundColor: theme.colors.surfaceVariant }}>
                <Text variant="bodyMedium" style={{ paddingRight: 4 }}>{t(title)}</Text>
                {
                    isHeaderErr ? <Icon name="alert" size={24} color="red" /> : <Icon name="check" size={24} color="green" />
                }
                <Divider bold style={{ flex: 1 }} />
                <IconButton
                    mode="contained"
                    icon={headerCollapse ? "chevron-double-up" : "chevron-double-down"}
                    size={16}
                    onPress={() => setHeaderCollapse(!headerCollapse)}
                />
            </Surface>
            <ScCollapse key="voucherHeader" expanded={headerCollapse} style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start", padding: 4 }}>
                {children}
            </ScCollapse>
        </>
    );
};

export default ScVoucherHeader;