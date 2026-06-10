import React, { useEffect, useState } from "react";
import { Modal, View, Platform } from "react-native";
import { useSafeAreaInsets, SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

interface ScComponentModalProps {
    visible: boolean;
    onRequestClose?: () => void;
    children: React.ReactNode;
}

export function ScComponentModal({
    visible,
    onRequestClose,
    children,
}: ScComponentModalProps) {
    const insets = useSafeAreaInsets();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!visible) {
            setReady(false);
            return;
        }

        if (Platform.OS === "android") {
            setReady(true);
            return;
        }

        if (insets.top > 0 || insets.bottom > 0) {
            setReady(true);
        }
    }, [visible, insets.top, insets.bottom]);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={onRequestClose}
        >
            <SafeAreaProvider>
                <SafeAreaView  edges={["top"]} style={{ flex: 1 }}>
                    {ready ? (
                        children
                    ) : (
                        <View style={{ flex: 1 }} />
                    )}
                </SafeAreaView>
            </SafeAreaProvider>
        </Modal>
    );
}
