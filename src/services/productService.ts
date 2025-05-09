import { AddColourReq, AddColourRes, AddProductBrandReq, AddProductBrandRes, AddProductCategoryReq, AddProductCategoryRes, AddProductReq, AddProductRes, AddSizeReq, AddSizeRes, DeleteColourReq, deleteColourRes, DeleteProductBrandReq, deleteProductBrandRes, DeleteProductCategoryReq, DeleteProductCategoryRes, DeleteProductReq, deleteProductRes, DeleteSizeReq, deleteSizeRes, GetAllProductSchemeRes, GetProductBrandRes, GetProductCategoryRes, IProductBrandRes, IProductByIdRes, IProductCategoryRes, IProductRes, UpdateColourReq, UpdateColourRes, UpdateProductBrandReq, UpdateProductBrandRes, UpdateProductCategoryReq, UpdateProductCategoryRes, UpdateProductReq, UpdateProductRes, UpdateSchemeReq, UpdateSizeReq, UpdateSizeRes } from "types/Product";
import { apiService } from "./apiService";
import { API_ENDPOINTS } from "app-constants";

function addProductService(data: AddProductReq) {
    return apiService.post<AddProductRes>(
        API_ENDPOINTS.addProduct,
        data
    );
}

function updateProductService(data: UpdateProductReq) {
    return apiService.post<UpdateProductRes>(
        API_ENDPOINTS.updateProduct,
        data
    );
}

// function getProductsService(filterDetails?: any) {
//     let apiPath = API_ENDPOINTS.getProduct;
//     if (filterDetails) {
//         const { isFocused, isActive, brand, category } = filterDetails;
//          console.log({filterDetails})
//         if (isFocused) {
//             apiPath += '?isFocused=' + isFocused;
//         }if(isActive){
//             apiPath += '?isActive=' + isActive;
//         } if (brand) {
//             apiPath += '?brand=' + brand;
//         }if(category){
//             apiPath += '&category=' + category;
//         }
//     }
//     return apiService.get<IProductRes>(apiPath);
// }
function getProductsService(filterDetails?: any) {
    let apiPath = API_ENDPOINTS.getProduct;

    if (filterDetails) {
        const { isFocused, isActive, brand, category } = filterDetails;
        console.log({ filterDetails });

        // Initialize an array to store the query parameters
        const queryParams = [];

        // Add parameters to the array based on their existence
        if (isFocused) {
            queryParams.push(`isFocused=${isFocused}`);
        }
        if (isActive) {
            queryParams.push(`isActive=${isActive}`);
        }
        if (brand) {
            queryParams.push(`brand=${brand}`);
        }
        if (category) {
            queryParams.push(`category=${category}`);
        }

        // Join the parameters with '&' and append them to the apiPath
        if (queryParams.length > 0) {
            apiPath += '?' + queryParams.join('&');
        }
    }

    return apiService.get<IProductRes>(apiPath);
}


function deleteProductService(productId: DeleteProductReq) {
    return apiService.delete<deleteProductRes>(
        `${API_ENDPOINTS.deleteProduct}/${productId}`
    );
}

function addProductCategoryService(data: AddProductCategoryReq) {
    return apiService.post<AddProductCategoryRes>(
        API_ENDPOINTS.addProductCategory,
        data
    );
}

function updateProductCategoryService(data: UpdateProductCategoryReq) {
    return apiService.put<UpdateProductCategoryRes>(
        API_ENDPOINTS.updateProductCategory,
        data
    );
}

function deleteProductCategoryService(productCategoryId: DeleteProductCategoryReq) {
    return apiService.delete<DeleteProductCategoryRes>(
        `${API_ENDPOINTS.deleteProductCategory}/${productCategoryId}`
    );
}

function getProductCategoryByIdService(productCategoryId: string) {
    return apiService.get<IProductCategoryRes>(`${API_ENDPOINTS.getProductCategoryById}/${productCategoryId}`)
}


function getProductsCategoryService() {
    return apiService.get<GetProductCategoryRes>(API_ENDPOINTS.getProductCategory);
}

// function getProductsBrandService(value: number) {
//     return apiService.get<GetProductBrandRes>(`${API_ENDPOINTS.getProductBrand}?isCompetitor=${value}`);
// }
function getProductsBrandService() {
    return apiService.get<GetProductBrandRes>(API_ENDPOINTS.getProductBrand);
}
function getComProductsBrandService(value: number) {
    return apiService.get<GetProductBrandRes>(`${API_ENDPOINTS.getProductBrand}?isCompetitor=${value}`);
}


function addProductBrandService(data: AddProductBrandReq) {
    return apiService.post<AddProductBrandRes>(
        API_ENDPOINTS.addProductBrand,
        data // ✅ Dynamically setting `isCompetitor`
    );
}

