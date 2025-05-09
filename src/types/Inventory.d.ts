import { IApiResponse } from "./Common";
import { Brand, Category, ISkuDiscount } from "./Product";


interface Product {
    productId: number;
    empId: number;
    productName: string;
    brandId: number;
    categoryId: number;
    category: Category;
    brand: Brand;
    mrp: number;
    rlp: number;
    caseQty: number;
    skuDiscount: ISkuDiscount | null;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IInventory {
    inventoryId: number;
    empId: number;
    storeId: number;
    productId: number;
    noOfCase: number;
    noOfPiece: number;
    createdAt: string;
    updatedAt: string;
    product: Product;
}

export interface IInventoryState extends IInventory {
    noOfCaseT: number;
    noOfPieceT: number;
}

export type IInventoryRes = IApiResponse<IInventory[]>;

export interface UpdateInventoryData {
    inventoryId: number;
    noOfCase: number;
    noOfPiece: number;
}

export interface InventoryReqBody {
    inventory: UpdateInventoryData[];
}

export type IUpdateInventoryRes = IApiResponse<any>;