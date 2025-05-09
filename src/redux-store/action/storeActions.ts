import { ThunkAction } from "redux-thunk";
import { storeActionsType } from "../action-type/storeActionsType";
import { RootState } from "../reducer";
import { getStoreBeatService, getStoreCategoryService, getStoreService } from "../../services/storeService";
import { setLoaderAction } from "./appActions";
import { IPagination } from "types/Common";

function setStoreCategoryAction(): ThunkAction<void, RootState, unknown, any> {
    return async (dispatch) => {
        try {
            dispatch(setLoaderAction(true));
            const res = await getStoreCategoryService();
            dispatch(setLoaderAction(false));
            dispatch({
                type: storeActionsType.SET_STORE_CATEGORY,
                payload: res.data.data,
            })
        } catch (error) {
            dispatch(setLoaderAction(false));
        }
    }
}

function setStoreBeatAction(): ThunkAction<void, RootState, unknown, any> {
    return async (dispatch) => {
        try {
            dispatch(setLoaderAction(true));
            const res = await getStoreBeatService({});
            dispatch(setLoaderAction(false));
            dispatch({
                type: storeActionsType.SET_STORE_BEAT,
                payload: res.data.data,
            })
        } catch (error) {
            dispatch(setLoaderAction(false));
        }
    }
}

function getStoreActions(filterDetails?: any, pagination?: IPagination): ThunkAction<void, RootState, unknown, any> {
    return async (dispatch) => {
        try {
            dispatch(setLoaderAction(true));
            const res = await getStoreService(filterDetails, pagination);
            dispatch(setLoaderAction(false));
            dispatch({
                type: storeActionsType.GET_STORE,
                payload: res.data.data
            })
        } catch (error) {
            dispatch(setLoaderAction(false));
        }
    }
}

function loadMoreStoreActions(filterDetails?: any, pagination?: IPagination): ThunkAction<void, RootState, unknown, any> {
    return async (dispatch) => {
        try {
            dispatch(setLoaderAction(true));
            const res = await getStoreService(filterDetails, pagination);
            dispatch(setLoaderAction(false));
            dispatch({
                type: storeActionsType.LOAD_MORE_STORE,
                payload: res.data.data
            })
        } catch (error) {
            dispatch(setLoaderAction(false));
        }
    }
}

function setStoreFiltersActions(filters: any): ThunkAction<void, RootState, unknown, any> {
    return async (dispatch) => {
        dispatch({
            type: storeActionsType.SET_STORE_FILTERS,
            payload: filters
        })
    }
}

export {
    setStoreCategoryAction,
    setStoreBeatAction,
    getStoreActions,
    setStoreFiltersActions,
    loadMoreStoreActions
}