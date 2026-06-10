import { useState, useEffect } from "react";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useBusinessNavigation } from "../../navigation/config/screenParams";
import { useAppSelector } from "../../store/hooks";
import ScSegmentLocalOrRemote from "../../components/ScSegmentLocalOrRemote/ScDegmentLocalOrRemote";
import ScHandSwitch from "../../components/ScHandSwitch/ScHandSwitch";

import ScFunctionTitle from "../../components/ScFunctionTitle/ScFunctionTitle";
import LocalEOList from "./localEOList";
import RemoteEOList from "./remoteEOList";

function ExecutionOrderList() {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigation = useBusinessNavigation();

    const isOffline = useAppSelector(state => state.appInfo.isOffline);
    const [localOrRemote, setLocalOrRemote] = useState<"local" | "remote">(isOffline === 1 ? "local" : "remote");

    const handleGoBack = () => {
        navigation.goBack();
    };
    useEffect(() => {
        let newDisplay = localOrRemote;
        if (isOffline === 1) {
            newDisplay = "local";
        }
        setLocalOrRemote(newDisplay);
    }, [isOffline]);

    // Toggle Remote/Local Execution Order list
    const handleChangeDataSource = (value: "local" | "remote") => {
        setLocalOrRemote(value);
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
            <ScFunctionTitle title={"MenuEOList"} icon="run-fast" theme={theme} t={t} />
            <ScSegmentLocalOrRemote
                localOrRemote={localOrRemote}
                setLocalOrRemote={handleChangeDataSource}
                theme={theme}
                t={t}
                isOffline={isOffline}
            />
            {localOrRemote === "remote"
                ? <RemoteEOList
                    theme={theme}
                    t={t}
                    isOffline={isOffline === 1}
                    navigation={navigation}
                />
                : <LocalEOList
                    theme={theme}
                    t={t}
                    isOffline={isOffline === 1}
                    navigation={navigation}
                />
            }
            <ScHandSwitch
                refreshDisplay={false}
                docRefresh={() => { }}
                cancelAction={handleGoBack}
                theme={theme}
                t={t}
            />
        </SafeAreaView>
    );
};

export default ExecutionOrderList;

