import { lazy } from "react";
import Loadable from "./component/Loadable";

const PresentationLayout = Loadable(lazy(() => import("./layouts/Presentation"))); 
const Landing = Loadable(lazy(() => import("./pages/presentation/Landing")));
const Page404 = Loadable(lazy(() => import("./pages/auth/Page404"))); 
const Page203 = Loadable(lazy(() => import("./pages/auth/Page203"))); 
const ProtectedPage = Loadable(lazy(() => import("./pages/protected/ProtectedPage"))); 
const AuthGuard = Loadable(lazy(() => import("./layouts/components/guards/AuthGuard"))); 
const AuthLayout = Loadable(lazy(() => import("./layouts/Auth")));
const DownloadApp = Loadable(lazy(() => import("./pages/downloadApp/downloadApp"))); 
const DashboardLayout = Loadable(lazy(() => import("./layouts/Dashboard")));
const SignIn = Loadable(lazy(() => import("./pages/auth/SignIn")));
const Home = Loadable(lazy(() => import("./pages/protected/dashboard/Home"))); // Dashboard
const Calendar = Loadable(lazy(() => import("./pages/protected/calendar/Calendar"))); // Calendar
const AddressBook = Loadable(lazy(() => import("./pages/protected/addressBook/AddressBook")));  // Address Book
// Constrction Site Management
const WorkOrder = Loadable(lazy(() => import("./pages/protected/workOrder/workOrder")));  // Work Order
const ExecutionOrder = Loadable(lazy(() => import("./pages/protected/executionOrder/executionOrder/executeOrder"))); // Execution Order
const ExecutionOrderReview = Loadable(lazy(() => import("./pages/protected/executionOrder/executionOrderReview/executionOrderReView"))); // Execution Order Review
const IssueResolutionForm = Loadable(lazy(() => import("./pages/protected/issueResolutionForm/issueResolutionForm"))); // Issue Resolution Form
const WorkOrderStatus = Loadable(lazy(() => import("./pages/protected/reports/workOrderStatus/WOStatus"))); // Work Order Report
const ExecutionOrderStatus = Loadable(lazy(() => import("./pages/protected/reports/executionOrderStatus/EOStatus"))); // Execution Order report
const IssueResolutionFormStatus = Loadable(lazy(() => import("./pages/protected/reports/issueResolutionFormStatus/IRFStatus"))); // Issue Resolution Form Report
// Document
const DC = Loadable(lazy(() => import("./pages/protected/dc/dc"))); // Doucment Category
const DocumentUpload = Loadable(lazy(() => import("./pages/protected/documentUpload/documentUpload"))); // Upload Document 
const DocumentFind = Loadable(lazy(() => import("./pages/protected/documentFind/documentFind"))); // Document Report
// Training
const TC = Loadable(lazy(() => import("./pages/protected/tc/tc"))); // Training Course
const TrainingRecord = Loadable(lazy(() => import("./pages/protected/trainingRecord/trainingRecord"))); // Training Record
const TaughtLessons = Loadable(lazy(() => import("./pages/protected/taughtLessons/taughtLessons"))); // Taught Lessons Report
const ReceivedTraining = Loadable(lazy(() => import("./pages/protected/receivedTraining/receivedTraining"))); // Recvied Training Report
// Personal Protective Equipment
const PPEQuota = Loadable(lazy(() => import("./pages/protected/ppeQuota/ppeQuota"))); // Personal Protective Equipment (Position) Quota
const PPEIssuanceWizard = Loadable(lazy(() => import("./pages/protected/ppeWizard/ppeWizard"))); // PPE Issuance Wizard
const PPEIssuanceForm = Loadable(lazy(() => import("./pages/protected/ppeIssuanceForm/ppeIssuanceForm"))); // PPE Issuance Form 
const PPEReport = Loadable(lazy(() => import("./pages/protected/ppeReport/ppeReport"))); // PPE Issuance Report
// Msster Data
const Department = Loadable(lazy(() => import("./pages/protected/department/department"))); // Department
const Position = Loadable(lazy(() => import("./pages/protected/position/position"))); // Position
const CSC = Loadable(lazy(() => import("./pages/protected/csc/csc"))); // Construction Site Category
const CSA = Loadable(lazy(() => import("./pages/protected/csa/csa"))); // Construction Site Archive
const UDC = Loadable(lazy(() => import("./pages/protected/udc/udc")));  // User Defined Category
const UDA = Loadable(lazy(() => import("./pages/protected/uda/uda"))); // User Define Archive
const EPC = Loadable(lazy(() => import("./pages/protected/epc/epc")));  // Execution Project Category
const EPA = Loadable(lazy(() => import("./pages/protected/epa/epa"))); // Execution Project
const RiskLevel = Loadable(lazy(() => import("./pages/protected/riskLevel/riskLevel"))); // Risk Level
const PPE = Loadable(lazy(() => import("./pages/protected/ppe/ppe"))); // Personal Protective Equipment
// Template
const EPT = Loadable(lazy(() => import("./pages/protected/ept/ept"))); // Execution Project Template
// System Administration
const Role = Loadable(lazy(() => import("./pages/protected/role/role"))); // Role
const User = Loadable(lazy(() => import("./pages/protected/user/user"))); // User
const PermissionAssignment = Loadable(lazy(() => import("./pages/protected/permissionAssignment/permissionAssignment"))); // Permission Assignment
const OnlineUser = Loadable(lazy(() => import("./pages/protected/onlineUser/onlineUser"))); // Oline User
// Settings 
const CSO = Loadable(lazy(() => import("./pages/protected/cso/cso"))); // Construction Site Options
const LandingPageSetUp = Loadable(lazy(() => import("./pages/protected/landingPageSetup/landingPageSetup"))); // Landing Page Setup
//profile
const Profile = Loadable(lazy(() => import("./pages/protected/profile/profile")));
const About = Loadable(lazy(() => import("./pages/protected/about/about")));
const Message = Loadable(lazy(() => import("./pages/protected/message/message")));