function updateProductBrandService(data: UpdateProductBrandReq) {
    return apiService.post<UpdateProductBrandRes>(
        API_ENDPOINTS.updateProductBrand,
        data
    );
}

function deleteProductBrandService(brandId: DeleteProductBrandReq, isCompetitor: number) {
    return apiService.delete<deleteProductBrandRes>(
        `${API_ENDPOINTS.deleteProductBrand}/${brandId}?isCompetitor=${isCompetitor}`
    );
}

function getProductBrandByIdService(brandId: string, isCompetitor: string) {
    return apiService.get<IProductBrandRes>(`${API_ENDPOINTS.getProductBrandById}/${brandId}?isCompetitor=${isCompetitor}`)
}

function getProductByIdService(productId: string) {
    return apiService.get<IProductByIdRes>(`${API_ENDPOINTS.getProductById}/${productId}`)
}

function getActiveSchemeService() {
    return apiService.get<any>(
        API_ENDPOINTS.getActiveScheme
    );
}

function getAllProductSchemeListService() {
    return apiService.get<GetAllProductSchemeRes>(API_ENDPOINTS.getAllProductSchemeList);
}

function createProductSchemeService(data: any) {
    return apiService.post<any>(
        API_ENDPOINTS.createProductScheme,
        data
    );
}

function updateSchemeService(data: UpdateSchemeReq) {
    return apiService.post<UpdateProductBrandRes>(
        API_ENDPOINTS.updateScheme,
        data
    );
}

// Product Colour


function getColourService() {
    return apiService.get<any>(API_ENDPOINTS.getColour);
}

function addColourService(data: AddColourReq) {
    return apiService.post<AddColourRes>(
        API_ENDPOINTS.addColour,
        data
    );
}

function updateColourService(data: UpdateColourReq) {
    return apiService.post<UpdateColourRes>(
        API_ENDPOINTS.updateColour,
        data
    );
}

function deleteColourService(colourId: DeleteColourReq) {
    return apiService.delete<deleteColourRes>(
        `${API_ENDPOINTS.deleteColour}/${colourId}`
    );
}

function getColourByIdService(colourId: string) {
    return apiService.get<any>(`${API_ENDPOINTS.getColourById}/${colourId}`)
}

// Product size


function getSizeService() {
    return apiService.get<any>(API_ENDPOINTS.getSize);
}

function addSizeService(data: AddSizeReq) {
    return apiService.post<AddSizeRes>(
        API_ENDPOINTS.addSize,
        data
    );
}

function updateSizeService(data: UpdateSizeReq) {
    return apiService.post<UpdateSizeRes>(
        API_ENDPOINTS.updateSize,
        data
    );
}

function deleteSizeService(sizeId: DeleteSizeReq) {
    return apiService.delete<deleteSizeRes>(
        `${API_ENDPOINTS.deleteSize}/${sizeId}`
    );
}

function getSizeByIdService(sizeId: string) {
    return apiService.get<any>(`${API_ENDPOINTS.getSizeById}/${sizeId}`)
}

function CreateProductRequestService(data: any) {
    return apiService.post<any>(
        API_ENDPOINTS.createProductRequest,
        data
    );
}

function addImportBrandService(data: AddProductCategoryReq) {
    return apiService.post<AddProductCategoryRes>(
        API_ENDPOINTS.addImportBrandCategory,
        data
    );
}
function addImportProductCategoryService(data: AddProductCategoryReq) {
    return apiService.post<AddProductCategoryRes>(
        API_ENDPOINTS.addImportProductCategory,
        data
    );
}

function addImportColourService(data: AddColourReq) {
    return apiService.post<AddColourRes>(
        API_ENDPOINTS.addImportColour,
        data
    );
}

function addImportSizeService(data: AddSizeReq) {
    return apiService.post<AddSizeRes>(
        API_ENDPOINTS.addImportSize,
        data
    );
}
export {
    getProductsService,
    addProductService,
    updateProductService,
    getProductsCategoryService,
    addProductCategoryService,
    updateProductCategoryService,
    getProductCategoryByIdService,
    deleteProductCategoryService,
    getProductsBrandService,
    addProductBrandService,
    updateProductBrandService,
    getProductBrandByIdService,
    deleteProductBrandService,
    getAllProductSchemeListService,
    getActiveSchemeService,
    createProductSchemeService,
    getProductByIdService,
    deleteProductService,
    getColourService,
    addColourService,
    updateColourService,
    deleteColourService,
    getColourByIdService,
    getSizeService,
    addSizeService,
    updateSizeService,
    deleteSizeService,
    getSizeByIdService,
    updateSchemeService,
    CreateProductRequestService,
    addImportBrandService,
    addImportProductCategoryService,
    addImportColourService,
    addImportSizeService,
    getComProductsBrandService
}