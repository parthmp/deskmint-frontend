import axios from 'axios';
import {
	getAccessToken,
	getRefreshToken,
	setAccessToken,
	setRefreshToken,
	removeAccessToken,
	removeRefreshToken,
	getCompanyId
} from './../services/TokenService';

import router from '../../routes';
import common from './common';
import { env } from '../env';
import { toastEvents } from '../events/toastEvents';

const getDeviceId = () =>
	new Promise((resolve) => {
	common.getDeviceId((id:any) => resolve(id.identifier));
});

const api = axios.create({
	baseURL: env.API_URL,
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	},
});

api.interceptors.request.use(async (config) => {

	const accessToken = await getAccessToken();
	const refreshToken = await getRefreshToken();
	const deviceId = await getDeviceId();
	const companyId = await getCompanyId();

	if (accessToken) {
		config.headers['Authorization'] = `Bearer ${accessToken}`;
	}

	if(refreshToken){
		config.headers['X-Refresh-Token'] = refreshToken;
	}

	if(deviceId){
		config.headers['X-Device-Id'] = deviceId;
	}

	if (config.method === 'get') {
		
		if (!config.params) {
			config.params = {};
		}

		if (common.isset(companyId) && companyId !== '') {
			config.params.company_id = companyId;
		}

	}else{

		if(typeof config.data !== 'object' || config.data === null){
			config.data = {};
		}

		if(common.isset(companyId)){
			if(companyId !== ''){
				config.data.company_id = companyId;
			}
		}
		
	}

	return config;

});


api.interceptors.response.use(
	async (response) => {

		const data = response.data;

		if(data?.access_token){
			await setAccessToken(data.access_token);
		}

		if(data?.refresh_token){
			await setRefreshToken(data.refresh_token);
		}
		if(common.isset(response.data.message)){

			if(response.data.message !== ''){

				toastEvents.emit('toast', {
					type:'success',
					message: response.data.message
				});

			}

		}

		return response;
		
	},
	(error) => {

		let error_message = 'Unknown error';

		if(error.response){
			
			let status = error.response.status;
			
			if(status === 401){
				removeAccessToken();
				removeRefreshToken();
				router.push('/');
			}
			
			if(status !== 500){
				error_message = error.response.data.message;
			}

		}else{

			error_message = 'Unable to connect to the server';

		}

		toastEvents.emit('toast', {
			type:'error',
			message: error_message
		});

		return Promise.reject(error);
		
	}
);


export default api;