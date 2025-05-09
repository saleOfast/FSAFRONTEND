import { IStoreReducerAction, IStoreReducer } from 'types/Store';
import { storeActionsType } from '../action-type/storeActionsType';

const initialState: IStoreReducer = {
    storeBeat: [],
    storeCategory: [],
    storeList: [],
    totalStoreRecords: 0,
    storeFilters: null
};

function StoreReducer(
    state = initialState,
    actions: IStoreReducerAction,
): IStoreReducer {
    switch (actions.type) {
        case storeActionsType.SET_STORE_CATEGORY:
            return {
                ...state,
                storeCategory: actions.payload
            };
        case storeActionsType.SET_STORE_BEAT:
            return {
                ...state,
                storeBeat: actions.payload
            };
        case storeActionsType.GET_STORE:
            return {
                ...state,
                storeList: actions.payload.stores,
                totalStoreRecords: actions.payload?.pagination?.totalRecords || 0
            };
        case storeActionsType.LOAD_MORE_STORE:
            return {
                ...state,
                storeList: [
                    ...state.storeList,
                    ...actions.payload.stores
                ]
            }
        case storeActionsType.SET_STORE_FILTERS:
            return {
                ...state,
                storeFilters: actions.payload
            };
        default:
            return state;
    }
}

export default StoreReducer;
