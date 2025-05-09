import { ThunkAction } from "redux-thunk"
import { RootState } from "../../reducer"
import { setLoaderAction } from "./../appActions"
import { getCourseService, getQuizService } from "services/learningModule/courseService"
import { learningActionsType } from "redux-store/action-type/learningActionType/learningActionsType"


function getCourseActions(): ThunkAction<void, RootState, unknown, any> {
    return async (dispatch) => {
        try {
            dispatch(setLoaderAction(true))
            const res = await getCourseService();
            dispatch(setLoaderAction(false))
            dispatch({
                type: learningActionsType.GET_COURSE,
                payload: res.data.data
            })
        } catch (error) {
            dispatch(setLoaderAction(false))
        }
    }
}

function getQuizActions(): ThunkAction<void, RootState, unknown, any> {
    return async (dispatch) => {
        try {
            dispatch(setLoaderAction(true))
            const res = await getQuizService();
            dispatch(setLoaderAction(false))
            dispatch({
                type: learningActionsType.GET_QUIZ,
                payload: res.data.data
            })
        } catch (error) {
            dispatch(setLoaderAction(false))
        }
    }
}




export {
    getCourseActions,
    getQuizActions
}