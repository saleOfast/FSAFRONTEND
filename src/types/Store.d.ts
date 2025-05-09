import { storeActionsType } from "redux-store/action-type/storeActionsType";
import { IApiResponse } from "./Common";
import { DiscountTypeEnum } from "enum/product";
import { UserRole } from "enum/common";

export type AddStoreCategoryReq = {
  categoryName: string;
}

export type AddStoreCategoryRes = IApiResponse<{
  message: string;
}>

export type UpdateStoreCategoryReq = {
  categoryId: number;
  categoryName: string
}

export type UpdateStoreCategoryRes = IApiResponse<{
  message: string;
}>

export type DeleteStoreCategoryReq = {
  storeCategoryId: number;
}

export type DeleteStoreCategoryRes = IApiResponse<{
  message: string;
}>

export interface IStoreCategoryData {
  categoryId: number
  categoryName: string
}

export type IStoreCategoryRes = IApiResponse<IStoreCategoryData>;
export interface StoreCategoryData {
  storeCategoryId: number;
  categoryName: string;
  empId: number;
  createdAt: string;
  updatedAt: string;
}

export type StoreCategoryRes = IApiResponse<StoreCategoryData[]>

export type CreateBeatReq = {
  beatName: string;
  area: string;
  country: string;
  district: string;
  state: string;
  city: string;
  store: any[];
  salesRep: number;
}

export type CreateBeatRes = IApiResponse<{
  message: string;
}>
export interface StoreBeatData {
  beatId: number;
  empId: number;
  beatName: string;
  store: number[];
  area: string;
  IsEnable: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type StoreBeatRes = IApiResponse<StoreBeatData[]>;

export interface IStoreData {
  storeId: number
  empId: number
  storeName: string
  storeType?: number
  lat?: string
  long?: string
  addressLine1: string
  addressLine2: string
  townCity: string
  state: string
  district?: string 
  email: string
  pinCode: string
  ownerName: string
  alterMobile: string
  mobileNumber: string
  openingTime: string
  closingTime: string
  isPremiumStore: boolean
  flatDiscount?: FlatDiscount
  visibilityDiscount?: VisibilityDiscount
  orderValueDiscount?: OrderValueDiscount[]
  isActiveOrderValueDiscount?: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  storeCat?: StoreType
  key?:any
  beat: {
    "beatId": number,
    "beatName": string
  } | null
}

export interface FlatDiscount {
  discountType: DiscountTypeEnum
  value: number
  isActive: boolean
}

export interface VisibilityDiscount {
  discountType: DiscountTypeEnum
  value: number
  isActive: boolean
}

export interface OrderValueDiscount {
  amountRange: string
  discountType: DiscountTypeEnum
  value: number
}

export interface StoreType {
  storeCategoryId: number
  categoryName: string
  empId: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface IStoreReducer {
  storeCategory: StoreCategoryData[];
  storeBeat: StoreBeatData[];
  storeList: IStoreData[];
  storeFilters: any;
  totalStoreRecords: number;
}

export interface ISetStoreCategoryAction {
  type: storeActionsType.SET_STORE_CATEGORY;
  payload: StoreCategoryData[];
}

export interface ISetStoreBeatAction {
  type: storeActionsType.SET_STORE_BEAT;
  payload: StoreBeatData[];
}

export interface ISetStoreAction {
  type: storeActionsType.GET_STORE;
  payload: any;
}

export interface ILoadMoreStoreAction {
  type: storeActionsType.LOAD_MORE_STORE;
  payload: any;
}

export interface IStoreIsLoadingAction {
  type: storeActionsType.IS_STORE_LOADING;
  payload: boolean;
}

export interface ISetStoreFiltersAction {
  type: storeActionsType.SET_STORE_FILTERS;
  payload: any;
}

export type IStoreReducerAction = ISetStoreCategoryAction | ISetStoreBeatAction | ISetStoreAction | IStoreIsLoadingAction | ISetStoreFiltersAction | ILoadMoreStoreAction;

export interface ICreateStoreReq {
  assignTo?: number;
  assignToRetailor?: number;
  storeName: string;
  storeType: string;
  lat: string;
  long: string;
  addressLine1: string;
  addressLine2: string;
  townCity: string;
  state: string;
  district: string
  email: string;
  pinCode: string;
  ownerName: string;
  mobileNumber: string;
  alterMobile: string;
  openingTime: string;
  closingTime: string;
  isPremiumStore: boolean;
  isActive: boolean;
  beat: string;
}

export type ICreateStoreRes = IApiResponse<any>;

export type IUpdateStoreReq = {
  storeName: string;
  storeType: string;
  lat: string;
  long: string;
  addressLine1: string;
  addressLine2: string;
  townCity: string;
  state: string;
  district: string
  email: string;
  pinCode: string;
  ownerName: string;
  mobileNumber: string;
  alterMobile: string;
  openingTime: string;
  closingTime: string;
  isPremiumStore: boolean;
  isActive: boolean;
  beat: string;
}

export type UpdateStoreRes = IApiResponse<{
  message: string;
}>

export type DeleteBeatReq = {
  beatId: number;
}

export type deleteBeatRes = IApiResponse<{
  message: string;
}>

export interface IBeatData {
  empId(arg0: string, empId: any): unknown;
  beatId: number
  beatName: string
  country: string;
  state: string;
  district: string;
  city: string;
  area: string;
  store: any[];
  salesRep: Number;
  user : {
    role: UserRole
  }
}

export type IBeatRes = IApiResponse<IBeatData>;

export type UpdateBeatReq = {
  beatId: number;
  beatName: string;
  area: string;
  country: string;
  district: string;
  state: string;
  city: string;
  store: any[];
  salesRep: Number;
}

export type UpdateBeatRes = IApiResponse<{
  message: string;
}>
