import {
    TypedUseSelectorHook,
    useSelector as useReduxSelector,
} from 'react-redux';
import { combineReducers } from 'redux';
import { RootActionsType } from '../action-type/rootActionsType';
import AppReducer from './AppReducer';
import ProductReducer from './ProductReducer';
import StoreReducer from './StoreReducer';
import VisitsReducer from './VisitsReducer';
import usersReducer from './usersReducer';
import learningReducer from './LearningReducer/LearningReducer';


const MainReducer = combineReducers({
    app: AppReducer,
    store: StoreReducer,
    visits: VisitsReducer,
    product: ProductReducer,
    users: usersReducer,
    learning: learningReducer,
});

export const RootReducer = (state: any, action: any) => {
    if (action.type === RootActionsType.RESET_STATE) {
        return MainReducer(undefined, action);
    }

    return MainReducer(state, action);
};

export type RootState = ReturnType<typeof MainReducer>;
export const useSelector: TypedUseSelectorHook<ReturnType<typeof MainReducer>> = useReduxSelector;
