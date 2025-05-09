/* For Production Environment */
// const BASE_URL = 'https://poc-be-xi.vercel.app/api/v1';


// const BASE_URL = 'http://localhost:8449/api/v1';
const BASE_URL =  'https://mrapp.saleofast.com/api/v1';
const RAZORPAY_KEY_ID = 'rzp_test_3IH6WrX7jqS91g';
const RAZORPAY_KEY_SECRET = 'L2cU3hOSi3OBwaoNggCkpbrG';

const WEBSITE_NAME = '';

const DEFAULT_PAGE_SIZE = 12;
const DEFAULT_STORE_PAGE_SIZE = 30;


const API_ENDPOINTS = {
    login: '/user/login',
    register: '/auth/signUp',
    forgotPassword: '/user/forgotPassword',
    resetPassword: "/user/reset-password",
    logout: '/auth/logout',
    getProfile: '/profile/get',
    tokenRenew: "",
    storeDetails: "",
    getStoreBeat: "/beat/beatList",
    markAttendance: "/attendance/mark",
    getAttendanceList: "/attendance/list",
    
    getAttendanceInOut: "/attendance/inAndOutTime",
    getStoreCategory: "/store/categoryList",
    getCategory: "/store/categoryList",
    addStoreCategory: "/store/createCategory",
    updateStoreCategory: "/store/updateCategory",
    deleteStoreCategory: "/store/deleteCategory",
    getStoreCategoryById: "/store/getCategoryById",
    getStore: "/store/storeList",
    updateStore: "/store/update",
    deleteStore: "/store/delete",
    getStoreById: "/store/getStore",
    getStoreByType: "/store/getStoreByType",
    getStorePastOrder: "/order/list",
    createStore: "store/create",
    createBeat: "/beat/create",
    getVisits: "/visit/visitList",
    getVisitsById: "/visit/getVisit",
    visitCheckIn: "/visit/checkIn",
    visitCheckOut: "/visit/checkOut",
    getProduct: "/product/list",
    addProduct: "/product/add",
    getProductById: "/product/getById",
    updateProduct: "/product/update",
    getProductCategory: "/product/category/list",
    addProductCategory: "/product/category/add",
    deleteProductCategory: "/product/category/delete",
    updateProductCategory: "/product/category/update",
    getProductCategoryById: "/product/category/getById",
    getProductBrand: "/brand/list",
    addProductBrand: "/brand/add",
    deleteProductBrand: "/brand/delete",
    updateProductBrand: "/brand/update",
    getProductBrandById: "/brand/getById",
    createOrder: "/order/create",
    
    getOrderListByStoreId: "/order/list",
                                                     
    getOrderCounttByVisitId: "/order/isList",
    createHoliday: "/holiday/create",

    getOrderSummaryByOrderId: "/order/getOrderById",
    getOrderSignedUrl: "/order/signedUrl",
    updateCollectionAmount: "order/collection",
    getAllCollectionsList: "order/collections",
    getAllOrdersList: "/order/allOrders",
    updateOrderStatus: "/order/update/orderStatus",
    updateOrderBySpecialDiscount: "/order/update/special-discount",
    getInventoryList: "/inventory/getList",
    updateInventory: "/inventory/update",
    uploadProfilePicture: "/profile/updateProfile",
    getActiveScheme: "/scheme/getActiveScheme",
    getAllProductSchemeList: "/scheme/schemeList",
    createProductScheme: "/scheme/create",
    updateScheme: "/scheme/update",
    getDashboard: "/profile/dashboard",
    deleteProfilePic: "/profile/deleteProfilePic",
    updateVisitPicture: "/visit/updateImage",
    getSSMUsersList: "/users/list",
    getManagerList: "/users/managersList",
    getUserDetails: "/users/userDetails",
    updateUser: "/users/update",
    deleteUser: "/users/delete",
    getUsersLearningRoleList: "users/learningRoleList",
    createVisits: "/visit/create",
    getstoresByEmpId: "/users/getStoresByEmpId",
    getstoresByBeatId: "/users/getStoresByBeatId",

    createUser: "/user/signUp",
    getCollectionByOrderId: "/order/collectionList",
    getCollectionByStoreId: "/order/collectionByStore",
    getPaymentRecordByOrderId: "/payment/recordByOrderId",
    addPaymentByCash: "/payment/addByCash",
    addPaymentByOnline: "/payment/addByOnline",
    paymentCaptureByRazorpay: "/payment/paymentCapture",
    addCourse: "/course/add",
    getCourse: "/course/list",
    getcourseById: "/course/getById",
    updateCourse: "/course/update",
    deleteCourse: "/course/delete",
    addQuiz: "/course/quiz/add",
    getQuiz: "/course/quiz/list",
    getQuizById: "/course/quiz/getById",
    updateQuiz: "/course/quiz/update",
    deleteQuiz: "/course/quiz/delete",

    deleteProduct: "/product/delete",
    deleteBeat: "/beat/delete",
    updateBeat: "/beat/update",
    getProductBeatById: "/beat/getById",
    getBeatById: "/beat/getById",

    getTarget: "/target/list",
    addTarget: "/target/add",
    deleteTarget: "/target/delete",
    updateTarget: "/target/update",
    getTargetById: "/target/getById",

    getAdminDashboard: "/profile/admin/dashboard",
    updateApprovalStore: "/profile/admin/update/approvalStore",
    getAdminDashboardRevenueChart: "/profile/admin/dashboard/revenue-chart",
    getYearlyTarget: "/target/yearly-chart",

    getAllPendingApprovalOrder: "/order/allPendingApproval",
   
    getAllTargetByEmpId:"/target/getAllByEmpId",

    getAttendanceReport: "/attendance/report",
    getDayTrackingReport: "/visit/day-track-report",
    getPendingCollectionReport: "/order/report/pending-collection",
    getPendingApprovalReport: "/order/report/pending-approval",
    getStoreRevenueReport: "/order/report/store-revenue",
    getSkuRevenueReport: "/order/report/sku-revenue",
    getMonthlyProgresReport: "/order/report/monthly-progress",
    getMonthlyOrderReport: "/order/report/monthly-order",
    getUnbilledStoreReport: "/order/report/unbilled-store",
    getEmpPerformanceReport: "/order/report/employee-performance",
    getMonthlyNoOrderReasonReport: "/order/report/monthly-no-order",

    updateVisitWithNoOrderReason: "/visit/update/no-order-reason",

    getNoOrderReason: "/reason/list",
    addNoOrderReason: "/reason/add",
    deleteNoOrderReason: "/reason/delete",
    updateNoOrderReason: "/reason/update",
    getNoOrderReasonById: "/reason/getById",

    getPastNoOrderReason: "/visit/past-no-order",
    getVisitPictureByStoreId: "/visit/picture",

    getHomeTodayAchievement: "/profile/home/today-achievement",
    getHomeTodayOrderValue: "/profile/home/today-order-value",
    getHomeMonthAchievement: "/profile/home/month-achievement",
    
    getColour: "/colour/list",
    addColour: "/colour/add",
    deleteColour: "/colour/delete",
    updateColour: "/colour/update",
    getColourById: "/colour/getById",

    getSize: "/size/list",
    addSize: "/size/add",
    deleteSize: "/size/delete",
    updateSize: "/size/update",
    getSizeById: "/size/getById",

    getFeature: "/feature/list",
    addFeature: "/feature/add",
    deleteFeature: "/feature/delete",
    updateFeature: "/feature/update",
    getFeatureById: "/feature/getById",

    getRole: "/role/list",
    addRole: "/role/add",
    deleteRole: "/role/delete",
    updateRole: "/role/update",
    getRoleById: "/role/getById",

    getRetailorDashboard: "/profile/retailor/dashboard",

    getPaymentMode: "/paymentMode/list",
    addPaymentMode: "/paymentMode/add",
    deletePaymentMode: "/paymentMode/delete",
    updatePaymentMode: "/paymentMode/update",
    getPaymentModeById: "/paymentMode/getById",

    // import/export
    createProductRequest:"/product/import",
    addImportProductBrand:"/brand/add/importBrand",
    createStoreImport:"/store/add/importStore",
    createStoreCategoryImport:"/store/importStoreCategories",
    createUserImport: "/users/importUser",
    addImportBrandCategory: "/brand/import",
    addImportProductCategory: "/product/category/import",
    getImportNoOrderReason: "/order/import",
    createImportVisits: "/visit/import",
	importNoOrderReason: "/reason/import",
	addImportColour: "/colour/import",
	addImportSize: "/size/import",
    importStore: "store/import",
	
	//  policy Head
    getPolicyHead: "/policyHead/getPolicyHead",
    addPolicyHead: "/policyHead/addPolicyHead",
    deletePolicyHead: "/policyHead/deletePolicyHead",
    updatePolicyHead: "/policyHead/updatePolicyHead",
    getPolicyHeadById: "/policyHead/getPolicyHeadById",
    // policy Types
    getPolicyType: "/policyHeadType/getPolicyType",
    addPolicyType: "/policyHeadType/addPolicyType",
    deletePolicyType: "/policyHeadType/deletePolicyType",
    updatePolicyType: "/policyHeadType/updatePolicyType",
    getPolicyTypeById: "/policyHeadType/getPolicyTypeById",
    // Expense Management
    getExpense: "/expense/get",
    addExpense: "/expense/add",
    deleteExpense: "/expense/delete",
    updateExpense: "/expense/update",
    // getExpenseById: "/ExpenseManagement/getPolicyTypeById",
    // Leave head
    getLeaveHead: "/leaveHead/getLeave",
    addLeaveHead: "/leaveHead/addLeave",
    deleteLeaveHead: "/leaveHead/deleteLeave",
    updateLeaveHead: "/leaveHead/updateLeave",
    getLeaveHeadById: "/leaveHead/getLeaveById",
    // Leave count
    getLeaveHeadCount: "/leaveCount/getLeaveCount",
    getLeaveCountByYear: "/leaveCount/getCount",
    getLeaveCount: "/leaveCount/getLeaveCount",
    addLeaveCount: "/leaveCount/addLeaveCount",
    updateLeaveCount: "/leaveCount/updateLeaveCount",

    addLeaveHeadCount: "/leaveCount/addLeaveCount",
    deleteLeaveHeadCount: "/leaveCount/deleteLeaveCount",
    updateLeaveHeadCount: "/leaveCount/updateLeaveCount",
    getLeaveHeadCountById: "/leaveCount/getLeaveCountById",

    getWorkPlaceData:'/workplace/getWorkplace',
    getActivityData:'/activity/getActivities',
    getActivityById:'/getActivitiesById',
    postActivityData:'/activity/addActivities',

    getUserPendingLeaves: "/userLeave/get",
    addLeaveApplication:"/leaveApplicaton/add",
    getLeaveApplication:"/leaveApplicaton/get",
    updateLeaveApplication:"/leaveApplicaton/update",


    getSessionData:"/sessions/getSessions",
    postSessionData:"/sessions/addSessions",

    getFeedbackData:"/feedback/getFeedback",
    postFeedbackData:"/feedback/addFeedback",

    addHolidayApplication:"/holidays/addHoliday",
    getHoliday:"/holidays/getHoliday",
    deleteHoliday: "/holidays/deleteHoliday",

    getSampleData:"/samples/getSamples",
    postSampleData:'/samples/addSamples',

    getGiftdata:'/gifts/getGifts',
    postGiftData:'/gifts/addGifts',
    getGiftDataByDate:'/gifts/getGiftsByDate',  

    postOtherWorkPlaceData:"/workplace/addWorkplace",
    getOtherWorkPlaceData:"/workplace/getWorkplace",
    getOtherWorkPlaceDataByDate:"/samples/getSamplesByDate",
   
    
    updateWorkPlaceData:"/workplace/updateWorkplace",
    deleteWorkPlaceData:"/workplace/deleteWorkplace",

    postRcpaData:"/rcpa/addRCPA",
    getRcpaData:"/rcpa/getRCPA",
    getPendingAmount:"/order/report/getPendingCollectionByStoreId",

    getVisitReport:"/visit/visitReport",
   
    

    // Dar Configuration
    getActivityType: "/dar/config/activityType/list",
    addActivityType:"/dar/config/activityType/add",
    deleteActivityType:"/dar/config/activityType/delete",
    updateActivityType:"/dar/config/activityType/update",
    getActivityTypeById: "/dar/config/activityType/getById",
    
    getActivityRelTo: "/dar/config/activityRelTo/list",
    addActivityRelTo:"/dar/config/activityRelTo/add",
    deleteActivityRelTo:"/dar/config/activityRelTo/delete",
    updateActivityRelTo:"/dar/config/activityRelTo/update",
    getActivityRelToById: "/dar/config/activityRelTo/getById",

    getNextActionOn: "/dar/config/nextActionOn/list",
    addNextActionOn:"/dar/config/nextActionOn/add",
    deleteNextActionOn:"/dar/config/nextActionOn/delete",
    updateNextActionOn:"/dar/config/nextActionOn/update",
    getNextActionOnById: "/dar/config/nextActionOn/getById",

    getStatus: "/dar/config/status/list",
    addStatus:"/dar/config/status/add",
    deleteStatus:"/dar/config/status/delete",
    updateStatus:"/dar/config/status/update",
    getStatusById: "/dar/config/status/getById",

    //Dar
    addDar: "/dar/addDar",
    getDar: "/dar/listDar",
    getDarById: "/dar/getDarById",
    updateDar: "/dar/updateDar",

    // E-Detailing
    addEDetailing: "/eDetailing/add",
    getEDetailing: "/eDetailing/get",
    getEDetailingById: "/eDetailing/getById",
    updateEDetailing: "/eDetailing/update",
    deleteEDetailing: "/eDetailing/delete"
};

const LS_KEYS = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    userData: "userData",
};

const RUPEE_HTML_CODE = "&#8377;";

export { API_ENDPOINTS, LS_KEYS, WEBSITE_NAME, BASE_URL, DEFAULT_PAGE_SIZE, RUPEE_HTML_CODE, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, DEFAULT_STORE_PAGE_SIZE };
