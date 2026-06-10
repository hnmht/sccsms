import { useState } from "react";
import { MD3Theme } from "react-native-paper";
import { Menu, Button } from "react-native-paper";
import Icon from "@react-native-vector-icons/material-design-icons";
import { TFunction } from "i18next";
import { ExecutionOrderRow } from "../../dataType/types/executionOrder";
import { eorHasIssue } from "./constructor";

interface EOReviewBodyMenu {
    eoRows: ExecutionOrderRow[];
    setCurrentRowIndex: (index: number) => void;
    theme: MD3Theme;
    t: TFunction;
}

function EOReviewBodyMenu({ eoRows, setCurrentRowIndex, theme, t }: EOReviewBodyMenu) {
    const [rowMenuVisible, setRowMenuVisible] = useState<boolean>(false);
    const handleSelectRow = (index: number) => {
        setRowMenuVisible(false);
        setCurrentRowIndex(index);
    };
    const hasIssue = eorHasIssue(eoRows);
    return (eoRows === undefined
        ? null
        : <Menu
            visible={rowMenuVisible}
            onDismiss={() => setRowMenuVisible(false)}
            anchor={
                < Button
                    onPress={() => setRowMenuVisible(true)}
                    icon="telescope"
                    textColor={hasIssue ? theme.colors.error : theme.colors.primary}
                    disabled={eoRows.length <= 0}
                >
                    {t("quickJump")}
                </Button>
            }
        >
            {eoRows.map((row, index) => {
                return (
                    <Menu.Item
                        leadingIcon={() => row.isIssue === 1 ? <Icon name="alert" size={24} color="red" /> : <Icon name="check" size={24} color="green" />}
                        key={row.rowNumber}
                        onPress={() => handleSelectRow(index)}
                        title={`${t("rowTh", { rowNumber: row.rowNumber })} ${row.epa.name}`}
                        style={{ width: "90%" }}
                        titleStyle={{ width: "100%" }}
                    />
                )
            })

            }
        </Menu>
    )
};


export default EOReviewBodyMenu;