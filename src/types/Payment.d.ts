import { OrderStatus, PaymentStatus } from "enum/order";
import { IApiResponse } from "./Common";
import { ISkuDiscount } from "./Product";

export interface ICreatePaymentReq {
    orderId: number;
    paymentDate: string;
    transactionId: string;
    status:string;
    amount: number;
    paymentMode: string;
    paymentRefImg?: string;
}

export interface IAddOnlinePaymentReq {
    amount: number;
    currency: string;
    keyId: string;
    keySecret: any;
}
export interface IPaymentCaptureReq {
    status: string;
    orderDetails?: {
        orderId: number,
        paymentId: string,
        signature?: string
    };
}


export interface IAddOnlinePaymentRes {
    order_id: number;
    amount: number;
    currency: string;
}
export type IGetOnlinePaymentRes = IApiResponse<IAddOnlinePaymentReq[]>

interface IGetPaymentHistoryData {
    paymentId: number;
    orderId: number;
    paymentDate: string;
    transactionId: string;
    status:string;
    paymentMode: string;
}

export type IGetPaymentHistoryRes = IApiResponse<IGetPaymentHistoryData[]>


// Paymeny mode


export interface PaymentMode {
    paymentModeId: number;
    empId: number;
    name: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export type AddPaymentModeReq = {
    name: string;
  }
  
  export type AddPaymentModeRes = IApiResponse<{
    message: string;
  }>
  
  export type UpdatePaymenyModeReq = {
    paymentModeId: number;
    name: string
  }
  
  export type UpdatePaymentModeRes = IApiResponse<{
    message: string;
  }>
  
  
  export type DeletePaymentModeReq = {
    paymentModeId: number;
  }
  
  export type deletePaymentModeRes = IApiResponse<{
    message: string;
  }>
  
  export interface IPaymentModeData {
    paymentModeId: number
    name: string
  }
  
  export type IPaymentModeRes = IApiResponse<IPaymentModeData>;

