import { API_ENDPOINTS } from "app-constants";
import { apiService } from "./apiService";
import { AddExpenseReq, AddExpenseRes, AddFeatureReq, AddFeatureRes, AddLeaveApplicationReq, AddLeaveApplicationRes, AddLeaveHeadCountRes, AddLeaveHeadReq, AddLeaveHeadRes, AddPolicyHeadReq, AddPolicyHeadRes, AddPolicyTypeReq, AddPolicyTypeRes, AddRoleReq, AddRoleRes, CreateUserReq, CreateUserRes, DeleteExpenseReq, DeleteFeatureReq, DeleteLeaveHeadCountReq, DeleteLeaveHeadReq, DeletePolicyHeadReq, DeletePolicyTypeReq, DeleteRoleReq, DeleteUserReq, GetSSMUsersRes, GetUserLearningRoleRes, GetUserRes, IExpenseDataRes, ILeaveApplicationData, ILeaveApplicationRes, ILeaveHeadCountDataRes, ILeaveHeadDataRes, IPolicyHeadDataRes, IPolicyTypeDataRes, LeaveHeadCountReq, UpdateExpenseReq, UpdateExpenseRes, UpdateFeatureReq, UpdateFeatureRes, UpdateLeaveAppReq, UpdateLeaveAppRes, UpdateLeaveHeadCountReq, UpdateLeaveHeadCountRes, UpdateLeaveHeadReq, UpdateLeaveHeadRes, UpdatePolicyHeadReq, UpdatePolicyHeadRes, UpdatePolicyTypeReq, UpdatePolicyTypeRes, UpdateRoleReq, UpdateRoleRes, UpdateUserReq, UpdateUserRes, deleteExpenseRes, deleteFeatureRes, deleteLeaveHeadCountRes, deleteLeaveheadRes, deletePolicyHeadRes, deletePolicyTypeRes, deleteRoleRes, deleteUserRes, AddHolidayApplicationReq, AddHolidayApplicationRes, IHolidayApplicationRes } from "types/User";
import { AddColourReq, IProductRes } from "types/Product";

function getSSMUsersService() {
    return apiService.get<GetSSMUsersRes>(
        API_ENDPOINTS.getSSMUsersList
    );
}

function getManagerService() {
    return apiService.get<GetSSMUsersRes>(
        API_ENDPOINTS.getManagerList
    );
}

function getUsersLearningRoleService() {
    return apiService.get<GetUserLearningRoleRes>(
        API_ENDPOINTS.getUsersLearningRoleList
    );
}

function getStoresByEmpIdService(empId: number) {
    return apiService.get<IProductRes>(`${API_ENDPOINTS.getstoresByEmpId}/${empId}`)
}

function getStoresByBeatIdService(empId: number) {
    return apiService.get<IProductRes>(`${API_ENDPOINTS.getstoresByBeatId}/${empId}`)
}

function getUserDetailsByEmpIdService(empId: string) {
    return apiService.get<GetUserRes>(`${API_ENDPOINTS.getUserDetails}/${empId}`)
}

function deleteUserService(empId: DeleteUserReq) {
    return apiService.delete<deleteUserRes>(
        `${API_ENDPOINTS.deleteUser}/${empId}`
    );
}

function updateUserService(data: UpdateUserReq) {
    return apiService.post<UpdateUserRes>(
        API_ENDPOINTS.updateUser,
        data
    );
}


function createUserService(data: CreateUserReq) {
    return apiService.post<CreateUserRes>(
        API_ENDPOINTS.createUser,
        data
    );
}

// Feature


function getFeatureService() {
    return apiService.get<any>(API_ENDPOINTS.getFeature);
}

function addFeatureService(data: AddFeatureReq) {
    return apiService.post<AddFeatureRes>(
        API_ENDPOINTS.addFeature,
        data
    );
}

