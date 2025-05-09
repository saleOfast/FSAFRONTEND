import { API_ENDPOINTS } from "app-constants";
import { apiService } from "./apiService";
import { AddNoOrderReq, AddNoOrderRes, DeleteNoOrderReq, deleteNoOrderRes, ICreateOrderReq, IGetOrderCollectionDataRes, IGetOrderHistoryRes, IGetSignedUrlRes, IOrderSummaryRes, IUpdateCollectionReq, IUpdateOrderSpecialDiscountReq, IUpdateOrderSpecialDiscountRes, IUpdateOrderStatusReq, UpdateNoOrderReq, UpdateNoOrderRes, UpdateOrderStatusRes } from "types/Order";
import { IPagination } from "types/Common";
import { DurationEnum } from "enum/common";
import { OrderStatus } from "enum/order";

function createOrderService(data: ICreateOrderReq) {
    return apiService.post(API_ENDPOINTS.createOrder, data)
}

function getOrderListByStoreIdService(storeId: string) {
    return apiService.get<IGetOrderHistoryRes>(`${API_ENDPOINTS.getOrderListByStoreId}/${storeId}`)
}

function getCollectionByOrderIdService(orderId: string) {
    return apiService.get<IGetOrderCollectionDataRes>(`${API_ENDPOINTS.getCollectionByOrderId}/${orderId}`)
}

function getCollectionByStoreIdService(filters: any, storeId: string) {
    const params: any = {}
    if (filters?.status && filters?.status !== "ALL") {
        params.status = filters.status
    }
    // if (pagination) {
    //     params.pageNumber = pagination.pageNumber;
    //     params.pageSize = pagination.pageSize;
    // }
    return apiService.get<IGetOrderCollectionDataRes>(`${API_ENDPOINTS.getCollectionByStoreId}/${storeId}`, { params })
}


function getOrderSummaryByOrderIdService(orderId: string) {
    return apiService.get<IOrderSummaryRes>(`${API_ENDPOINTS.getOrderSummaryByOrderId}/${orderId}`)
}

function getOrderSignedUrlService(name: string) {
    return apiService.get<IGetSignedUrlRes>(`${API_ENDPOINTS.getOrderSignedUrl}?fileName=${name}`)
}

function getAllOrdersListService(filters: any, pagination?: IPagination) {
    const params: any = {}
    if (filters?.duration ) {
        params.duration = filters.duration
    }
    if (pagination) {
        params.pageNumber = pagination.pageNumber;
        params.pageSize = pagination.pageSize;
    }
    if(filters?.orderStatus){
        params.orderStatus = filters.orderStatus;
    }
    if(filters?.isCallType){
        params.isCallType = filters.isCallType;
    }
    return apiService.get<any>(API_ENDPOINTS.getAllOrdersList, { params })
}

function getAllCollectionsListService(filters: any, pagination?: IPagination) {
    const params: any = {}
    if (filters?.status && filters?.status !== DurationEnum.ALL) {
        params.status = filters.status
    }
    if (pagination) {
        params.pageNumber = pagination.pageNumber;
        params.pageSize = pagination.pageSize;
    }
    return apiService.get<any>(API_ENDPOINTS.getAllCollectionsList, { params })
}

function updateCollectionAmountService(data: IUpdateCollectionReq) {
    return apiService.put(API_ENDPOINTS.updateCollectionAmount, data)
}

function updateOrderTrackStatusService(data: IUpdateOrderStatusReq) {
    return apiService.put<UpdateOrderStatusRes>(
        API_ENDPOINTS.updateOrderStatus,
        data
    );
}

function updateOrderSpecailDiscountService(data: IUpdateOrderSpecialDiscountReq) {
    return apiService.put<IUpdateOrderSpecialDiscountRes>(
        API_ENDPOINTS.updateOrderBySpecialDiscount,
        data
    );
}

function getAllPendingApprovalOrderService() {
    return apiService.get<any>(API_ENDPOINTS.getAllPendingApprovalOrder)
}

