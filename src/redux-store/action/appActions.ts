import { appActionsType } from '../action-type/appActionsType';

function setLoaderAction(status: boolean) {
  return {
    type: appActionsType.IS_LOADING,
    payload: status,
  };
}

export { setLoaderAction };
