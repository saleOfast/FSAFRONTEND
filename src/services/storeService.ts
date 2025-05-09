import { API_ENDPOINTS } from "app-constants";
import { apiService } from "./apiService";
import {
  StoreBeatRes,
  StoreCategoryRes,
  AddStoreCategoryReq,
  AddStoreCategoryRes,
  CreateBeatReq,
  CreateBeatRes,
  ICreateStoreReq,
  ICreateStoreRes,
  UpdateStoreCategoryReq,
  UpdateStoreCategoryRes,
  IStoreCategoryRes,
  IBeatRes,
  UpdateBeatReq,
  UpdateBeatRes,
  DeleteBeatReq,
  deleteBeatRes,
} from "types/Store";
import { DeleteProductBrandReq, deleteProductBrandRes } from "types/Product";
import { IPagination } from "types/Common";

function getStoreCategoryService() {
  return apiService.get<StoreCategoryRes>(API_ENDPOINTS.getStoreCategory);
}

function addStoreCategoryService(data: AddStoreCategoryReq) {
  return apiService.post<AddStoreCategoryRes>(
    API_ENDPOINTS.addStoreCategory,
    data
  );
}

function updateStoreCategoryService(data: UpdateStoreCategoryReq) {
  return apiService.post<UpdateStoreCategoryRes>(
    API_ENDPOINTS.updateStoreCategory,
    data
  );
}

function deleteStoreCategoryService(storeCategoryId: DeleteProductBrandReq) {
  return apiService.delete<deleteProductBrandRes>(
    `${API_ENDPOINTS.deleteStoreCategory}/${storeCategoryId}`
  );
}

function getStoreCategoryByIdService(categoryId: string) {
  return apiService.get<IStoreCategoryRes>(
    `${API_ENDPOINTS.getStoreCategoryById}/${categoryId}`
  );
}

function getStoreBeatService(data: any) {
  const queryParams: string[] = [];
  let { isVisit } = data;

  if (isVisit) {
    queryParams.push(`isVisit=${isVisit}`);
  }
  let apiPath = API_ENDPOINTS.getStoreBeat;
  if (queryParams.length > 0) {
    apiPath += "?" + queryParams.join("&");
  }
  return apiService.get<StoreBeatRes>(apiPath);
}

function createBeatService(data: CreateBeatReq) {
  return apiService.post<CreateBeatRes>(API_ENDPOINTS.createBeat, data);
}

function deleteBeatService(beatId: DeleteBeatReq) {
  return apiService.delete<deleteBeatRes>(
    `${API_ENDPOINTS.deleteBeat}/${beatId}`
  );
}
function updateBeatService(data: UpdateBeatReq) {
  return apiService.post<UpdateBeatRes>(API_ENDPOINTS.updateBeat, data);
}
function getBeatByIdService(beatId: string) {
  return apiService.get<IBeatRes>(`${API_ENDPOINTS.getBeatById}/${beatId}`);
}

function getStoreService(filterDetails?: any, pagination?: IPagination) {
  const params: any = {};
  if (filterDetails) {
    const { storeSearch, storeType, isUnbilled, duration, storeCat, beatId } =
      filterDetails;
    if (storeSearch) {
      params.storeSearch = storeSearch;
    }
    if (storeType) {
      params.storeType = storeType;
    }
    if (isUnbilled) {
      params.isUnbilled = isUnbilled;
    }
    if (duration) {
      params.duration = duration;
    }
    if (storeCat) {
      params.storeCat = storeCat;
    }
    if (beatId) {
      params.beatId = beatId;
    }
  }
  if (pagination) {
    params.pageNumber = pagination.pageNumber;
    params.pageSize = pagination.pageSize;
  }

  return apiService.get<any>(API_ENDPOINTS.getStore, {
    params,
  });
}

function getStoreByIdService(storeId: string) {
  return apiService.get<any>(
    `${API_ENDPOINTS.getStoreById}?storeId=${storeId}`
  );
}

function getStoreByTypeService(storeType: string) {
  return apiService.get<any>(
    `${API_ENDPOINTS.getStoreByType}?storeType=${storeType}`
  );
}

function getStorePastOrderService(storeId: string) {
  return apiService.get<any>(`${API_ENDPOINTS.getStorePastOrder}/${storeId}`);
}

function createStoreService(data: ICreateStoreReq) {
  return apiService.post<ICreateStoreRes>(API_ENDPOINTS.createStore, data);
}

function updateStoreService(data: any) {
  return apiService.post<any>(API_ENDPOINTS.updateStore, data);
}

function deleteStoreService(storeId: DeleteProductBrandReq) {
  return apiService.delete<deleteProductBrandRes>(
    `${API_ENDPOINTS.deleteStore}/${storeId}`
  );
}

function addStoreCategoryImportService(data: AddStoreCategoryReq) {
  return apiService.post<AddStoreCategoryRes>(
    API_ENDPOINTS.createStoreCategoryImport,
    data
  );
}

function createStoreImportService(data: ICreateStoreReq) {
  return apiService.post<ICreateStoreRes>(
    API_ENDPOINTS.createStoreImport,
    data
  );
}
function getWorkPlaceDataService() {
  return apiService.get<any>(API_ENDPOINTS.getWorkPlaceData);
}

function getActivitydataServices(storeId: any) {
  return apiService.get<any>(
    `${API_ENDPOINTS.getActivityData}?storeId=${storeId}`
  );
}