function updateFeatureService(data: UpdateFeatureReq) {
    return apiService.post<UpdateFeatureRes>(
        API_ENDPOINTS.updateFeature,
        data
    );
}

function deleteFeatureService(featureId: DeleteFeatureReq) {
    return apiService.delete<deleteFeatureRes>(
        `${API_ENDPOINTS.deleteFeature}/${featureId}`
    );
}

function getFeatureByIdService(featureId: string) {
    return apiService.get<any>(`${API_ENDPOINTS.getFeatureById}/${featureId}`)
}

// Role


function getRoleService(data:any) {
    const queryParams = [];
    if (data?.isActive) {
        queryParams.push(`isActive=${data?.isActive}`);
    }
    let apiPath = API_ENDPOINTS.getRole;
    if (queryParams.length > 0) {
        apiPath += '?' + queryParams.join('&');
    }
    return apiService.get<any>(apiPath);
}

function addRoleService(data: AddRoleReq) {
    return apiService.post<AddRoleRes>(
        API_ENDPOINTS.addRole,
        data
    );
}

function updateRoleService(data: UpdateRoleReq) {
    return apiService.post<UpdateRoleRes>(
        API_ENDPOINTS.updateRole,
        data
    );
}

function deleteRoleService(roleId: DeleteRoleReq) {
    return apiService.delete<deleteRoleRes>(
        `${API_ENDPOINTS.deleteRole}/${roleId}`
    );
}

function getRoleByIdService(roleId: string) {
    return apiService.get<any>(`${API_ENDPOINTS.getRoleById}/${roleId}`)
}

function createUserImportService(data: CreateUserReq) {
    return apiService.post<CreateUserRes>(
        API_ENDPOINTS.createUserImport,
        data
    );
}

// Policy Head
function getPolicyHeadService() {
    return apiService.get<IPolicyHeadDataRes>(API_ENDPOINTS.getPolicyHead);
}

function addPolicyHeadService(data: AddPolicyHeadReq) {
    return apiService.post<AddPolicyHeadRes>(
        API_ENDPOINTS.addPolicyHead,
        data
    );
}

function updatePolicyHeadService(data: UpdatePolicyHeadReq) {
    return apiService.put<UpdatePolicyHeadRes>(
        API_ENDPOINTS.updatePolicyHead,
        data
    );
}

function deletePolicyHeadService(policyId: DeletePolicyHeadReq) {
    return apiService.delete<deletePolicyHeadRes>(
        `${API_ENDPOINTS.deletePolicyHead}/${policyId}`
    );
}

function getPolicyHeadByIdService(policy_id: string) {
    return apiService.get<IPolicyHeadDataRes>(`${API_ENDPOINTS.getPolicyHeadById}/${policy_id}`)
}

// Policy Type
function getPolicyTypeService(policy_id: string) {
    return apiService.get<IPolicyTypeDataRes>(`${API_ENDPOINTS.getPolicyType}/${policy_id}`);
}

function addPolicyTypeService(data: AddPolicyTypeReq) {
    return apiService.post<AddPolicyTypeRes>(
        API_ENDPOINTS.addPolicyType,
        data
    );
}

function updatePolicyTypeService(data: UpdatePolicyTypeReq) {
    return apiService.put<UpdatePolicyTypeRes>(
        API_ENDPOINTS.updatePolicyType,
        data
    );
}

function deletePolicyTypeService(policy_type_id: DeletePolicyTypeReq) {
    return apiService.delete<deletePolicyTypeRes>(
        `${API_ENDPOINTS.deletePolicyType}/${policy_type_id}`
    );
}

function getPolicyTypeByIdService(policy_type_id: string) {
    return apiService.get<IPolicyTypeDataRes>(`${API_ENDPOINTS.getPolicyTypeById}/${policy_type_id}`)
}

