import { API_ENDPOINTS } from "app-constants";
import { apiService } from "./apiService";
import { CreateVisitsReq, CreateVisitsRes, IUpdateVisitPicture, IUpdateVisitPictureRes, IVisitCheckInReq, IVisitCheckInRes, IVisitCheckOutReq, IVisitCheckOutRes, IVisitFilter, IVisitNoOrderReasonReq, IVisitsDetailRes, IVisitsRes } from "types/Visits";
import { IPagination } from "types/Common";

function getVisitsService(filters?: IVisitFilter, pagination?: IPagination) {
    const params: any = {}
    if (filters?.duration) {
        params.duration = filters.duration
    }
    if (filters?.beat) {
        params.beatId = filters.beat
    }
    if (filters?.status) {
        params.status = filters.status
    }
    if (pagination) {
        params.pageNumber = pagination.pageNumber;
        params.pageSize = pagination.pageSize;
    }
    return apiService.get<IVisitsRes>(API_ENDPOINTS.getVisits, { params });
}

function getVisitsByVisitIdService(visitId: number) {
    return apiService.get<IVisitsDetailRes>(`${API_ENDPOINTS.getVisitsById}/${visitId}`);
}

function getOrderCountByVisitIdService(visitId: number, storeId: number) {
    return apiService.get<any>(`${API_ENDPOINTS.getOrderCounttByVisitId}/${visitId}/${storeId}`)
}

function visitsCheckInService(data: IVisitCheckInReq) {
    return apiService.post<IVisitCheckInRes>(`${API_ENDPOINTS.visitCheckIn}`, data);
}

function visitsCheckOutService(data: IVisitCheckOutReq) {
    return apiService.post<IVisitCheckOutRes>(`${API_ENDPOINTS.visitCheckOut}`, data);
}

function updateVisitPictureService(data: IUpdateVisitPicture) {
    return apiService.post<IUpdateVisitPictureRes>(`${API_ENDPOINTS.updateVisitPicture}`, data);
}

function createVisitsService(data: CreateVisitsReq) {
    return apiService.post<CreateVisitsRes>(
        API_ENDPOINTS.createVisits,
        data
    );
}

function getDayTrackingReportSerice(timePeriod: any) {
    const params: any = {};
    params.timePeriod = timePeriod
    return apiService.get<any>(API_ENDPOINTS.getDayTrackingReport, { params } );
}

function updateVisitNoOrderReasonService(data: IVisitNoOrderReasonReq) {
    return apiService.put<any>(
        API_ENDPOINTS.updateVisitWithNoOrderReason,
        data
    );
}

function getPastNoOrderService(data:any) {
    const params: any = {}
    if (data) {
        params.storeId = data.storeId;
        params.empId = data.empId;
    }
    return apiService.get<IVisitsRes>(API_ENDPOINTS.getPastNoOrderReason, { params });
}

function getVisitPictureService(data:any) {
    const params: any = {}
    if (data) {
        params.storeId = data.storeId;
    }
    return apiService.get<IVisitsRes>(API_ENDPOINTS.getVisitPictureByStoreId, { params });
}

function createVisitsImportService(data: CreateVisitsReq) {
    return apiService.post<CreateVisitsRes>(
        API_ENDPOINTS.createImportVisits,
        data
    );
}

function getMrVisitReport(pageNumber: string, pageSize: string) {
    return apiService.get<any>(
          `${API_ENDPOINTS.getVisitReport}?pageNumber=${pageNumber}&pageSize=${pageSize}`
      
    );
}
export {
    getVisitsService,
    getVisitsByVisitIdService,
    visitsCheckInService,
    visitsCheckOutService,
    updateVisitPictureService,
    createVisitsService,
    getDayTrackingReportSerice,
    updateVisitNoOrderReasonService,
    getOrderCountByVisitIdService,
    getPastNoOrderService,
    getVisitPictureService,
    createVisitsImportService,
    getMrVisitReport
}