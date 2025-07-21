import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from './../services/TokenService';

import common from './common';
import { env } from '../env';

const getDeviceId = () =>
  new Promise((resolve) => {
    common.getDeviceId((id:any) => resolve(id.identifier));
  });

const api = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {

  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();
  const deviceId = await getDeviceId();

  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  if (
    config.method !== 'get' &&
    config.headers['Content-Type'] === 'application/json'
  ) {
    if (typeof config.data !== 'object' || config.data === null) {
      config.data = {};
    }

    config.data.refresh_token = refreshToken;
    config.data.device_id = deviceId;
  }

  return config;
});


api.interceptors.response.use(
  async (response) => {
    const data = response.data;

    if (data?.access_token) {
      await setAccessToken(data.access_token);
    }

    if (data?.refresh_token) {
      await setRefreshToken(data.refresh_token);
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default api;