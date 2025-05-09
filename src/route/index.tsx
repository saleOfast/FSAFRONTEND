import React, { Fragment } from 'react'
import { Navigate, useRoutes } from "react-router-dom";
import { Login } from "../page/onboarding/login";
import { Dashboard } from "../page/dashboard";
import Visit from "../page/visits/visit";
import Profile from "../page/profile";
import ProfileDetails from "../component/profile/profileDetails";
import AttendanceDetails from "../component/attendance/attendanceDetails";
import NewStores from "../page/store/newStores";
import Stores from "../page/store/stores";
import StoreDetails from "../component/store/storeDetails";
import AddStore from "../component/store/addStore";
import Inventory from "../page/inventory";
import VisitDetails from "../component/visit/visitDetail";
import InventoryTable from "../component/inventory/inventoryTable";
import PastOrdersDetails from "../component/order/PastOrdersDetails";
import CollectPayment from "../component/CollectPayment";
import OrderList from "../component/order/orderList";
import FocusedItems from "../component/order/focusedItems";
import Checkout from "../component/order/checkout";
import VisitPictures from "../page/visits/visitPictures";
import VisitSurvey from "../component/visit/visitSurvey";
import Collection from "../page/collection";
import OrderSummary from "../component/order/orderSummary";
import TargetDataTable from "../component/dash/targetDataTable";
import TargetVsAchivement from "../component/dash/targetVsAcheivement";
import CreateVisit from "../component/admin/visit/createVisit";
import CreateBeat from "../component/admin/beat/createBeat";
import CreateDistributor from "../component/admin/distributor/addDistributor";
import Order from 'page/order';
import AdminVisit from 'page/admin/adminVisit';
import AddNewProduct from 'component/admin/product/addNewProduct';
import AdminProduct from 'component/admin/product/adminProduct';
import Brand from 'component/admin/brand/brand';
import AuthGuard from "../component/AuthGuard";
import UnbilledStores from "../page/store/unbilledStores";
import NotFound from 'component/NotFound';
import { UserRole } from 'enum/common';
import AddNewBrand from 'component/admin/brand/addAndUpdateBrand';
import Category from 'component/admin/productCategory/category';
import AddNewCategory from 'component/admin/productCategory/addNewCategory';
import StoreCategory from 'component/admin/storeCategory/storeCategory';
import AddAndUpdateStoreCategory from 'component/admin/storeCategory/addAndUpateStoreCategory';
import AddNewUsers from 'component/admin/users/addNewUsers';
import Users from 'component/admin/users/users';
import Scheme from 'component/admin/scheme/scheme';
import AddNewScheme from 'component/admin/scheme/addNewScheme';
import StoreFilter from 'component/store/storeFilter';
import { AdminDashboard } from 'component/admin/dashboard/adminDashboard';
import BeatList from 'component/admin/beat/beatList';
import Schemes from 'page/schemes';
import AddDistributor from '../component/admin/distributor/addDistributor';
import PastOrderListing from 'component/order/pastOrderListing';
import AddCourse from 'component/admin/learningModule/addCourse';
import AdminLmsDashboard from 'component/admin/learningModule/adminLmsDashboard';
import Quiz from 'component/admin/learningModule/quiz';
import CourseDetail from 'component/admin/learningModule/courseDetail';
import MylearningAssessment from 'component/admin/learningModule/mylearningassessment';
import Createquiz from 'component/admin/learningModule/createquiz';
import { InvoiceTemplate } from 'component/order/invoiceTemplate';
import { TargetChart } from 'component/dash/targetChart';
import { ForgotPassword } from 'page/onboarding/forgotPassword';
import { ConfirmPassword } from 'page/onboarding/confirmPassword';
import SentVerificationMail from 'page/onboarding/sentVerificationMail';
import PendingApprovalTable from 'component/admin/dashboard/pendingApprovalTable';
import PendingApprovalAll from 'component/admin/dashboard/pendingApprovalAll';
import { Home } from 'page/home';
import SideMenu from '../component/common/menu';
import { AttendanceReport } from 'component/admin/reports/attendanceReport';
import { DayTrackingReport } from 'component/admin/reports/dayTrackingReport';
import { PendingCollectionReport } from 'component/admin/reports/pendingCollectionReport';
import { PendingApprovalReport } from 'component/admin/reports/pendingApprovalReport';
import { StoreRevenueReport } from 'component/admin/reports/storeRevenueReport';
import { SkuRevenueReport } from 'component/admin/reports/skuRevenueReport';
import { MonthlyProgressReport } from 'component/admin/reports/monthlyProgressReport';
import { UnbilledStoreReport } from 'component/admin/reports/unbilledStoreReport';
import { EmployeePerformanceReport } from 'component/admin/reports/employeePerformanceReport';
import { MonthlyNoOrderReport } from 'component/admin/reports/monthlyNoOrderReport';
import AddUpdateNoOrder from 'component/admin/noOrderReason/addUpdateNoOrder';
import OrderForm from 'component/order/orderForm';
import Colour from 'component/admin/productColour/colour';
import AddUpdateColour from 'component/admin/productColour/addUpdateColour';
import Size from 'component/admin/productSize/size';
import AddUpdateSize from 'component/admin/productSize/addUpdateSize';
import Feature from 'component/admin/feature/feature';
import AddUpdateFeature from 'component/admin/feature/addUpdateFeature';
import AddUpdateRole from 'component/admin/role/addUpdateRole';
import Role from 'component/admin/role/role';
import { RetailorDashboard } from 'page/retailor/retailorDashboard';
import { InventoryReport } from 'component/admin/reports/inventoryReport';
import PaymentMode from 'component/admin/config/paymentMode/paymentMode';
import AddUpdatePaymentMode from 'component/admin/config/paymentMode/addUpdatePaymenMode';
import NoOrderReasonOutlet from 'component/admin/noOrderReason/noOrderReasonOutlet';
import NoOrderReason from 'component/admin/noOrderReason/noOrder';
import ImportExport from 'component/admin/importExport/importExport';
import ExpenseManagement from 'component/expenseMangement/expenseManagement';
import ExpenseApply from 'component/expenseMangement/applyExpense';
import LeaveApproval from 'component/hrProcess/leaveApproval';
import LeaveApplication from 'component/hrProcess/leaveApplication';
import Leave from 'component/admin/leave/leave';
import Policy from 'component/admin/policy/policy';
import AddUpdateLeave from 'component/admin/leave/addUpdateLeave';
import AddUpdatePolicy from 'component/admin/policy/addUpdatePolicy';
import PolicyTypes from 'component/admin/policy/policyTypes';
import AddUpdatePolicyTypes from 'component/admin/policy/addUpdatePolicyTypes';
import LeaveView from 'component/admin/leave/leaveView';
import AddUpdateLeaveView from 'component/admin/leave/addUpdateLeaveView';
import DoctorDetails from 'component/doctor/doctorDetails';
import ChemistDetails from 'component/chemist360/chemistdetails';
import { Dar } from 'component/dar/darList';
import StockiestDetails from 'component/stockiest/stockiestdetails';
import { AddUpdateDar } from 'component/dar/addupdateDar';
import ActivityType from 'component/admin/dar/activityType';
import ActivityRelatedTo from 'component/admin/dar/activityRelatedTo';
import NextActionOn from 'component/admin/dar/nextActionOn';
import DarStatus from 'component/admin/dar/darStatus';
import Competitorbrand from 'component/admin/brand/competitorbrand';
import AddAndUpdateOtherBrand from 'component/admin/brand/addAndUpdateOtherBrand';

