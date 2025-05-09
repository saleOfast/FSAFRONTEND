import { ThunkAction } from "redux-thunk"
import { productActionsType } from "../action-type/productActionsType"
import { RootState } from "../reducer"
import { setLoaderAction } from "./appActions"
import { getProductsBrandService, getProductsCategoryService, getAllProductSchemeListService, getProductsService, getComProductsBrandService } from "services/productService"
import { IOrderItem } from "types/Product"

function getProductsActions(data:any): ThunkAction<void, RootState, unknown, any> {
    return async (dispatch) => {
        try {
            dispatch(setLoaderAction(true))
            const res = await getProductsService(data);
            dispatch(setLoaderAction(false))
            dispatch({
                type: productActionsType.GET_PRODUCT,
                payload: res.data.data
            })
        } catch (error) {
            dispatch(setLoaderAction(false))
        }
    }
}

function getProductCategoryActions(): ThunkAction<void, RootState, unknown, any> {
    return async (dispatch) => {
        try {
            dispatch(setLoaderAction(true))
            const res = await getProductsCategoryService();
            dispatch(setLoaderAction(false))
            dispatch({
                type: productActionsType.GET_PRODUCT_CATEGORY,
                payload: res.data.data
            })
        } catch (error) {
            dispatch(setLoaderAction(false))
        }
    }
}

function getProductBrandActions(): ThunkAction<void, RootState, unknown, any> {
    // function getProductBrandActions(value: number = 0): ThunkAction<void, RootState, unknown, any> {
    return async (dispatch) => {
        try {
            dispatch(setLoaderAction(true))
            const res = await getProductsBrandService();
            dispatch(setLoaderAction(false))
            dispatch({
                type: productActionsType.GET_PRODUCT_BRAND,
                payload: res.data.data
            })
        } catch (error) {
            dispatch(setLoaderAction(false))
        }
    }
}

function getCompetitorProductBrandActions(value: number = 1): ThunkAction<void, RootState, unknown, any> {
    return async (dispatch) => {
        try {
            dispatch(setLoaderAction(true))
            const res = await getComProductsBrandService(value);
            dispatch(setLoaderAction(false))
            dispatch({
                type: productActionsType.GET_COMPETITOR_BRAND,
                payload: res.data.data
            })
        } catch (error) {
            dispatch(setLoaderAction(false))
        }
    }
}

function setOrderItemActions(data: IOrderItem[]) {
    return {
        type: productActionsType.SET_ORDER_ITEM,
        payload: data
    }
}

function getProductSchemeActions(): ThunkAction<void, RootState, unknown, any> {
    return async (dispatch) => {
        try {
            dispatch(setLoaderAction(true))
            const res = await getAllProductSchemeListService();
            dispatch(setLoaderAction(false))
            dispatch({
                type: productActionsType.GET_PRODUCT_SCHEME,
                payload: res.data.data
            })
        } catch (error) {
            dispatch(setLoaderAction(false))
        }
    }
}


export {
    getProductsActions,
    getProductCategoryActions,
    getProductBrandActions,
    setOrderItemActions,
    getProductSchemeActions,
    getCompetitorProductBrandActions
}