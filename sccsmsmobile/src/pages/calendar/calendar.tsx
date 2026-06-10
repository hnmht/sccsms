import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, RefreshControl, View, ScrollView } from "react-native";
import { useTheme, Surface, IconButton } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { dayjs } from "../../i18n/dayjs";
import { reqGetEvents } from "../../api/event";
import { generateDefaultUserEvents, transEdrsAndWorsToCalendar, transEventsToCalendar } from "./constructor";
import { getAllDynamicDataOnline } from "../../store/pub";
import Events from "./events";
import { useAppSelector } from "../../store/hooks";
import ScSegmentLocalOrRemote from "../../components/ScSegmentLocalOrRemote/ScDegmentLocalOrRemote";
import { UserEvents } from "../../dataType/types/event";
import ScInput from "../../components/ScInput";
import { ErrMsg, InitialValueMap } from "../../dataType/types/scInput";
import { Person } from "../../dataType/types/person";

const ScCalendar = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isOffline = useAppSelector(state => state.appInfo.isOffline);
    const woRefs = useAppSelector(state => state.dynamicData.woRefs);
    const eoRefs = useAppSelector(state => state.dynamicData.eoRefs);
    const [localOrRemote, setLocalOrRemote] = useState<"local" | "remote">("local");
    const [ues, setUes] = useState<UserEvents>(generateDefaultUserEvents());
    const [isLoading, setIsLoading] = useState(false);

    const remoteEvents = transEventsToCalendar(ues.events);
    const localEvents = transEdrsAndWorsToCalendar(woRefs, eoRefs);
    const displayEvents = localOrRemote === "local" ? localEvents : remoteEvents;

     useEffect(() => {
        async function getEvents() {
            if (localOrRemote !== "local") {
                handleRemoteEvents();
            }
        }
        getEvents();
    }, [localOrRemote]);

    const handleGetValue = async<T extends keyof InitialValueMap>(
        value: InitialValueMap[T],
        itemKey: string,
        positionID: 0 | 1 | 2,
        rowIndex: number,
        errMsg: ErrMsg
    ) => {
        if (ues === undefined) {
            return
        }
        setUes((prev: UserEvents) => {
            if (prev === undefined) {
                return prev
            }
            let newUes = { ...prev };
            // handle known keys explicitly and fall back to a typed assertion for others
            if (itemKey === "end") {
                newUes.end = dayjs(value as string).endOf("day").toISOString();
            } else if (itemKey === "person") {
                newUes.person = value as Person;
                newUes.userID = (value as Person).id;
            } else {
                (newUes as any)[itemKey] = value;
            }
            
            return newUes;
        });
    };

    // Get UserEvents data from backend
    const handleRemoteEvents = async () => {
        setIsLoading(true);
        let newEvents = generateDefaultUserEvents();
        const res = await reqGetEvents(ues);
        if (res.status) {
            if (res.data.resultNumber > 0) {
                newEvents = res.data;
            }
        }
        setUes(newEvents);
        setIsLoading(false);
    };

    // Actions after pull down to refresh
    const handleRefresh = () => {
        if (isOffline === 1) {
            Alert.alert(t("tip"), t(`offlineRequestUnavailable`))
            return
        }

        if (localOrRemote === "local") {
            setIsLoading(true);
            getAllDynamicDataOnline();
            setIsLoading(false);
        } else {
            handleRemoteEvents();
        }
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
            <View style={{ marginTop: 8, width: "100%", padding: 2 }}>
                <ScSegmentLocalOrRemote
                    localOrRemote={localOrRemote}
                    setLocalOrRemote={setLocalOrRemote}
                    theme={theme}
                    t={t}
                    isOffline={isOffline}
                />
            </View>
            <ScrollView
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} colors={[theme.colors.primary]} />}
                style={{ flex: 1 }}
            >
                <Events
                    events={displayEvents}
                    theme={theme}
                    t={t}
                />
            </ScrollView>
            {localOrRemote === "remote"
                ? <Surface style={{ width: "100%" }}>
                    <View style={{ minHeight: 60, width: "100%", flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 2 }}>
                        <ScInput
                            dataType={306}
                            allowNull={false}
                            isEdit={true}
                            itemShowName="startDate"
                            errInfo={{ isErr: false, msg: "" }}
                            itemKey="start"
                            initValue={ues.start}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="start"
                            positionID={0}
                            rowIndex={-1}
                            width="50%"
                        />
                        <ScInput
                            dataType={306}
                            allowNull={false}
                            isEdit={true}
                            itemShowName="endDate"
                            errInfo={{ isErr: false, msg: "" }}
                            itemKey="end"
                            initValue={ues.end}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="end"
                            positionID={0}
                            rowIndex={-1}
                            width="50%"
                        />
                        <ScInput
                            dataType={510}
                            allowNull={false}
                            isEdit={true}
                            itemShowName="person"
                            errInfo={{ isErr: false, msg: "" }}
                            itemKey="person"
                            initValue={ues.person}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="person"
                            positionID={0}
                            rowIndex={-1}
                            width="80%"
                        />
                        <View style={{ width: "20%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <IconButton
                                icon={"refresh"}
                                onPress={handleRefresh}
                                iconColor={theme.colors.primary}
                            />
                        </View>
                    </View>
                </Surface>
                : null
            }
        </SafeAreaView>
    );
};

export default ScCalendar;
