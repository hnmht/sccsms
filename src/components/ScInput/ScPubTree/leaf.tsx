import { View, TouchableOpacity, StyleProp, ViewStyle } from "react-native";

interface listProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

interface listItemButtonProps {
    children: React.ReactNode;
    onPress: () => void;
    onLongPress: () => void;
    disabled: boolean;
}

export const List = ({ children, style }: listProps) => {
    return (
        <View style={{ ...style }}>
            {children}
        </View>
    );
};

export const ListItem = ({ children, style }: listProps) => {
    return (
        <View style={{
            ...style,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start"
        }}>
            {children}
        </View>
    );
};

export const ListItemButton = ({ children, onPress, onLongPress, disabled }: listItemButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress} onLongPress={onLongPress} disabled={disabled}>
            {children}
        </TouchableOpacity>
    )
};