function postActivityDataServices(data: any) {
  return apiService.post<any>(API_ENDPOINTS.postActivityData, data);
}

function getSessionDataService(storeId: any) {
  return apiService.get<any>(
    `${API_ENDPOINTS.getSessionData}?storeId=${storeId}`
  );
}

function postSessionDataServices(data: any) {
  return apiService.post<any>(API_ENDPOINTS.postSessionData, data);
}

function getFeedbackDataService(storeId: any) {
  return apiService.get<any>(
    `${API_ENDPOINTS.getFeedbackData}?storeId=${storeId}`
  );
}
function postFeedbackDataService(data: any) {
  return apiService.post<any>(API_ENDPOINTS.postFeedbackData, data);
}

function getSampleDataService(storeId: any) { 
  return apiService.get<any>(
    `${API_ENDPOINTS.getSampleData}?storeId=${storeId}`
  );
}
function postSampleDataService(data: any) {
  return apiService.post<any>(API_ENDPOINTS.postSampleData, data);
}
 
function postWorkPlaceDataService(data: any) {
  return apiService.post<any>(API_ENDPOINTS.postOtherWorkPlaceData, data);
}
function getOtherWorkPlaceDataService() {
  return apiService.get<any>(API_ENDPOINTS.getOtherWorkPlaceData);
}
function getOtherWorkPlaceDataByDateService(storeId: any) {
  return apiService.get<any>(
    `${API_ENDPOINTS.getOtherWorkPlaceDataByDate}?storeId=${storeId}`
  );
}
// gift api service for doctor

  function postGiftSampleDataService(data: any) {
    return apiService.post<any>(API_ENDPOINTS.postGiftData, data);
  }
  function getGiftsampleDataService(storeId: any) {
    return apiService.get<any>(
      `${API_ENDPOINTS.getGiftdata}?storeId=${storeId}`
    );
  }
  function getGiftOtherWorkPlaceDataByDateService(storeId: any) {
    return apiService.get<any>(
      `${API_ENDPOINTS.getGiftDataByDate}?storeId=${storeId}`
    );
  }

// gift api service for chemist
function getChemistGiftService(storeId: any) { 
    return apiService.get<any>(
      `${API_ENDPOINTS.getGiftdata}?storeId=${storeId}`
    );
  }
  function postChemistGiftSampleDataService(data: any) {
    return apiService.post<any>(API_ENDPOINTS.postGiftData, data);
  }
  function getChemistGiftDataByDateService(storeId: any) {
    return apiService.get<any>(
      `${API_ENDPOINTS.getGiftDataByDate}?storeId=${storeId}`
    );
  }

  // gift api service for chemist
function getStockiestGiftService(storeId: any) { 
    return apiService.get<any>(
      `${API_ENDPOINTS.getGiftdata}?storeId=${storeId}`
    );
  }
  function postStockiestGiftSampleDataService(data: any) {
    return apiService.post<any>(API_ENDPOINTS.postGiftData, data);
  }
  function getStockiestGiftDataByDateService(storeId: any) {
    return apiService.get<any>(
      `${API_ENDPOINTS.getGiftDataByDate}?storeId=${storeId}`
    );
  }
   


function updateWorkPlaceData(data: any) {
  return apiService.put<any>(API_ENDPOINTS.updateWorkPlaceData, data);
}

function deleteWorkPlaceService(workPlaceId: number) {
  return apiService.delete<any>(
    `${API_ENDPOINTS.deleteWorkPlaceData}/${workPlaceId}`
  );
}
function addRcpaService(data: any) {
  return apiService.post<any>(API_ENDPOINTS.postRcpaData, data);
}
function getRcpaService(storeId: any) {
  return apiService.get<any>(`${API_ENDPOINTS.getRcpaData}?storeId=${storeId}`);
}

// function getRcpaService(storeId:any){
//     return apiService.get<any>(`${API_ENDPOINTS.getSessionData}?storeId=${storeId}`)
// }

export {
  getStoreCategoryService,
  addStoreCategoryService,
  getStoreBeatService,
  createBeatService,
  getStoreService,
  getStoreByIdService,
  getStorePastOrderService,
  createStoreService,
  updateStoreCategoryService,
  deleteStoreCategoryService,
  getStoreCategoryByIdService,
  updateStoreService,
  deleteStoreService,
  deleteBeatService,
  getBeatByIdService,
  updateBeatService,
  addStoreCategoryImportService,
  createStoreImportService,
  getWorkPlaceDataService,
  getActivitydataServices,
  postActivityDataServices,
  getSessionDataService,
  postSessionDataServices,
  getFeedbackDataService,
  postFeedbackDataService,
  getSampleDataService,
  postSampleDataService,
  postWorkPlaceDataService,
  getOtherWorkPlaceDataService,
  getOtherWorkPlaceDataByDateService,
  getStoreByTypeService,
  updateWorkPlaceData,
  deleteWorkPlaceService,
  addRcpaService,
  getRcpaService,
  getGiftOtherWorkPlaceDataByDateService,
  postGiftSampleDataService,
  getGiftsampleDataService,
  postChemistGiftSampleDataService,
  getChemistGiftService,
  getChemistGiftDataByDateService,
  getStockiestGiftService,
  postStockiestGiftSampleDataService,
  getStockiestGiftDataByDateService
 
};
