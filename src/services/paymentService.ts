import { API_ENDPOINTS } from "app-constants";
import { apiService } from "./apiService";
import { IGetOrderCollectionDataRes } from "types/Order";
import { AddPaymentModeReq, AddPaymentModeRes, DeletePaymentModeReq, deletePaymentModeRes, ICreatePaymentReq, IGetOnlinePaymentRes, IPaymentCaptureReq, UpdatePaymentModeRes, UpdatePaymenyModeReq } from "types/Payment";

function addPaymentByCashService(data: ICreatePaymentReq) {
    return apiService.post(API_ENDPOINTS.addPaymentByCash, data)
}

function addPaymentByOnlineService(data: IGetOnlinePaymentRes) {
    return apiService.post(API_ENDPOINTS.addPaymentByOnline, data)
}

function paymentCaptureByRazorpayService(data: IPaymentCaptureReq) {
    return apiService.post(API_ENDPOINTS.paymentCaptureByRazorpay, data)
}


function getPaymentRecordByOrderIdService(orderId: string) {
    return apiService.get<IGetOrderCollectionDataRes>(`${API_ENDPOINTS.getPaymentRecordByOrderId}/${orderId}`)
}

// payment Mode

function getPaymentModeService() {
    return apiService.get<any>(API_ENDPOINTS.getPaymentMode);
}

function addPaymentModeService(data: AddPaymentModeReq) {
    return apiService.post<AddPaymentModeRes>(
        API_ENDPOINTS.addPaymentMode,
        data
    );
}

function updatePaymentModeService(data: UpdatePaymenyModeReq) {
    return apiService.post<UpdatePaymentModeRes>(
        API_ENDPOINTS.updatePaymentMode,
        data
    );
}

function deletePaymentModeService(paymentModeId: DeletePaymentModeReq) {
    return apiService.delete<deletePaymentModeRes>(
        `${API_ENDPOINTS.deletePaymentMode}/${paymentModeId}`
    );
}

function getPaymentModeByIdService(paymentModeId: string) {
    return apiService.get<any>(`${API_ENDPOINTS.getPaymentModeById}/${paymentModeId}`)
}


export {
    addPaymentByCashService,
    addPaymentByOnlineService,
    paymentCaptureByRazorpayService,
    getPaymentRecordByOrderIdService,
    getPaymentModeService,
    addPaymentModeService,
    updatePaymentModeService,
    deletePaymentModeService,
    getPaymentModeByIdService
}