// Expense
// function getExpenseService() {
//     return apiService.get<IExpenseDataRes>(`${API_ENDPOINTS.getExpense}`);
// }
function getExpenseService(query:any) {
    const queryParams = [];
    
    if (query?.userFil_id) {
        queryParams.push(`userFil_id=${query?.userFil_id}`);
    };
    if (query?.mode) {
        queryParams.push(`mode=${query?.mode}`);
    };
    if (query?.status) {
        queryParams.push(`report_status=${query?.status}`);
    };
    if (query?.head_leave_id) {
        queryParams.push(`head_leave_id=${query?.head_leave_id}`);
    };
    if (query?.from_date) {
        queryParams.push(`from_date=${query?.from_date}`);
    };
    if (query?.to_date) {
        queryParams.push(`to_date=${query?.to_date}`);
    };
    let apiPath =  API_ENDPOINTS.getExpense
    if (queryParams.length > 0) {
        apiPath += '?' + queryParams.join('&');
    }
    // return apiService.get<any>(apiPath);
    return apiService.get<ILeaveApplicationRes>(apiPath);
}

function addExpenseService(data: AddExpenseReq) {
    return apiService.post<AddExpenseRes>(
        API_ENDPOINTS.addExpense,
        data
    );
}

function updateExpenseService(data: UpdateExpenseReq) {
    return apiService.put<UpdateExpenseRes>(
        API_ENDPOINTS.updateExpense,
        data
    );
}

function deleteExpenseService(expence_id: DeleteExpenseReq) {
    return apiService.delete<deleteExpenseRes>(
        `${API_ENDPOINTS.deleteExpense}/${expence_id}`
    );
}

// function getExpenseByIdService(expence_id: string) {
//     return apiService.get<IExpenseDataRes>(`${API_ENDPOINTS.getPolicyTypeById}/${expence_id}`)
// }

// Leave Head
function getLeaveHeadService() {
    return apiService.get<ILeaveHeadDataRes>(`${API_ENDPOINTS.getLeaveHead}`);
}

function addLeaveHeadService(data: AddLeaveHeadReq) {
    return apiService.post<AddLeaveHeadRes>(
        API_ENDPOINTS.addLeaveHead,
        data
    );
}

function updateLeaveHeadService(data: UpdateLeaveHeadReq) {
    return apiService.put<UpdateLeaveHeadRes>(
        API_ENDPOINTS.updateLeaveHead,
        data
    );
}

function deleteLeaveHeadService(leave_head_id: DeleteLeaveHeadReq) {
    return apiService.delete<deleteLeaveheadRes>(
        `${API_ENDPOINTS.deleteLeaveHead}/${leave_head_id}`
    );
}

function getLeaveHeadByIdService(leave_head_id: string) {
    return apiService.get<ILeaveHeadDataRes>(`${API_ENDPOINTS.getLeaveHeadById}/${leave_head_id}`)
}

// Leave count

function getLeaveHeadCountService(query: any) {
    const queryParams = [];
    if (query?.year) {
        queryParams.push(`year=${query?.year}`);
    };
    if (query?.mode) {
        queryParams.push(`mode=${query?.mode}`);
    }
    let apiPath = API_ENDPOINTS.getLeaveCountByYear;
    if (queryParams.length > 0) {
        apiPath += '?' + queryParams.join('&');
    }
    // return apiService.get<any>(apiPath);
    return apiService.get<ILeaveHeadCountDataRes>(apiPath);
}

function addLeaveHeadCountService(data: LeaveHeadCountReq) {
    return apiService.post<AddLeaveHeadCountRes>(
        API_ENDPOINTS.addLeaveCount,
        data
    );
}

function updateLeaveHeadCountService(data: UpdateLeaveHeadCountReq) {
    return apiService.put<UpdateLeaveHeadCountRes>(
        API_ENDPOINTS.updateLeaveCount,
        data
    );
}



function getLeaveHeadCountByIdService(headLeaveCntId: string) {
    return apiService.get<ILeaveHeadCountDataRes>(`${API_ENDPOINTS.getLeaveCount}/${headLeaveCntId}`)
}

