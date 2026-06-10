import { View } from "react-native";
import { useTheme } from "react-native-paper";
import ScFuncIcon from "../../components/ScFuncIcon/ScFuncIcon";
import { useAppSelector } from "../../store/hooks";
import { useBusinessNavigation } from "../../navigation/config/screenParams";

const BusinessScreen = () => {
    const navigation = useBusinessNavigation();
    const theme = useTheme();
    const isOffLine = useAppSelector(state => state.appInfo.isOffline);
    const colors1 = [theme.colors.primaryContainer, theme.colors.secondaryContainer, theme.colors.tertiaryContainer];
    const colors2 = [theme.colors.tertiaryContainer, theme.colors.secondaryContainer, theme.colors.primaryContainer];
    const menuList = useAppSelector(state => state.user.menuList);
    const authWorkOrder = menuList.some(item => item.id === 110);
    const authExcuteDoc = menuList.some(item => item.id === 210);
    const authExcuteDocReview = menuList.some(item => item.id === 220);
    const authDisposeDoc = menuList.some(item => item.id === 310);
    const authAddressBook = menuList.some(item => item.id === 20);
    const authLookupDocument = menuList.some(item => item.id === 530);
    const authReciveTraining = menuList.some(item => item.id === 640);
    const authLpaIssuedQuery = menuList.some(item => item.id === 740);
    return (
        <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
            {authWorkOrder
                ? <ScFuncIcon
                    key="workOrderList"
                    colors={colors1}
                    iconName="bookmark-multiple"
                    title="MenuWOList"
                    iconColor={theme.colors.primary}
                    textColor={theme.colors.primary}
                    onTouch={() => navigation.navigate("WorkOrderList")}
                    disabled={false}
                />
                : null
            }
            {authExcuteDoc
                ? <ScFuncIcon
                    key="executeDocList"
                    colors={colors1}
                    iconName="run-fast"
                    title="MenuEOList"
                    iconColor={theme.colors.primary}
                    textColor={theme.colors.primary}
                    onTouch={() => navigation.navigate("ExecutionOrderList")}
                    disabled={false}
                />

                : null
            }
            {authExcuteDocReview && isOffLine === 0
                ? <ScFuncIcon
                    key="executeDocReviewList"
                    colors={colors1}
                    iconName="clipboard-text-search"
                    title="MenuEOReviewList"
                    iconColor={theme.colors.primary}
                    textColor={theme.colors.primary}
                    onTouch={() => navigation.navigate("ExecutionOrderReviewList")}
                    disabled={false}
                />
                : null
            }
            {authDisposeDoc
                ? <ScFuncIcon
                    key="disposeDocList"
                    colors={colors1}
                    iconName="bell-check"
                    title="MenuIRFList"
                    iconColor={theme.colors.primary}
                    textColor={theme.colors.primary}
                    onTouch={() => navigation.navigate("IssueResolutionFormList")}
                    disabled={false}
                />
                : null
            }
            {authAddressBook
                ? <ScFuncIcon
                    key="addressBook"
                    colors={colors2}
                    iconName="book-open-outline"
                    title="MenuAddressBook"
                    iconColor={theme.colors.primary}
                    textColor={theme.colors.primary}
                    onTouch={() => navigation.navigate("AddressBook")}
                    disabled={false}
                />
                : null
            }
            {authLookupDocument && isOffLine === 0
                ? <ScFuncIcon
                    key="lookupDocument"
                    colors={colors2}
                    iconName="folder-open-outline"
                    title="MenuDocumentFind"
                    iconColor={theme.colors.primary}
                    textColor={theme.colors.primary}
                    onTouch={() => navigation.navigate("DocumentSearch")}
                    disabled={false}
                />
                : null
            }
            {authReciveTraining && isOffLine === 0
                ? <ScFuncIcon
                    key="reciveTraining"
                    colors={colors2}
                    iconName="google-classroom"
                    title="MenuTPS"
                    iconColor={theme.colors.primary}
                    textColor={theme.colors.primary}
                    onTouch={() => navigation.navigate("ReceivedTraining")}
                    disabled={false}
                />
                : null
            }
            {authLpaIssuedQuery && isOffLine === 0
                ? <ScFuncIcon
                    key="lpaQuery"
                    colors={colors2}
                    iconName="face-mask-outline"
                    title="MenuPPES"
                    iconColor={theme.colors.primary}
                    textColor={theme.colors.primary}
                    onTouch={() => navigation.navigate("PPEReport")}
                    disabled={false}
                />
                : null
            }
        </View>
    );
};

export default BusinessScreen;
