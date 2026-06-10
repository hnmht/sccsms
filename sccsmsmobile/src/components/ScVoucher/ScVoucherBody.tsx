import { ReactNode } from "react";
import { View } from "react-native";
import { Surface, Text, Divider, IconButton, Button, MD3Theme } from "react-native-paper";
import Icon from "@react-native-vector-icons/material-design-icons";
import { TFunction } from "i18next";

interface ScVoucherBodyProps<T> {
    children: ReactNode;
    title: string;
    buttonPosition: "left" | "right";
    isBodyErr: boolean;
    isEdit: boolean;
    addRowDisabled:boolean;
    addRowAction: () => void,
    totalRows: number;
    bodyMenu: ReactNode;
    currentRowIndex: number,
    setCurrentRowIndex: (index: number) => void,
    theme: MD3Theme;
    t: TFunction;
}

function ScVoucherBody<T>({
    children,
    title = "body",
    buttonPosition = "right",
    isBodyErr,
    isEdit,
    addRowDisabled=true,
    addRowAction,
    totalRows,
    bodyMenu,
    currentRowIndex = 0,
    setCurrentRowIndex,
    theme,
    t
}: ScVoucherBodyProps<T>) {
    // Switch to the previous row 
    const handlePrevRow = () => {
        setCurrentRowIndex(currentRowIndex - 1);
    };
    // Switch to the first row
    const handleFirstRow = () => {
        setCurrentRowIndex(0);
    };
    // Switch to the next row
    const handleNextRow = () => {
        setCurrentRowIndex(currentRowIndex + 1);
    };
    // Switch to the last row
    const handleLastRow = () => {
        setCurrentRowIndex(totalRows - 1);
    };
    return (
        <>
            <Surface key="voucherBodyDivider" style={{ flexDirection: buttonPosition === "right" ? "row" : "row-reverse", alignItems: "center",marginBottom: 16, backgroundColor: theme.colors.surfaceVariant }}>
                <Text variant="bodyMedium" style={{ paddingRight: 4 }}>{t(title)}</Text>
                {
                    isBodyErr ? <Icon name="alert" size={24} color="red" /> : <Icon name="check" size={24} color="green" />
                }
                <Divider bold style={{ flex: 1 }} />
                {isEdit
                    ? < Button
                        onPress={addRowAction}
                        key={"addRow"}
                        icon="playlist-plus"
                        textColor={theme.colors.primary}
                        disabled={addRowDisabled}
                    >
                        {t("addRow")}
                    </Button>
                    : null
                }
                {bodyMenu}
            </Surface>
            <View key="voucherBody" style={{ flex: 1 }}>
                <View key="voucherBodyAction2" style={{ height: 40, flexDirection: buttonPosition === "right" ? "row-reverse" : "row", justifyContent: "flex-start", alignItems: "center", padding: 4 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <IconButton
                            key={"FirstRow"}
                            onPress={handleFirstRow}
                            disabled={currentRowIndex === 0 || totalRows === 0}
                            icon="chevron-double-left"
                            iconColor={theme.colors.primary} />
                        <IconButton
                            key={"PrevRow"}
                            onPress={handlePrevRow}
                            disabled={currentRowIndex === 0 || totalRows === 0}
                            icon="chevron-left"
                            iconColor={theme.colors.primary} />
                        <IconButton
                            key={"NextRow"}
                            onPress={handleNextRow}
                            disabled={totalRows - 1 === currentRowIndex || totalRows === 0}
                            icon="chevron-right"
                            iconColor={theme.colors.primary} />
                        <IconButton
                            key={"LastRow"}
                            onPress={handleLastRow}
                            disabled={totalRows - 1 === currentRowIndex || totalRows === 0}
                            icon="chevron-double-right"
                            iconColor={theme.colors.primary} />
                    </View>
                    <Text>{totalRows === 0 ? "0/0" : `${currentRowIndex + 1}/${totalRows}`}</Text>
                </View>
                <View key={`voucherBodyRow${currentRowIndex}`} style={{ flexDirection: "row", flexWrap: "wrap",padding:4 }}>
                    {children}
                </View>
            </View>
        </>
    );
};

export default ScVoucherBody;

