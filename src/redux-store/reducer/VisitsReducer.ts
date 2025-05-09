import { IVisitsActions, IVisitsReducer } from 'types/Visits';
import { visitActionsType } from '../action-type/visitsActionsType';
import { DEFAULT_PAGE_SIZE } from 'app-constants';

const initialState: IVisitsReducer = {
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    data: [],
    isLoading: false,
    totalRecords: 0,
    completedVisitCount: 0
};

function VisitsReducer(
    state = initialState,
    actions: IVisitsActions,
): IVisitsReducer {
    switch (actions.type) {
        case visitActionsType.GET_VISITS:
            return {
                ...state,
                data: actions.payload.visitList,
                pageNumber: 1,
                totalRecords: actions.payload?.pagination?.totalRecords || 0,
                completedVisitCount: actions.payload.pagination?.completedVisitCount || 0
            };
        case visitActionsType.IS_VISITS_LOADING:
            return {
                ...state,
                isLoading: actions.payload
            }
        case visitActionsType.VISIT_LOAD_MORE:
            return {
                ...state,
                data: [
                    ...state.data,
                    ...actions.payload.visitList
                ]
            }
        case visitActionsType.SET_VISIT_PAGE_NUMBER:
            return {
                ...state,
                pageNumber: actions.payload
            }
        default:
            return state;
    }
}

export default VisitsReducer;
