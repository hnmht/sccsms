import { useRef } from "react";
import { AnimatedFAB, IconButton, MD3Theme } from "react-native-paper";
import { TFunction } from "i18next";
import { Alert, PanResponder, View } from "react-native";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { changeSwapPosition, setBottomDistance, changeOrderVisible } from "../../store/slice/swapPosition";

interface ScHandSwitchProps {
    refreshDisplay: boolean;
    docRefresh: () => void;
    cancelAction: () => void;
    theme: MD3Theme;
    t: TFunction;
}

function ScHandSwitch(props: ScHandSwitchProps) {
    const { refreshDisplay = true, docRefresh, cancelAction, theme, t } = props;
    const dispatch = useAppDispatch();
    const isOffline = useAppSelector(state => state.appInfo.isOffline);
    // Command buttons position
    const { buttonPosition, swapPosition, orderPosition, bottomDistance, orderVisible } = useAppSelector(state => state.swapPosition);
    // Switch command buttons postion
    const handleSwapPosition = () => {
        dispatch(changeSwapPosition());
    };

    // Switch order button visibility
    const handleOrderVisible = () => {
        dispatch(changeOrderVisible());
    };

    // Drag to change bottomDistance using PanResponder
    const MIN_BOTTOM = 128;   // clamp min
    const MAX_BOTTOM = 480;  // clamp max
    const startBottomRef = useRef<number>(bottomDistance); 

    const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                startBottomRef.current = bottomDistance;
            },
            // onPanResponderMove: (_evt, gestureState) => {
            //     // gestureState.dy > 0 means finger moved down -> increase bottom
            //     const newBottom = clamp(startBottomRef.current - gestureState.dy, MIN_BOTTOM, MAX_BOTTOM);
            //     // setTempBottom(newBottom);
            //     dispatch(setBottomDistance(newBottom));
            // },
            onPanResponderRelease: (_evt, gestureState) => {
                const finalBottom = clamp(startBottomRef.current - gestureState.dy, MIN_BOTTOM, MAX_BOTTOM);
                // Persist the new bottom distance to redux 
                dispatch(setBottomDistance(finalBottom));
            }
        })
    ).current;

    return (
        <>
            {isOffline === 0 && refreshDisplay && orderVisible
                ? <AnimatedFAB
                    icon="refresh"
                    label={t("refresh")}
                    extended={false}
                    visible={true}
                    onPress={docRefresh}
                    animateFrom={buttonPosition}
                    style={{ bottom: bottomDistance, position: "absolute", ...orderPosition }}
                />
                : null
            }
            {orderVisible
                ? <>
                    <AnimatedFAB
                        icon="keyboard-return"
                        label={t("back")}
                        extended={false}
                        visible={true}
                        onPress={cancelAction}
                        animateFrom={buttonPosition}
                        style={{ bottom: bottomDistance - 64, position: "absolute", ...orderPosition }}
                    />
                    <IconButton
                        icon="swap-horizontal"
                        iconColor={theme.colors.primary}
                        onPress={handleSwapPosition}
                        style={{ bottom: bottomDistance + 48, position: "absolute", ...swapPosition }}
                    />
                    {/* Drag handle wrapper: attach pan handlers here */}
                    <View {...panResponder.panHandlers} style={{ position: "absolute", bottom: bottomDistance, ...swapPosition }}>
                        <IconButton
                            id="dragSwap"
                            icon="swap-vertical"
                            iconColor={theme.colors.primary}
                            onPress={() => { Alert.alert(t("dragToReposition")) }}
                        />
                    </View>
                </>
                : null
            }
            <IconButton
                icon={orderVisible ? "eye" : "eye-off"}
                iconColor={theme.colors.primary}
                onPress={handleOrderVisible}
                style={{ bottom: bottomDistance + 96, position: "absolute", ...swapPosition }}
            />
        </>
    );
}

export default ScHandSwitch;