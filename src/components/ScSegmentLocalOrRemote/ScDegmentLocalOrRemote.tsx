import { TFunction } from "i18next";
import { View } from "react-native";
import { MD3Theme, SegmentedButtons } from "react-native-paper";

interface ScSegmentLocalOrRemoteProps {
    localOrRemote: "local" | "remote";
    setLocalOrRemote: (value: "local" | "remote") => void;
    theme: MD3Theme;
    t: TFunction;
    isOffline: 0 | 1;
}

function ScSegmentLocalOrRemote({ localOrRemote, setLocalOrRemote, theme, t, isOffline }: ScSegmentLocalOrRemoteProps) {
    return (
        <View style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 40,
            width: "100%",
            backgroundColor: theme.colors.background
        }}>

            <View style={{ width: "100%", minHeight: 42, padding: 2 }}>
                <SegmentedButtons
                    value={localOrRemote}
                    onValueChange={(value) => setLocalOrRemote(value)}
                    buttons={[
                        {
                            value: "local",
                            label: t("local")
                        },
                        {
                            value: "remote",
                            label: t("remote"),
                            disabled: isOffline === 1,
                        }
                    ]}
                />
            </View>
        </View>
    )
}

export default ScSegmentLocalOrRemote;