function getUserPendingLeaveService(query: any) {
    const queryParams = [];
    if (query?.id) {
        queryParams.push(`head_leave_cnt_id=${query?.id}`);
    };
    if (query?.left_leave) {
        queryParams.push(`left_leave=${query?.left_leave}`);
    };
    let apiPath = API_ENDPOINTS.getUserPendingLeaves;
    if (queryParams.length > 0) {
        apiPath += '?' + queryParams.join('&');
    }
    // return apiService.get<any>(apiPath);
    return apiService.get<ILeaveHeadCountDataRes>(apiPath);
}
function addLeaveApplicationService(data: AddLeaveApplicationReq) {
    return apiService.post<AddLeaveApplicationRes>(
        API_ENDPOINTS.addLeaveApplication,
        data
    );
}
function addHolidayService(data: AddHolidayApplicationReq) {
    return apiService.post<AddHolidayApplicationRes>(
        API_ENDPOINTS.addHolidayApplication,
        data
    );
} 

function getHolidayService(query: any) {
    const queryParams = [];

    if (query?.holiday) {
        queryParams.push(`name=${query?.name}`);
    }
    if (query?.holidayDate) {
        queryParams.push(`date=${query?.date}`);
    }
    if (query?.day) {
        queryParams.push(`day=${query?.day}`);
    }

    let apiPath = API_ENDPOINTS.getHoliday;
    if (queryParams.length > 0) {
        apiPath += '?' + queryParams.join('&');
    }

    return apiService.get<IHolidayApplicationRes>(apiPath);
}

function getLeaveApplicationService(query:any) {
    const queryParams = [];
    
    if (query?.userFil_id) {
        queryParams.push(`userFil_id=${query?.userFil_id}`);
    };
    if (query?.mode) {
        queryParams.push(`mode=${query?.mode}`);
    };
    if (query?.status) {
        queryParams.push(`status=${query?.status}`);
    };
    if (query?.head_leave_id) {
        queryParams.push(`head_leave_id=${query?.head_leave_id}`);
    };
    if (query?.from_date) {
        queryParams.push(`from_date=${query?.from_date}`);
    };
    if (query?.to_date) {
        queryParams.push(`to_date=${query?.to_date}`);
    };
    let apiPath =  API_ENDPOINTS.getLeaveApplication
    if (queryParams.length > 0) {
        apiPath += '?' + queryParams.join('&');
    }
    // return apiService.get<any>(apiPath);
    return apiService.get<ILeaveApplicationRes>(apiPath);
}

function updateLeaveApplicationService(data: UpdateLeaveAppReq) {
    return apiService.put<UpdateLeaveAppRes>(
        API_ENDPOINTS.updateLeaveApplication,
        data
    );
}

// Activity Type
function getActivityTypeService(data:any) {
    const queryParams = [];
    if (data?.status) {
        queryParams.push(`status=${data?.status}`);
    }
    let apiPath = API_ENDPOINTS.getActivityType;
    if (queryParams.length > 0) {
        apiPath += '?' + queryParams.join('&');
    }
    return apiService.get<any>(apiPath);
    // return apiService.get<any>(`${API_ENDPOINTS.getActivityType}`);
}

function addActivityTypeService(data: any) {
    return apiService.post<any>(
        API_ENDPOINTS.addActivityType,
        data
    );
}

function updateActivityTypeService(data: any) {
    return apiService.put<any>(
        API_ENDPOINTS.updateActivityType,
        data
    );
}

function deleteActivityTypeService(id: any) {
    return apiService.delete<any>(
        `${API_ENDPOINTS.deleteActivityType}/${id}`
    );
}

function getActivityTypeByIdService(id: string) {
    return apiService.get<any>(`${API_ENDPOINTS.getActivityTypeById}/${id}`)
}