import Holidays from 'component/hrProcess/holidays';
import Edetails from 'page/visits/eDetails';
import {MrAnalysis} from 'component/admin/reports/mrAnalysis';



function AppRoutes() {
    const route = useRoutes([
        { path: "/", element: <Login />, },
        { path: "/auth/forgot-password", element: <ForgotPassword />, },
        { path: "/auth/confirm-password", element: <ConfirmPassword />, },
        { path: "/auth/verify-mail", element: <SentVerificationMail />, },
        { path: "/dashboard", element: <AuthGuard page={<Dashboard />} role={[UserRole.SSM, UserRole.CHANNEL, UserRole.SUPER_ADMIN]} />},
        { path: "/retailor/dashboard", element: <AuthGuard page={<RetailorDashboard />} role={[UserRole.RETAILER, UserRole.SUPER_ADMIN]} />},
        { path: "/home", element: <AuthGuard page={<Home />} role={[UserRole.SSM, UserRole.CHANNEL, UserRole.SUPER_ADMIN]} />},

        {
            path: "/profile", element: <AuthGuard page={<Profile />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.CHANNEL, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN]} />,
            children: [
                { path: "", element: <ProfileDetails /> },
                { path: "attendance-details", element: <AttendanceDetails /> },
            ],
        },
        { path: "/new-stores", element: <AuthGuard page={<NewStores />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN]} />, },
        { path: "/stores", element: <AuthGuard page={<Stores />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.CHANNEL, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN]} />, },
        { path: "/stores/store-details", element: <AuthGuard page={<StoreDetails />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.CHANNEL, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN]} />, },
        { path: "/stores/add-store", element: <AuthGuard page={<AddStore />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN]} />, },
        { path: "/visit/inventory/:storeId", element: <AuthGuard page={<Inventory />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN]} />, },
        { path: "/visit/inventory", element: <AuthGuard page={<Inventory />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN]} />, },
        
        { path: "/visit", element: <AuthGuard page={<Visit />} />, },
        {
            path: "/visit-details/:storeId/:visitId", element: <AuthGuard page={<VisitDetails />}  />,
            children: [
                { path: "", element: <PastOrdersDetails /> },
                { path: "inventory", element: <InventoryTable /> },
                { path: "pictures", element: <VisitPictures /> },
                { path: "survey", element: <VisitSurvey /> },
                { path: "no-order-reason", element: <NoOrderReasonOutlet /> }
            ],
        },
        { path: "/order", element: <AuthGuard page={<Order />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.CHANNEL, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN]} />, },
        { path: "/order/order-list/:storeId/:visitId", element: <AuthGuard page={<OrderList />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN]} />, },
        { path: "/order/order-list/:storeId/:visitId/:orderId", element: <AuthGuard page={<OrderList />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN]} />, },
        { path: "/order/order-list/", element: <AuthGuard page={<OrderList />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.CHANNEL, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN]} />, },
       
        { path: "/order/order-summary/:orderId", element: <AuthGuard page={<OrderSummary />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.CHANNEL, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN,  UserRole.CHANNEL]} /> },
        { path: "/schemes", element: <AuthGuard page={<Schemes />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN, UserRole.CHANNEL]} />, },
        { path: "/visit/collect-payment", element: <AuthGuard page={<CollectPayment />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN]} />, },
        { path: "/focused-items", element: <AuthGuard page={<FocusedItems />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN, UserRole.CHANNEL]} /> },
        { path: "/order/checkout/:storeId/:visitId/:orderId", element: <AuthGuard page={<Checkout />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/collection", element: <AuthGuard page={<Collection />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN, UserRole.CHANNEL]} /> },
        { path: "/collection/:storeId", element: <AuthGuard page={<Collection />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN,  UserRole.CHANNEL]} /> },
        { path: "/payment", element: <AuthGuard page={<Collection />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN,  UserRole.CHANNEL]} /> },
        { path: "/payment/:storeId", element: <AuthGuard page={<Collection />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/target-data-table", element: <AuthGuard page={<TargetDataTable />} role={[UserRole.ADMIN, UserRole.RSM, UserRole.SSM, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/e-detailing", element: <AuthGuard page={<Edetails />} role={[UserRole.ADMIN, UserRole.RSM, UserRole.SSM, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/target-achievement", element: <AuthGuard page={<TargetVsAchivement />} role={[UserRole.ADMIN, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN, UserRole.CHANNEL]} /> },
        { path: "/admin/create-visit", element: <AuthGuard page={<CreateVisit />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/admin/create-beat", element: <AuthGuard page={<CreateBeat />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/admin/distributor/add", element: <AuthGuard page={<AddDistributor />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/new-order-summary", element: <AuthGuard page={<CreateDistributor />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN,  UserRole.CHANNEL]} /> },
        { path: "/unbilled-stores", element: <AuthGuard page={<UnbilledStores />} role={[UserRole.ADMIN, UserRole.SSM, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/menu", element: <AuthGuard page={<SideMenu />} role={[UserRole.SSM, UserRole.SUPER_ADMIN]} /> },
        { path: "/order/past-orders", element: <AuthGuard page={<PastOrderListing />} /> },
        { path: "/stores/stores-filter", element: <AuthGuard page={<StoreFilter />} /> },
        { path: "/order/invoice", element: <AuthGuard page={<InvoiceTemplate />} /> },
        { path: "*", element: <Navigate to={"/"} /> },
        { path: "/403", element: <NotFound /> },
        { path: "/admin/visit", element: <AuthGuard page={<AdminVisit />} role={[UserRole.ADMIN, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/admin/product/add-new-product", element: <AuthGuard page={<AddNewProduct />} role={[UserRole.ADMIN, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/admin/product", element: <AuthGuard page={<AdminProduct />} role={[UserRole.ADMIN, UserRole.RSM, UserRole.SSM, UserRole.RETAILER, UserRole.SUPER_ADMIN, UserRole.CHANNEL]} /> },
        { path: "/admin/brand", element: <AuthGuard page={<Brand />} role={[UserRole.ADMIN, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/admin/competitorbrand", element: <AuthGuard page={<Competitorbrand/>} role={[UserRole.ADMIN, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/admin/new-otherbrand", element: <AuthGuard page={<AddAndUpdateOtherBrand />} role={[UserRole.ADMIN, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        
        { path: "/admin/new-brand", element: <AuthGuard page={<AddNewBrand />} role={[UserRole.ADMIN, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/admin/category", element: <AuthGuard page={<Category />} role={[UserRole.ADMIN, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/admin/add-new-category", element: <AuthGuard page={<AddNewCategory />} role={[UserRole.ADMIN, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/admin/store-category", element: <AuthGuard page={<StoreCategory />} role={[UserRole.ADMIN, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/admin/store/add-update-category", element: <AuthGuard page={<AddAndUpdateStoreCategory />} role={[UserRole.ADMIN, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/admin/users", element: <AuthGuard page={<Users />} role={[UserRole.ADMIN, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/admin/add-new-users", element: <AuthGuard page={<AddNewUsers />} role={[UserRole.ADMIN, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/admin/scheme", element: <AuthGuard page={<Scheme />} /> },
        { path: "/admin/add-new-scheme", element: <AuthGuard page={<AddNewScheme />} role={[UserRole.ADMIN, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/admin/dashboard", element: <AuthGuard page={<AdminDashboard />} role={[UserRole.ADMIN, UserRole.RSM, UserRole.SUPER_ADMIN]} /> },
        { path: "/admin/beat", element: <AuthGuard page={<BeatList />} role={[UserRole.ADMIN, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN, UserRole.CHANNEL]} /> },
        { path: "/admin/dashboard/course", element: <AuthGuard page={<AdminLmsDashboard />} role={[UserRole.ADMIN, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/admin/lms/add-course", element: <AuthGuard page={<AddCourse />} role={[UserRole.ADMIN, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/admin/lms/add-quiz", element: <AuthGuard page={<Quiz />} role={[UserRole.ADMIN, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/admin/lms/course-detail", element: <AuthGuard page={<CourseDetail />} role={[UserRole.ADMIN, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/admin/lms/my-learning-assessment", element: <AuthGuard page={<MylearningAssessment />} role={[UserRole.ADMIN, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/admin/lms/create-quiz", element: <AuthGuard page={<Createquiz />} role={[UserRole.ADMIN, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
        { path: "/target-chart", element: <AuthGuard page={<TargetChart />} role={[UserRole.ADMIN, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
    
        { path: "/Pending-approval", element: <AuthGuard page={<PendingApprovalAll />} role={[UserRole.ADMIN, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN, UserRole.MANAGER]} /> },
    // Reports
       { path: "/report/attendance", element: <AuthGuard page={<AttendanceReport />} /> },
       { path: "/report/day-tracking", element: <AuthGuard page={<DayTrackingReport />} /> },
       { path: "/report/mr-analysis", element: <AuthGuard page={<MrAnalysis/>} /> },
       { path: "/report/pending-collection", element: <AuthGuard page={<PendingCollectionReport />} /> },
       { path: "/report/pending-approval", element: <AuthGuard page={<PendingApprovalReport />} /> },
       { path: "/report/store-revenue", element: <AuthGuard page={<StoreRevenueReport />} /> },
       { path: "/report/sku-revenue", element: <AuthGuard page={<SkuRevenueReport />} /> },
       { path: "/report/monthly-progress", element: <AuthGuard page={<MonthlyProgressReport />} /> },
       { path: "/report/unbilled-store", element: <AuthGuard page={<UnbilledStoreReport />} /> },
       { path: "/report/employee-performance", element: <AuthGuard page={<EmployeePerformanceReport />} /> },
       { path: "/report/monthly-no-order", element: <AuthGuard page={<MonthlyNoOrderReport />} /> },
       { path: "/report/inventories", element: <AuthGuard page={<InventoryReport />} /> },


       { path: "/noOrder-reason", element: <AuthGuard page={<NoOrderReason />} /> },
       { path: "/add-update/noOrder-reason", element: <AuthGuard page={<AddUpdateNoOrder />} role={[UserRole.ADMIN, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN, UserRole.MANAGER]}/> },
       { path: "/order/form", element: <AuthGuard page={<OrderForm />} /> },
       { path: "/order/form/:storeId/:visitId", element: <AuthGuard page={<OrderForm />} /> },
       { path: "/order/form/:storeId/:visitId/:orderId", element: <AuthGuard page={<OrderForm />} /> },

       { path: "/config/colour", element: <AuthGuard page={<Colour />} /> },
       { path: "/config/colour/add-update/", element: <AuthGuard page={<AddUpdateColour />} role={[UserRole.ADMIN, UserRole.RSM, UserRole.RETAILER, UserRole.SUPER_ADMIN, UserRole.MANAGER]}/> },
       { path: "/config/size", element: <AuthGuard page={<Size />} /> },
       { path: "/config/size/add-update/", element: <AuthGuard page={<AddUpdateSize />} /> },
       { path: "/config/payment-mode", element: <AuthGuard page={<PaymentMode />} /> },
       { path: "/config/payment-mode/add-update/", element: <AuthGuard page={<AddUpdatePaymentMode />} /> },

       { path: "/config/feature", element: <AuthGuard page={<Feature />} /> },
       { path: "/config/feature/add-update", element: <AuthGuard page={<AddUpdateFeature />} role={[UserRole.SUPER_ADMIN]}/> },
       { path: "/config/role", element: <AuthGuard page={<Role />} /> },
       { path: "/config/role/add-update", element: <AuthGuard page={<AddUpdateRole />} role={[UserRole.SUPER_ADMIN]}/> },
        
       { path: "/admin/import-export", element: <AuthGuard page={<ImportExport/>} /> },

       
    //    Expense Management
    { path: "/hr/expense", element: <AuthGuard page={<ExpenseManagement />} /> },
    { path: "/hr/expense-apply", element: <AuthGuard page={<ExpenseApply />} /> },
    { path: "/config/policy", element: <AuthGuard page={<Policy />} /> },
    { path: "/config/add-leave", element: <AuthGuard page={<AddUpdateLeave />} role={[UserRole.ADMIN, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },

    { path: "/config/leave", element: <AuthGuard page={<Leave />} /> },
    { path: "/config/leave-view", element: <AuthGuard page={<LeaveView />} /> },
    { path: "/config/add-update-leave-count", element: <AuthGuard page={<AddUpdateLeaveView />} /> },
    
    { path: "/hr/holidays", element: <AuthGuard page={<Holidays />} /> },
    { path: "/hr/holidays", element: <AuthGuard page={<Holidays />} /> },
    
    { path: "/hr/leave-approval", element: <AuthGuard page={<LeaveApproval />} /> },
    { path: "/hr/leave-apply", element: <AuthGuard page={<LeaveApplication />} /> },
    { path: "/config/add-policy", element: <AuthGuard page={<AddUpdatePolicy />} role={[UserRole.ADMIN, UserRole.RETAILER, UserRole.SUPER_ADMIN]} /> },
    
    // policy Type
    { path: "/config/policyTypes", element: <AuthGuard page={<PolicyTypes />} role={[UserRole.ADMIN, UserRole.RETAILER, UserRole.SUPER_ADMIN]}/> },
    { path: "/config/add-update-policyTypes", element: <AuthGuard page={<AddUpdatePolicyTypes />} role={[UserRole.ADMIN, UserRole.RETAILER, UserRole.SUPER_ADMIN]}/> },
   
    { path: "/stores/doctor-details", element: <AuthGuard page={<DoctorDetails />} /> },
    { path: "/stores/chemist-details", element: <AuthGuard page={<ChemistDetails />} /> },
    { path: "/stores/stockiest-details", element: <AuthGuard page={<StockiestDetails />} /> },

 
    { path: "/hr/attendance", element: <AuthGuard page={<AttendanceDetails />} /> },
    { path: "/hr/dar", element: <AuthGuard page={<Dar />} /> },
    { path: "/hr/AddUpdateDar", element: <AuthGuard page={<AddUpdateDar />} /> },

    { path: "/config/dar/activity-type", element: <AuthGuard page={<ActivityType />} /> },
    { path: "/config/dar/activity-related-to", element: <AuthGuard page={<ActivityRelatedTo />} /> },
    { path: "/config/dar/next-action-on", element: <AuthGuard page={<NextActionOn />} /> },
    { path: "/config/dar/status", element: <AuthGuard page={<DarStatus />} /> },

    
   ]);
    return (
        <Fragment>
            {
                route
            }
        </Fragment>
    )
}

export default AppRoutes