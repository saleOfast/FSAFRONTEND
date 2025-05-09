import { ThunkAction } from "redux-thunk"
import { visitActionsType } from "../action-type/visitsActionsType"
import { RootState } from "../reducer"
import { getVisitsService } from "services/visitsService"
import { setLoaderAction } from "./appActions"
import { IVisitFilter } from "types/Visits"
import { IPagination } from "types/Common"
import { DEFAULT_PAGE_SIZE } from "app-constants"

function getVisitsActions(filters?: IVisitFilter): ThunkAction<void, RootState, unknown, any> {
    return async (dispatch) => {
        try {
            dispatch(setLoaderAction(true))
            const pagination: IPagination = {
                pageNumber: 1,
                pageSize: DEFAULT_PAGE_SIZE
            }
            const res = await getVisitsService(filters, pagination);
            dispatch(setLoaderAction(false))
            dispatch({
                type: visitActionsType.GET_VISITS,
                payload: res.data.data
            })
        } catch (error) {
            dispatch(setLoaderAction(false))
        }
    }
}

function loadMoreVisitsActions(filters?: IVisitFilter): ThunkAction<void, RootState, unknown, any> {
    return async (dispatch, store) => {
        try {
            const { pageNumber, pageSize } = store().visits;
            const newPageNumber = pageNumber + 1;
            const pagination: IPagination = {
                pageNumber: newPageNumber,
                pageSize
            }
            dispatch(setLoaderAction(true))
            const res = await getVisitsService(filters, pagination);
            dispatch(setLoaderAction(false))
            dispatch({
                type: visitActionsType.VISIT_LOAD_MORE,
                payload: res.data.data
            })
            dispatch({
                type: visitActionsType.SET_VISIT_PAGE_NUMBER,
                payload: newPageNumber
            })
        } catch (error) {
            dispatch(setLoaderAction(false))
        }
    }
}

export {
    getVisitsActions,
    loadMoreVisitsActions
}