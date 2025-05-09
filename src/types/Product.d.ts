import { DiscountTypeEnum } from "enum/product";
import { IApiResponse } from "./Common";
import { productActionsType } from "redux-store/action-type/productActionsType";
import { DiscountType } from "enum/common";

export interface Brand {
    brandId: number;
    empId: number;
    name: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export type AddProductBrandReq = {
    name: string;
    isCompetitor:number
     

}

export type AddProductBrandRes = IApiResponse<{
    message: string;
}>

export type UpdateProductBrandReq = {
    brandId: number;
    name: string,
    isCompetitor: number,
}

export type UpdateProductBrandRes = IApiResponse<{
    message: string;
}>


export type DeleteProductBrandReq = {
    brandId: number;
}

export type deleteProductBrandRes = IApiResponse<{
    message: string;
}>

export interface IProductBrandData {
    brandId: number
    name: string
}

export type IProductBrandRes = IApiResponse<IProductBrandData>;

export interface ProductCategory {
    productCategoryId: number;
    empId: number;
    name: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export type AddProductCategoryReq = {
    name: string;
    parentId?: any
}

export type AddProductCategoryRes = IApiResponse<{
    message: string;
}>

export type UpdateProductCategoryReq = {
    catId: number;
    name: string;
    parentId: number;
}

export type UpdateProductCategoryRes = IApiResponse<{
    message: string;
}>


export type DeleteProductCategoryReq = {
    productCategoryId: number;
}

export type DeleteProductCategoryRes = IApiResponse<{
    message: string;
}>

export interface IProductCategoryData {
    brandId: number
    parentId: number
    name: string
    parent: {
        name: string
    }
}

export type IProductCategoryRes = IApiResponse<IProductCategoryData>;
interface Category {
    productCategoryId: number
    empId: number
    name: string
    isActive: boolean
    isDeleted: boolean
    createdAt: string
    updatedAt: string
}

export interface ISkuDiscount {
    discountType: DiscountTypeEnum;
    value: number
    isActive: boolean
}

export interface IProductData {
    productId: number
    empId: number
    productName: string
    brandId: number
    categoryId: number
    mrp: number
    rlp: number
    caseQty: number
    skuDiscount: ISkuDiscount | null
    isFocused: boolean
    isActive: boolean
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    brand: Brand
    category: Category
}

export interface ICompetitorProductData {
    productId: number
    empId: number
    productName: string
    brandId: number
    categoryId: number
    mrp: number
    rlp: number
    caseQty: number
    skuDiscount: ISkuDiscount | null
    isFocused: boolean
    isActive: boolean
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    brand: Brand
    category: Category
}
export type DeleteProductReq = {
    productId: number;
}

export type deleteProductRes = IApiResponse<{
    message: string;
}>


export interface IOrderItem extends IProductData {
    noOfCase: number;
    noOfPiece: number;
    totalAmount: number;
    netAmount: number;
    skuDiscountAmount: number;
    image?: string;
}

export type IProductRes = IApiResponse<IProductData[]>;

interface ISkuDiscount {
    discountType: DiscountType,
    value: number,
    isActive: boolean
}

export type AddProductReq = {
    productName: string;
    image: string;
    mrp: number;
    rlp: number;
    caseQty: number;
    categoryId: number;
    brandId: number;
    skuDiscount: ISkuDiscount;
    isFocused: boolean;
    isActive: boolean;
}

export type AddProductRes = IApiResponse<{
    message: string;
}>

export type UpdateProductReq = {
    productId: number;
    productName: string;
    mrp: number;
    rlp: number;
    caseQty: number;
    categoryId: number;
    brandId: number;
    isActive: boolean;
    isFocused: boolean;
    brand?: {
        name: string
    };
    category?: {
        name: string
    };
    skuDiscount: {
        discountType: DiscountType,
        value: number,
        isActive: boolean
    },
    image: string
}
export type IProductByIdRes = IApiResponse<UpdateProductReq>

export type UpdateProductRes = IApiResponse<{
    message: string;
}>
export interface ICheckoutItem {
    brandId: number
    categoryId: number
    isFocused: boolean
    mrp: number
    noOfCase: number;
    noOfPiece: number;
    productId: number
    productName: string
    rlp: number
    caseQty: number
    skuDiscount?: ISkuDiscount;
    totalAmount: number;
    netAmount: number;
    skuDiscountAmount: number;
    pieceDiscount?: number | null;
}

export interface IProductCategoryData {
    productCategoryId: number;
    empId: number;
    name: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

interface IBrandData {
    brandId: number;
    empId: number;
    name: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}
interface ICompetitorBrandData {
    brandId: number;
    empId: number;
    name: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}


export interface IAllProductSchemeData {
    id: number;
    empId: number;
    name: string;
    month: number;
    year: number;
    file: string;
    isEnable: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export type GetAllProductSchemeRes = IApiResponse<AllProductSchemeData[]>
export interface IProductReducer {
    productList: IProductData[];
    category: IProductCategoryData[];
    brand: IBrandData[];
    orderItem: IOrderItem[];
    SchemeList: IAllProductSchemeData[];
    competitorBrand:ICompetitorProductData[];
}
export type UpdateSchemeReq = {
    id: number;
    isEnable: bool
}
export type GetProductCategoryRes = IApiResponse<IProductCategoryData[]>

export type GetProductBrandRes = IApiResponse<IBrandData[]>

export interface ISetProductAction {
    type: productActionsType.GET_PRODUCT;
    payload: IProductData[];
}

export interface ISetProductCategoryAction {
    type: productActionsType.GET_PRODUCT_CATEGORY;
    payload: IProductCategoryData[];
}

export interface ISetProductBrandAction {
    type: productActionsType.GET_PRODUCT_BRAND;
    payload: IBrandData[];
}

export interface ISetOrderItemAction {
    type: productActionsType.SET_ORDER_ITEM;
    payload: IOrderItem[];
}

export interface ISetAllProductSchemeAction {
    type: productActionsType.GET_PRODUCT_SCHEME;
    payload: IAllProductSchemeData[];
}

export interface ISetCompetitorBrandAction {
    type: productActionsType.GET_COMPETITOR_BRAND;
    payload: ICompetitorProductData[];
}

export type IProductActions = ISetProductAction | ISetProductCategoryAction | ISetProductBrandAction | ISetOrderItemAction | ISetAllProductSchemeAction |ISetCompetitorBrandAction;

interface ICreateOrderProduct {
    categoryId: number;
    brandId: number;
    productId: number;
    productName: string;
    mrp: number;
    rlp: number;
    noOfCase: number;
    noOfPiece: number;
}

// Colour


export interface Colour {
    colourId: number;
    empId: number;
    name: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export type AddColourReq = {
    name: string;
  }
  
  export type AddColourRes = IApiResponse<{
    message: string;
  }>
  
  export type UpdateColourReq = {
    colourId: number;
    name: string
  }
  
  export type UpdateColourRes = IApiResponse<{
    message: string;
  }>
  
  
  export type DeleteColourReq = {
    colourId: number;
  }
  
  export type deleteColourRes = IApiResponse<{
    message: string;
  }>
  
  export interface IColourData {
    colourId: number
    name: string
  }
  
  export type IColourRes = IApiResponse<IColourData>;

//   Size

export interface Size {
    sizeId: number;
    empId: number;
    name: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export type AddSizeReq = {
    name: string;
  }
  
  export type AddSizeRes = IApiResponse<{
    message: string;
  }>
  
  export type UpdateSizeReq = {
    sizeId: number;
    name: string
  }
  
  export type UpdateSizeRes = IApiResponse<{
    message: string;
  }>
  
  
  export type DeleteSizeReq = {
    sizeId: number;
  }
  
  export type deleteSizeRes = IApiResponse<{
    message: string;
  }>
  
  export interface ISizeData {
    sizeId: number
    name: string
  }
  
  export type ISizeRes = IApiResponse<ISizeData>;