import { learningActionsType } from 'redux-store/action-type/learningActionType/learningActionsType';
import { ICourseReducer, ICourseReducerAction } from 'types/learningModule/Course';

const initialState: ICourseReducer = {
    course: [],
    quiz: []
};

function learningReducer(
    state = initialState,
    actions: ICourseReducerAction,
): ICourseReducer {
    switch (actions.type) {
        case learningActionsType.GET_COURSE:
            return {
                ...state,
                course: actions.payload
            };
        case learningActionsType.GET_QUIZ:
            return {
                ...state,
                quiz: actions.payload
                };    
        default:
            return state;
    }
}

export default learningReducer;
