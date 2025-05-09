import { IUsersReducer, IUsersReducerAction } from 'types/User';
import { usersActionsType } from 'redux-store/action-type/usersActionsType';

const initialState: IUsersReducer = {
    usersSSM: [],
    usersLearningRole: [],
    userManager: []
};

function usersReducer(
    state = initialState,
    actions: IUsersReducerAction,
): IUsersReducer {
    switch (actions.type) {
        case usersActionsType.GET_SSM_USERS:
            return {
                ...state,
                usersSSM: actions.payload
            };
        case usersActionsType.GET_MANAGER:
            return {
                ...state,
                userManager: actions.payload
            };
        case usersActionsType.GET_USERS_LEARNING_ROLE:
            return {
                ...state,
                usersLearningRole: actions.payload
            };
        default:
            return state;
    }
}

export default usersReducer;