// Activity Related To

function getActivityRelToService(data:any) {
    const queryParams = [];
    if (data?.status) {
        queryParams.push(`status=${data?.status}`);
    }
    let apiPath = API_ENDPOINTS.getActivityRelTo;
    if (queryParams.length > 0) {
        apiPath += '?' + queryParams.join('&');
    }
    return apiService.get<any>(apiPath);

    // return apiService.get<any>(`${API_ENDPOINTS.getActivityRelTo}`);
}

function addActivityRelToService(data: any) {
    return apiService.post<any>(
        API_ENDPOINTS.addActivityRelTo,
        data
    );
}

function updateActivityRelToService(data: any) {
    return apiService.put<any>(
        API_ENDPOINTS.updateActivityRelTo,
        data
    );
}

function deleteActivityRelToService(id: any) {
    return apiService.delete<any>(
        `${API_ENDPOINTS.deleteActivityRelTo}/${id}`
    );
}

function getActivityRelToByIdService(id: string) {
    return apiService.get<any>(`${API_ENDPOINTS.getActivityRelToById}/${id}`)
}

// Next Action On

function getNextActionOnService(data:any) {
    const queryParams = [];
    if (data?.status) {
        queryParams.push(`status=${data?.status}`);
    }
    let apiPath = API_ENDPOINTS.getNextActionOn;
    if (queryParams.length > 0) {
        apiPath += '?' + queryParams.join('&');
    }
    return apiService.get<any>(apiPath);
    // return apiService.get<any>(`${API_ENDPOINTS.getNextActionOn}`);
}

function addNextActionOnService(data: any) {
    return apiService.post<any>(
        API_ENDPOINTS.addNextActionOn,
        data
    );
}

function updateNextActionOnService(data: any) {
    return apiService.put<any>(
        API_ENDPOINTS.updateNextActionOn,
        data
    );
}

function deleteNextActionOnService(id: any) {
    return apiService.delete<any>(
        `${API_ENDPOINTS.deleteNextActionOn}/${id}`
    );
}

function getNextActionOnByIdService(id: string) {
    return apiService.get<any>(`${API_ENDPOINTS.getNextActionOnById}/${id}`)
}

// Dar Status

function getStatusService(data:any) {
    const queryParams = [];
    if (data?.status) {
        queryParams.push(`status=${data?.status}`);
    }
    let apiPath = API_ENDPOINTS.getStatus;
    if (queryParams.length > 0) {
        apiPath += '?' + queryParams.join('&');
    }
    return apiService.get<any>(apiPath);
    // return apiService.get<any>(`${API_ENDPOINTS.getStatus}`);
}

function addStatusService(data: any) {
    return apiService.post<any>(
        API_ENDPOINTS.addStatus,
        data
    );
}

function updateStatusService(data: any) {
    return apiService.put<any>(
        API_ENDPOINTS.updateStatus,
        data
    );
}

function deleteStatusService(id: any) {
    return apiService.delete<any>(
        `${API_ENDPOINTS.deleteStatus}/${id}`
    );
}

function getStatusByIdService(id: string) {
    return apiService.get<any>(`${API_ENDPOINTS.getLeaveHeadById}/${id}`)
}

// DAR
function addDarService(data: any) {
    return apiService.post<any>(
        API_ENDPOINTS.addDar,
        data
    );
}

function getDarService(data:any) {
    const queryParams = [];
    if (data?.status) {
        queryParams.push(`status=${data?.status}`);
    }
    if (data?.from_date) {
        queryParams.push(`from_date=${data?.from_date}`);
    }
    if (data?.to_date) {
        queryParams.push(`to_date=${data?.to_date}`);
    }
    let apiPath = API_ENDPOINTS.getDar;
    if (queryParams.length > 0) {
        apiPath += '?' + queryParams.join('&');
    }
    return apiService.get<any>(apiPath);
    // return apiService.get<any>(`${API_ENDPOINTS.getActivityType}`);
}
function getDarByIdService(id: string) {
    return apiService.get<any>(`${API_ENDPOINTS.getDarById}/${id}`)
}
function updateDarService(data: any) {
    return apiService.put<any>(
        API_ENDPOINTS.updateDar,
        data
    );
}
//  E-Detailing
function addEDetailingService(data: any) {
    return apiService.post<any>(
        API_ENDPOINTS.addEDetailing,
        data
    );
}

