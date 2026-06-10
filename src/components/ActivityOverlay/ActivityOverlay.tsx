import { Modal, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

interface ActivityOverlayProps {
    visible: boolean;
    description: string;
}

function ActivityOverlay({ visible, description }: ActivityOverlayProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
        >
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F8F8FFA6" }}>
                <ActivityIndicator size={"large"} animating={visible} style={{ marginBottom: 16 }} />
                <Text variant="titleMedium" style={{ marginBottom: 16 }} maxFontSizeMultiplier={1.5}>{description}</Text>
            </View>
        </Modal>);
};

export default ActivityOverlay;