const routes = [
    {
        path: "/",
        element: <PresentationLayout />,
        children: [
            {
                path: "",
                element: <Landing />
            },
            {
                path: "downloadapp",
                element: <DownloadApp />
            }
        ]
    },
    {
        path: "auth",
        element: <AuthLayout />,
        children: [
            {
                path: "signin",
                element: <SignIn />
            },
            {
                path: "page203",
                element: <Page203 />
            },
        ],
    },   
    {
        path: "private",
        element: (
            <AuthGuard>
                <DashboardLayout />
            </AuthGuard>
        ),
        children: [
            {
                path: "",
                element: <ProtectedPage />
            },
            {
                path: "/private/dashboard",
                element: <Home />
            },
            {
                path: "/private/calendar",
                element: <Calendar />
            },
            {
                path: "/private/message",
                element: <Message />
            },
            {
                path: "/private/addressBook",
                element: <AddressBook />
            },
            {
                path: "/private/csm/workOrder",
                element: <WorkOrder />
            },
           
            {
                path: "/private/csm/executionOrder",
                element: <ExecutionOrder />
            },
            {
                path: "/private/csm/EOReview",
                element: <ExecutionOrderReview />
            },
            {
                path: "/private/csm/issueResolutionForm",
                element: <IssueResolutionForm />
            },
            {
                path: "/private/document/category",
                element: <DC />
            },
            {
                path: "/private/document/upload",
                element: <DocumentUpload />
            },
            {
                path: "/private/document/find",
                element: <DocumentFind />
            },
            {
                path: "/private/training/course",
                element: <TC />
            },
            {
                path: "/private/training/record",
                element: <TrainingRecord />
            },
            {
                path: "/private/training/teachingStatistics",
                element: <TaughtLessons />
            },
            {
                path: "/private/training/participationStatistics",
                element: <ReceivedTraining />
            },
            {
                path: "/private/ppe/quota",
                element: <PPEQuota />
            },
            {
                path: "/private/ppe/ppeIssuanceForm",
                element: <PPEIssuanceForm />
            },
            {
                path: "/private/ppe/ppeStatistics",
                element: <PPEReport />
            },
            {
                path: "/private/ppe/wizard",
                element: <PPEIssuanceWizard />
            },
            {
                path: "/private/masterData/department",
                element: <Department />
            },
            {
                path: "/private/masterData/position",
                element: <Position />
            },
            {
                path: "/private/masterData/constructionSiteCategory",
                element: <CSC />
            },
            {
                path: "/private/masterData/constructionSiteArchive",
                element: <CSA />
            },
            {
                path: "/private/masterData/userDefinedCategory",
                element: <UDC />
            },
            {
                path: "/private/masterData/userDefineArchive",
                element: <UDA />
            },
            {
                path: "/private/masterData/executionProjectCategory",
                element: <EPC />
            },
            {
                path: "/private/masterData/executionProject",
                element: <EPA />
            },
            {
                path: "/private/masterData/riskLevel",
                element: <RiskLevel />
            },
            {
                path: "/private/masterData/personalProtectiveEquipment",
                element: <PPE />
            },
            {
                path: "/private/template/executionProjectTemplate",
                element: <EPT />
            },
            {
                path: "/private/csm/WOStatus",
                element: <WorkOrderStatus />
            },
            {
                path: "/private/csm/EOStatus",
                element: <ExecutionOrderStatus />
            },
            {
                path: "/private/csm/IRFStatus",
                element: <IssueResolutionFormStatus />
            },
            {
                path: "/private/permission/role",
                element: <Role />
            },
            {
                path: "/private/permission/user",
                element: <User />
            },
            {
                path: "/private/permission/permissionAssignment",
                element: <PermissionAssignment />
            },
            {
                path: "/private/permission/onlineUser",
                element: <OnlineUser />
            },
            {
                path: "/private/options/constructionSiteOptions",
                element: <CSO />
            },
            {
                path: "/private/options/landingPageSetup",
                element: <LandingPageSetUp />
            },
            {
                path: "/private/my/profile",
                element: <Profile />
            },
            {
                path: "/private/my/about",
                element: <About />
            }
        ],
    },
    {
        path: "*",
        element: <AuthLayout />,
        children: [
            {
                path: "*",
                element: <Page404 />,
            },
        ],
    },
];

export default routes;