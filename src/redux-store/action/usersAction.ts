
import { ThunkAction } from "redux-thunk";
import { RootState } from "../reducer";
import { setLoaderAction } from "./appActions";
import { usersActionsType } from "redux-store/action-type/usersActionsType";
import { getManagerService, getSSMUsersService, getUsersLearningRoleService } from "services/usersSerivce";


function getUsersActions(): ThunkAction<void, RootState, unknown, any> {
    return async (dispatch) => {
        try {
            dispatch(setLoaderAction(true));
            const res = await getSSMUsersService();
            dispatch(setLoaderAction(false));
            dispatch({
                type: usersActionsType.GET_SSM_USERS,
                payload: res.data.data
            })
        } catch (error) {
            dispatch(setLoaderAction(false));
        }
    }
}

function getManagerActions(): ThunkAction<void, RootState, unknown, any> {
    return async (dispatch) => {
        try {
            dispatch(setLoaderAction(true));
            const res = await getManagerService();
            dispatch(setLoaderAction(false));
            dispatch({
                type: usersActionsType.GET_MANAGER,
                payload: res.data.data
            })
        } catch (error) {
            dispatch(setLoaderAction(false));
        }
    }
}

function getUsersLearningRoleActions(): ThunkAction<void, RootState, unknown, any> {
    return async (dispatch) => {
        try {
            dispatch(setLoaderAction(true));
            const res = await getUsersLearningRoleService();
            dispatch(setLoaderAction(false));
            dispatch({
                type: usersActionsType.GET_USERS_LEARNING_ROLE,
                payload: res.data.data
            })
        } catch (error) {
            dispatch(setLoaderAction(false));
        }
    }
}

export {
    getUsersActions,
    getUsersLearningRoleActions,
    getManagerActions
}