import { API_ENDPOINTS } from "app-constants";
import { apiService } from "./apiService";

function storeDetails() {
    return apiService.get(
        API_ENDPOINTS.storeDetails
    );
}

export {
    storeDetails
}