function getEDetailingService(data:any) {
    const queryParams = [];
    if (data?.status) {
        queryParams.push(`status=${data?.status}`);
    }
    if (data?.from_date) {
        queryParams.push(`from_date=${data?.from_date}`);
    }
    if (data?.to_date) {
        queryParams.push(`to_date=${data?.to_date}`);
    }
    let apiPath = API_ENDPOINTS.getEDetailing;
    if (queryParams.length > 0) {
        apiPath += '?' + queryParams.join('&');
    }
    return apiService.get<any>(apiPath);
    // return apiService.get<any>(`${API_ENDPOINTS.getActivityType}`);
}
function getEDetailingByIdService(id: any) {
    return apiService.get<any>(`${API_ENDPOINTS.getEDetailingById}/${id}`)
}
function updateEDetailingService(data: any) {
    return apiService.put<any>(
        API_ENDPOINTS.updateEDetailing,
        data
    );
}
function deleteEDetailingService(id: any) {
    return apiService.delete<any>(
        `${API_ENDPOINTS.deleteEDetailing}/${id}`
    );
}
export {
    getSSMUsersService,
    getUsersLearningRoleService,
    getStoresByEmpIdService,
    createUserService,
    getManagerService,
    getUserDetailsByEmpIdService,
    deleteUserService,
    updateUserService,
    getFeatureService,
    addFeatureService,
    updateFeatureService,
    deleteFeatureService,
    getFeatureByIdService,
    getRoleService,
    addRoleService,
    updateRoleService,
    deleteRoleService,
    getRoleByIdService,
    getStoresByBeatIdService,
    createUserImportService,

    getPolicyHeadService,
    addPolicyHeadService,
    updatePolicyHeadService,
    deletePolicyHeadService,
    getPolicyHeadByIdService,

    getPolicyTypeService,
    addPolicyTypeService,
    updatePolicyTypeService,
    deletePolicyTypeService,
    getPolicyTypeByIdService,

    getLeaveHeadService,
    addLeaveHeadService,
    updateLeaveHeadService,
    deleteLeaveHeadService,
    getLeaveHeadByIdService,

    getLeaveHeadCountService,
    addLeaveHeadCountService,
    updateLeaveHeadCountService,
    getLeaveHeadCountByIdService,

    getExpenseService,
    addExpenseService,
    updateExpenseService,
    deleteExpenseService,
    getUserPendingLeaveService,
    addLeaveApplicationService,
    getLeaveApplicationService,
    updateLeaveApplicationService,

    //Dar Configuration
    getActivityTypeService,
    addActivityTypeService,
    updateActivityTypeService,
    deleteActivityTypeService,
    getActivityTypeByIdService,

    getActivityRelToService,
    addActivityRelToService,
    updateActivityRelToService,
    deleteActivityRelToService,
    getActivityRelToByIdService,

    getNextActionOnService,
    addNextActionOnService,
    updateNextActionOnService,
    deleteNextActionOnService,
    getNextActionOnByIdService,

    getStatusService,
    addStatusService,
    updateStatusService,
    deleteStatusService,
    getStatusByIdService,

    addDarService,
    getDarService,
    getDarByIdService,
    updateDarService,
    
    addEDetailingService,
    getEDetailingService,
    getEDetailingByIdService,
    updateEDetailingService,
    deleteEDetailingService, 

    addHolidayService,
    getHolidayService,
    

    
}