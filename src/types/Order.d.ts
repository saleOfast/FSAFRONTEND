import { OrderStatus, PaymentStatus, SpecialDiscountStatus } from "enum/order";
import { IApiResponse } from "./Common";
import { ISkuDiscount } from "./Product";
import { VisitTypeEnum } from "enum/common";

export interface ICreateOrderReq {
  storeId: number;
  visitId?: number | null;
  isCallType?: VisitTypeEnum
  orderDate: string;
  orderAmount: number;
  products: Product[];
  orderStatus: OrderStatus;
  netAmount: number;
  isVisibility: boolean;
  orderId?: number | null;
  pieceDiscount?: number; 
}

interface Visit {
  visitDate: string;
}

interface IGetOrderHistoryData {
  orderId: number;
  orderDate: string;
  orderAmount: number;
  netAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  visit: Visit;
  status: string;
}

export type IGetOrderHistoryRes = IApiResponse<IGetOrderHistoryData[]>

interface IGetOrderCollectionData {
  orderId: number;
  orderDate: string;
  orderAmount: number;
  netAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  visit: Visit;
  status: string;
}

export type IGetOrderCollectionDataRes = IApiResponse<IGetOrderCollectionData>

interface Visit {
  visitId: number;
  empId: number;
  beat: number;
  storeId: number;
  visitDate: string;
  checkIn: string;
  checkInLat: string;
  checkInLong: string;
  checkOut?: any;
  checkOutLat?: any;
  checkOutLong?: any;
  duration?: any;
  isCallType: string;
  status: string;
  image?: any;
  createdAt: string;
  updatedAt: string;
}

interface Store {
  storeId: number;
  empId: number;
  storeName: string;
  storeType?: any;
  lat?: any;
  long?: any;
  addressLine1: string;
  addressLine2: string;
  townCity: string;
  state: string;
  email: string;
  pinCode: string;
  ownerName: string;
  mobileNumber: string;
  openingTime: string;
  closingTime: string;
  isPremiumStore: boolean;
  flatDiscount?: any;
  visibilityDiscount?: any;
  orderValueDiscount?: any;
  isActiveOrderValueDiscount?: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  categoryId: number;
  brandId: number;
  productId: number;
  productName: string;
  mrp: number;
  rlp: number;
  noOfCase: number;
  noOfPiece: number;
  isFocused: boolean;
  skuDiscount: ISkuDiscount;
  caseQty: number;
}
export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
}
export interface IOrderSummaryData {
  orderId: number
  empId: number
  storeId: number
  visitId: number
  orderDate: string
  orderAmount: string
  products: Product[]
  collectedAmount: string
  paymentStatus: PaymentStatus
  netAmount: string
  totalDiscountAmount: number | null
  orderStatus: OrderStatus
  isCallType: VisitTypeEnum
  createdAt: string
  updatedAt: string
  store: Store
  visit: Visit
  flatDiscountValue: null | number
  orderValueDiscountValue: null | number
  skuDiscountValue: null | number
  specialDiscountValue: null | number
  specialDiscountAmount: null | number
  totalDiscountAmount: null | number
  visibilityDiscountValue: null | number
  pieceDiscount: null | number
  statusHistory: StatusHistoryEntry[]
}

export type IOrderSummaryRes = IApiResponse<IOrderSummaryData>;

interface Fields {
  key: string;
  bucket: string;
  'X-Amz-Algorithm': string;
  'X-Amz-Credential': string;
  'X-Amz-Date': string;
  Policy: string;
  'X-Amz-Signature': string;
}

export interface IGetSignedUrlData {
  fields: Fields;
  url: string;
  fileUrl: string;
}

export type IGetSignedUrlRes = IApiResponse<IGetSignedUrlData>;

export interface IUpdateCollectionReq {
  collectedAmount: number;
  orderId: number;
}

export interface IUpdateOrderStatusReq {
  orderStatus: OrderStatus;
  orderId: number;
}

export type UpdateOrderStatusRes = IApiResponse<{
  message: string;
}>


export interface IUpdateOrderSpecialDiscountReq {
  specialDiscountStatus: any
  specialDiscountValue: number;
  orderId: number;
}

export type IUpdateOrderSpecialDiscountRes = IApiResponse<{
  message: string;
}>

// No Order Reason

export interface NoReason {
  reasonId: number;
  empId: number;
  description: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AddNoOrderReq = {
  description: string;
}

export type AddNoOrderRes = IApiResponse<{
  message: string;
}>

export type UpdateNoOrderReq = {
  reasonId: number;
  description: string
}

export type UpdateNoOrderRes = IApiResponse<{
  message: string;
}>


export type DeleteNoOrderReq = {
  reasonId: number;
}

export type deleteNoOrderRes = IApiResponse<{
  message: string;
}>

export interface INoOrderData {
  reasonId: number
  description: string
}

export type INoOrderRes = IApiResponse<INoOrderData>;


