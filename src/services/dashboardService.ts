import { API_ENDPOINTS } from "app-constants";
import { apiService } from "./apiService";
import { AddTargetReq, AddTargetRes, DeleteTargetReq, DeleteTargetRes, GetTargetRes, IDashboardRes, IRetailorDashboardRes, ITargetRes, UpdateApprovalStoreReq, UpdateApprovalStoreRes, UpdateTargetReq, UpdateTargetRes } from "types/Dashboard";

function getDashboardService(timePeriod: any) {
    const params: any = {};
    params.timePeriod = timePeriod
    return apiService.get<IDashboardRes>(API_ENDPOINTS.getDashboard, { params });
}

function getRetailorDashboardService(timePeriod: any) {
    const params: any = {};
    params.timePeriod = timePeriod
    return apiService.get<IRetailorDashboardRes>(API_ENDPOINTS.getRetailorDashboard, { params });
}


function getAdminDashboardService(timePeriod: any) {
    const params: any = {};
    params.timePeriod = timePeriod
    return apiService.get<any>(API_ENDPOINTS.getAdminDashboard, { params });
}

function getAdminDashboardRevenueService() {
    return apiService.get<any>(API_ENDPOINTS.getAdminDashboardRevenueChart);
}

function updateApprovalSpecialDiscountService(data: UpdateApprovalStoreReq) {
    return apiService.post<UpdateApprovalStoreRes>(
        API_ENDPOINTS.updateApprovalStore,
        data
    );
}

function getTargetService(timePeriod: any) {
    const params: any = {};
    params.timePeriod = timePeriod;
    return apiService.get<GetTargetRes>(API_ENDPOINTS.getTarget, { params });
}

function addTargetService(data: AddTargetReq) {
    return apiService.post<AddTargetRes>(
        API_ENDPOINTS.addTarget,
        data
    );
}

function updateTargetService(data: UpdateTargetReq) {
    return apiService.post<UpdateTargetRes>(
        API_ENDPOINTS.updateTarget,
        data
    );
}

function deleteTargetService(targetId: DeleteTargetReq) {
    return apiService.delete<DeleteTargetRes>(
        `${API_ENDPOINTS.deleteTarget}/${targetId}`
    );
}

function getTargetByIdService(targetId: string) {
    return apiService.get<ITargetRes>(`${API_ENDPOINTS.getTargetById}/${targetId}`)
}

function getYearlyTargetAchievedService(year: any, empId: any) {
    const params: any = {};
    params.year = year;
    params.empId = empId;
    return apiService.get<any>(API_ENDPOINTS.getYearlyTarget, { params });
}

function getAllTargetByEmpId(emp_id: any) {
    const params: any = {};
    params.emp_id = emp_id;
    return apiService.get<any>(API_ENDPOINTS.getAllTargetByEmpId, { params });
}

function getPendingAmount() {
    return apiService.get<any>(`${API_ENDPOINTS.getPendingAmount}`);
  }


export {
    getDashboardService,
    getAdminDashboardService,
    getTargetService,
    addTargetService,
    updateApprovalSpecialDiscountService,
    getAdminDashboardRevenueService,
    updateTargetService,
    deleteTargetService,
    getTargetByIdService,
    getYearlyTargetAchievedService,
    getAllTargetByEmpId,
    getRetailorDashboardService,
    getPendingAmount
}