import { useState, useEffect } from "react";
import { useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import ScFunctionTitle from "../../components/ScFunctionTitle/ScFunctionTitle";
import RemoteWorkOrderList from "./remoteWorkOrderList";
import LocalWorkOrderList from "./localWorkOrderList";
import { useAppSelector } from "../../store/hooks";
import { useBusinessNavigation } from "../../navigation/config/screenParams";
import ScSegmentLocalOrRemote from "../../components/ScSegmentLocalOrRemote/ScDegmentLocalOrRemote";
import { SafeAreaView } from "react-native-safe-area-context";
import ScHandSwitch from "../../components/ScHandSwitch/ScHandSwitch";

function WorkOrderList() {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigation = useBusinessNavigation();
    const [localOrRemote, setLocalOrRemote] = useState<"local" | "remote">("local");
    const isOffline = useAppSelector(state => state.appInfo.isOffline);

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

    // Toggle Remote/Local Work Order list
    const handleChangeDataSource = (value: "local" | "remote") => {
        setLocalOrRemote(value);
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
            <ScFunctionTitle title="MenuWOList" icon="bookmark-multiple" theme={theme} t={t} />
            <ScSegmentLocalOrRemote
                localOrRemote={localOrRemote}
                setLocalOrRemote={handleChangeDataSource}
                theme={theme}
                t={t}
                isOffline={isOffline}
            />
            {localOrRemote === "remote"
                ? <RemoteWorkOrderList />
                : <LocalWorkOrderList />
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

export default WorkOrderList;