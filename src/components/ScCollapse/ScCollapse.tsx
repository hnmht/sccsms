import { View, StyleProp, ViewStyle } from "react-native";

interface ScCollapseProps {
    children: React.ReactNode;
    expanded: boolean;
    style?: StyleProp<ViewStyle>;
}

const ScCollapse = ({ children, expanded, style }: ScCollapseProps) => {
    return (
        <View style={{ ...style }}>
            {expanded
                ? children
                : null
            }
        </View>
    );
};

export default ScCollapse;