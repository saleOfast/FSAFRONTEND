import { API_ENDPOINTS } from "app-constants";
import { apiService } from "./apiService";
import { IInventoryRes, InventoryReqBody, IUpdateInventoryRes } from "types/Inventory";

function getInventoryList(storeId: string) {
    return apiService.get<IInventoryRes>(`${API_ENDPOINTS.getInventoryList}/${storeId}`)
}

function updateInventory(data: InventoryReqBody) {
    return apiService.put<IUpdateInventoryRes>(API_ENDPOINTS.updateInventory, data)
}
export {
    getInventoryList,
    updateInventory
}