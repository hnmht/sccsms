import { useState, useEffect } from "react";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import ScFunctionTitle from "../../components/ScFunctionTitle/ScFunctionTitle";
import LocalIRFList from "./localIRFList";
import RemoteIRFList from "./remoteIRFList";
import ScHandSwitch from "../../components/ScHandSwitch/ScHandSwitch";
import ScSegmentLocalOrRemote from "../../components/ScSegmentLocalOrRemote/ScDegmentLocalOrRemote";

import { useBusinessNavigation } from "../../navigation/config/screenParams";
import { useAppSelector } from "../../store/hooks";

function IssueResolutionFormList() {
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
    // Toggle Remote/Local IRF list
    const handleChangeDataSource = (value: "local" | "remote") => {
        setLocalOrRemote(value);
    };
    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
            <ScFunctionTitle title={"MenuIRFList"} icon="bell-check" theme={theme} t={t} />
            <ScSegmentLocalOrRemote
                localOrRemote={localOrRemote}
                setLocalOrRemote={handleChangeDataSource}
                theme={theme}
                t={t}
                isOffline={isOffline}
            />
            {localOrRemote === "remote"
                ? <RemoteIRFList
                    theme={theme}
                    t={t}
                    isOffline={isOffline === 1}
                    navigation={navigation} />
                : <LocalIRFList
                    theme={theme}
                    t={t}
                    isOffline={isOffline === 1}
                    navigation={navigation} />
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

export default IssueResolutionFormList;