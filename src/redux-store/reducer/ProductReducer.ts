import { IProductActions, IProductReducer } from "types/Product";
import { productActionsType } from "../action-type/productActionsType";

const initialState: IProductReducer = {
  productList: [],
  brand: [],
  category: [],
  orderItem: [],
  SchemeList: [],
  competitorBrand: [],
};

function ProductReducer(
  state = initialState,
  actions: IProductActions
): IProductReducer {
  switch (actions.type) {
    case productActionsType.GET_PRODUCT:
      return {
        ...state,
        productList: actions.payload,
      };
    case productActionsType.GET_PRODUCT_CATEGORY:
      return {
        ...state,
        category: actions.payload,
      };
    case productActionsType.GET_PRODUCT_BRAND:
      return {
        ...state,
        brand: actions.payload,
      };
    case productActionsType.SET_ORDER_ITEM:
      return {
        ...state,
        orderItem: actions.payload,
      };
    case productActionsType.GET_PRODUCT_SCHEME:
      return {
        ...state,
        SchemeList: actions.payload,
      };

      case productActionsType.GET_COMPETITOR_BRAND:
        return {
          ...state,
          competitorBrand:actions.payload,
        };
    default:
      return state;
  }
}

export default ProductReducer;
