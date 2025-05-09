import { IApiResponse } from "./Common";

interface MonthWiseStoreCount {
    Nov: Nov;
    Dec: Nov;
}
interface Nov {
    totalStoreCount: number;
    totalOrderCount: number;
}
interface OrderVsCollection {
    ordered: number;
    collected: number;
}
interface CommonTarget {
    target: number;
    achieved: number;
}
interface IDashboardData {
    valueTarget: CommonTarget;
    storeTarget: CommonTarget;
    collectionTarget: CommonTarget;
    orderVsCollection: OrderVsCollection;
    monthWiseStoreCount: MonthWiseStoreCount;
    newStoreCount: number;
    unBilledStoreCount: number;
    billedStoreCount: number;
    todayVisitCount: number;
    focusedProductCount: number;
    schemeCount: number;
    sales: {
        currSales: number,
        preSales: number
    };
    collection: {
        currCollection: number,
        preCollection: number
    };
    orderCount: {
        currOrderCount: number,
        preOrderCount: number
    };
    storeCount: {
        currStoreCount: number,
        preStoreCount: number
    }
}

interface IRetailorDashboardData {
    valueTarget: CommonTarget;
    storeTarget: CommonTarget;
    collectionTarget: CommonTarget;
    orderVsCollection: OrderVsCollection;
    monthWiseStoreCount: MonthWiseStoreCount;
    newStoreCount: number;
    unBilledStoreCount: number;
    billedStoreCount: number;
    todayVisitCount: number;
    focusedProductCount: number;
    sales: {
        currSales: number,
        preSales: number
    };
    collection: {
        currCollection: number,
        preCollection: number
    };
    orderCount: {
        currOrderCount: number,
        preOrderCount: number
    };
    orderCountWithpayment: {
        currOrder: number,
        preorder: number
    };
    orderValueWithPayment: {
        currSales: number,
        preSales: number
    };
    
}

export type IDashboardRes = IApiResponse<IDashboardData>;
export type IRetailorDashboardRes = IApiResponse<IRetailorDashboardData>;


export type UpdateApprovalStoreReq = {
    orderId: number;
    specialDiscountStatus: SpecialDiscountStatus,
    specialDiscountComment: string
}

export type UpdateApprovalStoreRes = IApiResponse<{
    message: string;
}>
interface unBilledStore{

}

interface PendingApprovalStores{
    
}

interface performer{
    
}

interface ITarget {
    allTarget: any;
    targetId: number;
    empId: number;
    firstname: string;
    lastname: string;
    valueTarget: number;
    storeTarget: number;
    totalAmount: number;
    totalCollectedAmount: number
}
interface ITargetData {
    month: Date;
    target: ITarget;
    achievedStores: string;
}

export type GetTargetRes = IApiResponse<ITargetData[]>

export type AddTargetReq = {
    SSMId: number;
    target?:{
        storeTarget: number;
        amountTarget: number;
        collectionTarget: number;
        month: Date;
    } | any
   
    // year: Date;
}

export type AddTargetRes = IApiResponse<{
    message: string;
}>

export type UpdateTargetReq = {
    targetId: number;
    SSMId: number;
    target?:{
        amountTarget: number;
        storeTarget: number;
        month: any;
        collectionTarget: number
    } | any
   
    // year: any;
}

export type UpdateTargetRes = IApiResponse<{
    message: string;
}>


export type DeleteTargetReq = {
    targetId: number;
}

export type DeleteTargetRes = IApiResponse<{
    message: string;
}>

export interface ITargetData {
    targetId: number;
    empId: number;
    amountTarget: number;
    storeTarget:  number;
    collectionTarget: number;
    totalCollectedAmount: number;
    month: any;
    year: any;
    timeline: any;
    allTarget: {
        amountTarget: number;
        storeTarget:  number;
        collectionTarget: number
    }
}

export type ITargetRes = IApiResponse<ITargetData>;