function getPendingCollectionReportService() {
    // const params: any = {};
    // params.timePeriod = timePeriod
    return apiService.get<any>(API_ENDPOINTS.getPendingCollectionReport );
}


function getPendingApprovalReportService() {
    // const params: any = {};
    // params.timePeriod = timePeriod
    return apiService.get<any>(API_ENDPOINTS.getPendingApprovalReport );
}
function getStoreRevenueReportService(timePeriod:any) {
    const params: any = {};
    params.timePeriod = timePeriod
    return apiService.get<any>(API_ENDPOINTS.getStoreRevenueReport, {params} );
}
function getSkuRevenueReportService(timePeriod:any) {
    const params: any = {};
    params.timePeriod = timePeriod
    return apiService.get<any>(API_ENDPOINTS.getSkuRevenueReport, {params} );
}
function getMonthlyProgressReportService(timePeriod: any) {
    const params: any = {};
    params.timePeriod = timePeriod
    return apiService.get<any>(API_ENDPOINTS.getMonthlyProgresReport, {params} );
}
function getMonthlyOrderReportService(timePeriod: any) {
    const params: any = {};
    params.timePeriod = timePeriod
    return apiService.get<any>(API_ENDPOINTS.getMonthlyOrderReport, {params} );
}
function getUnbilledStoreReportService() {
    return apiService.get<any>(API_ENDPOINTS.getUnbilledStoreReport );
}
function getEmpPerformanceReportService(timePeriod:any) {
    const params: any = {};
    params.timePeriod = timePeriod
    return apiService.get<any>(API_ENDPOINTS.getEmpPerformanceReport, {params} );
}
function getMonthlyNoOrderReasonReportService(timePeriod:any) {
    const params: any = {};
    params.timePeriod = timePeriod
    return apiService.get<any>(API_ENDPOINTS.getMonthlyNoOrderReasonReport, {params} );
}

// No order Reason

function getNoOrderService() {
    return apiService.get<any>(API_ENDPOINTS.getNoOrderReason);
}

function addNoOrderService(data: AddNoOrderReq) {
    return apiService.post<AddNoOrderRes>(
        API_ENDPOINTS.addNoOrderReason,
        data
    );
}

function updateNoOrderService(data: UpdateNoOrderReq) {
    return apiService.post<UpdateNoOrderRes>(
        API_ENDPOINTS.updateNoOrderReason,
        data
    );
}

function deleteNoOrderService(reasonId: DeleteNoOrderReq) {
    return apiService.delete<deleteNoOrderRes>(
        `${API_ENDPOINTS.deleteNoOrderReason}/${reasonId}`
    );
}

function getNoOrderByIdService(reasonId: string) {
    return apiService.get<any>(`${API_ENDPOINTS.getNoOrderReasonById}/${reasonId}`)
}
function addImportNoOrderService(data: AddNoOrderReq) {
    return apiService.post<AddNoOrderRes>(
        API_ENDPOINTS.importNoOrderReason,
        data
    );
}

export {
    createOrderService,
    getOrderListByStoreIdService,
    getOrderSummaryByOrderIdService,
    getOrderSignedUrlService,
    updateCollectionAmountService,
    getAllCollectionsListService,
    getAllOrdersListService,
    getCollectionByOrderIdService,
    getCollectionByStoreIdService,
    updateOrderTrackStatusService,
    updateOrderSpecailDiscountService,
    getAllPendingApprovalOrderService,
    getPendingCollectionReportService,
    getPendingApprovalReportService,
    getStoreRevenueReportService,
    getSkuRevenueReportService,
    getMonthlyProgressReportService,
    getUnbilledStoreReportService,
    getEmpPerformanceReportService,
    getMonthlyNoOrderReasonReportService,

    getNoOrderService,
    addNoOrderService,
    updateNoOrderService,
    deleteNoOrderService,
    getNoOrderByIdService,
    getMonthlyOrderReportService,
    addImportNoOrderService
}