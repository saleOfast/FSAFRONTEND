/* eslint-disable @typescript-eslint/no-shadow */
import axios from 'axios';

import { API_ENDPOINTS, BASE_URL, LS_KEYS } from '../app-constants';
import { getItemFromLS, navigateTo, removeItemFromLS, setItemIntoLS } from 'utils/common';

const apiService = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

apiService.interceptors.request.use(
  async config => {

    const accessToken = getItemFromLS(LS_KEYS.accessToken);
    if (accessToken) {
      config.headers.Authorization = accessToken;
      // config.headers.refresh_token = token.refreshToken;        
    }
    // config.headers['Content-Type'] = 'application/json';

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

apiService.interceptors.response.use(
  response => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    // console.log('error status:-', error?.response?.status);
    if (
      error?.response?.status === 400 &&
      originalRequest.url === `${API_ENDPOINTS.tokenRenew}`
    ) {
      removeItemFromLS(LS_KEYS.accessToken)
      navigateTo("/login");
      return Promise.reject(error);
    }
    // new check added
    if (
      error?.response?.status === 401 &&
      error?.response?.message === 'NOT_AUTHORIZED'
    ) {
      removeItemFromLS(LS_KEYS.accessToken)
      navigateTo("/login");
      return Promise.reject(error);
    }

    if (error?.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const data: any = {
        refreshToken: null,
      };

      const refreshToken = getItemFromLS(LS_KEYS.refreshToken);
      if (refreshToken) {
        data.refreshToken = refreshToken;
      }
      return apiService
        .put(`${API_ENDPOINTS.tokenRenew}`, data)
        .then(async res => {
          if (res.status === 200) {
            const { accessToken } = res.data.data;
            setItemIntoLS(LS_KEYS.accessToken, accessToken);
            // setItemIntoLS(LS_KEYS.refreshToken, refreshToken)            

            apiService.defaults.headers.common.Authorization = accessToken;
            apiService.defaults.headers.common.refresh_token = refreshToken;
            return apiService(originalRequest);
          }
        })
        .catch(async () => {
          removeItemFromLS(LS_KEYS.accessToken)
          navigateTo("/login");
        });
    }
    return Promise.reject(error);
  },
);

export { apiService };
