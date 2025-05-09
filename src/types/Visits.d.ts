import { visitActionsType } from "redux-store/action-type/visitsActionsType";
import { IApiResponse } from "./Common";
import { IStoreData } from "./Store";
import { VisitStatus } from "enum/visits";

interface StoreDetails {
    storeId: number;
    empId: number;
    storeName: string;
    storeType: string;
    lat: string;
    long: string;
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
    isVisibility: boolean;
    isBilled: boolean;
    isNewStore: boolean;
    isActive: boolean;
    beat: string;
    createdAt: string;
    updatedAt: string;
}

interface BeatDetails {
    beatId: number;
    beatName: string;
}


export interface IVisitsData {
    visitId: number;
    empId: number;
    checkIn: string;
    checkOut: string;
    visitDate: string;
    visitStatus: string;
    beatDetails: BeatDetails;
    storeDetails: IStoreData;
    visitStatus: VisitStatus;
    image?: string;
    noOrderReason?: string;
}

export interface IVisitsReducer {
    data: IVisitsData[];
    isLoading: boolean;
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    completedVisitCount: number;
}
type IVisitList = {
    visitList: IVisitsData[];
    pagination: {
        pageNumber: number;
        pageSize: number;
        totalRecords: number;
        completedVisitCount: number;
    }
}
export type IVisitsRes = IApiResponse<IVisitList[]>;

export interface ISetVisitsAction {
    type: visitActionsType.GET_VISITS;
    payload: IVisitList;
}

export interface IVisitsIsLoading {
    type: visitActionsType.IS_VISITS_LOADING;
    payload: boolean;
}

export interface IVisitLoadMore {
    type: visitActionsType.VISIT_LOAD_MORE;
    payload: IVisitList;
}

export interface ISetVisitPageNumber {
    type: visitActionsType.SET_VISIT_PAGE_NUMBER;
    payload: number;
}

export type IVisitsActions = ISetVisitsAction | IVisitsIsLoading | IVisitLoadMore | ISetVisitPageNumber;

export type IVisitsDetailRes = IApiResponse<IVisitsData>;


export interface IVisitCheckInReq {
    visitId: number;
    checkIn: string;
    checkInLat?: string | undefined;
    checkInLong?: string | undefined;
    action: string
}

export type IVisitCheckInRes = IApiResponse<null>;

export type IVisitParams = {
    storeId: string;
    visitId: string;
}

export type IOrderCheckoutParams = {
    storeId: string;
    visitId: string;
    orderId: string;
}

export interface IVisitCheckOutReq {
    visitId: number;
    checkOut: string;
    checkOutLat: string | undefined;
    checkOutLong: string | undefined;
    image: string | null | undefined;
}

export type IVisitCheckOutRes = IApiResponse<null>;

export type IUpdateVisitPicture = {
    visitId: number;
    image: string;
}

export type IUpdateVisitPictureRes = IApiResponse<null>;

export type IVisitFilter = {
    duration: string
    beat: string;
    status: any;
}

export type CreateVisitsReq = {
    beat: any; 
    visitDate: any;
    store: any;
    storeId: any;
    emp_id: any;
  }
  
  export type CreateVisitsRes = IApiResponse<{
    message: string;
  }>

  export interface IVisitNoOrderReasonReq {
    noOrderReason: string;
    visitId: number;
  }
