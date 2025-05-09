import { appActionsType } from '../action-type/appActionsType';

interface IAppReducer {
    isLoading: boolean;
}

export interface ISetLoaderAction {
    type: appActionsType.IS_LOADING;
    payload: boolean;
}


type AppReducerAction = ISetLoaderAction

const initialState: IAppReducer = {
    isLoading: false,
};

function AppReducer(
    state = initialState,
    actions: AppReducerAction,
): IAppReducer {
    switch (actions.type) {
        case appActionsType.IS_LOADING:
            return {
                ...state,
                isLoading: actions.payload,
            };
        default:
            return state;
    }
}

export default AppReducer;
