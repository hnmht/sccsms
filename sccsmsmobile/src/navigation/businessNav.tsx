import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BusinessScreen from "../pages/businessScreen/businessScreen";
import AddressBook from "../pages/addressBook/addressBook";
import WorkOrder from "../pages/workOrder/workOrder";
import WorkOrderList from "../pages/workOrderList/workOrderList";
import ExecutionOrder from "../pages/executionOrder/executionOrder";
import ExecutionOrderList from "../pages/executionOrderList/executionOrderList";
import ExecutionOrderReview from "../pages/executionOrderReview/executionOrderReview";
import ExecutionOrderReviewList from "../pages/executionOrderReviewList/executionOrderReviewList";
import IssueResolutionForm from "../pages/issueResolutionForm/issueResolutionForm";
import IssueResolutionFormList from "../pages/issueResolutionFormList/issueResolutionFormList";
import DocumentSearch from "../pages/documentSearch/documentSearch";
import ReceivedTraining from "../pages/receivedTraining/receivedTraining";
import PPEReport from "../pages/ppeReport/ppeReport";
import { BusinessNavParamList } from "./config/screenParams";
import { useTranslation } from "react-i18next";

const BusinessStack = createNativeStackNavigator<BusinessNavParamList>();
const BusinessNav = () => {
    const { t } = useTranslation();
    return (
        <BusinessStack.Navigator initialRouteName="BusinessScreen">
            <BusinessStack.Screen name="BusinessScreen" options={{ headerShown: true, title: t("business") }} component={BusinessScreen} />
            <BusinessStack.Screen name="AddressBook" options={{ headerShown: false, title: t("MenuAddressBook") }} component={AddressBook} />
            <BusinessStack.Screen
                name="WorkOrder"
                options={{ headerShown: false, title: t("MenuWO") }}
                initialParams={{ isLocal: false, isNew: true, isModify: false, oriWO: undefined }}
                component={WorkOrder}
            />
            <BusinessStack.Screen
                name="WorkOrderList"
                options={{ headerShown: false, title: t("MenuWOList") }}
                component={WorkOrderList}
            />
            <BusinessStack.Screen
                name="ExecutionOrder"
                options={{ headerShown: false, title: t("MenuEO") }}
                initialParams={{ isLocal: false, isNew: true, isModify: false, oriWOR: undefined, oriEO: undefined }}
                component={ExecutionOrder}
            />
            <BusinessStack.Screen
                name="ExecutionOrderList"
                options={{ headerShown: false, title: t("MenuEOList") }}
                component={ExecutionOrderList}
            />
            <BusinessStack.Screen
                name="ExecutionOrderReview"
                options={{ headerShown: false, title: t("MenuEOReview") }}
                component={ExecutionOrderReview}
            />
            <BusinessStack.Screen
                name="ExecutionOrderReviewList"
                options={{ headerShown: false, title: t("MenuEOReviewList") }}
                component={ExecutionOrderReviewList}
            />
            <BusinessStack.Screen
                name="IssueResolutionForm"
                options={{ headerShown: false, title: t("MenuIRF") }}
                component={IssueResolutionForm}
            />
            <BusinessStack.Screen
                name="IssueResolutionFormList"
                options={{ headerShown: false, title: t("MenuIRFList") }}
                component={IssueResolutionFormList}
            />
            <BusinessStack.Screen
                name="DocumentSearch"
                options={{ headerShown: false, title: t("MenuDocumentFind") }}
                component={DocumentSearch}
            />
            <BusinessStack.Screen
                name="ReceivedTraining"
                options={{ headerShown: false, title: t("MenuTPS") }}
                component={ReceivedTraining}
            />
            <BusinessStack.Screen
                name="PPEReport"
                options={{ headerShown: false, title: t("MenuPPES") }}
                component={PPEReport}
            />
        </BusinessStack.Navigator>
    );
};

export default BusinessNav;