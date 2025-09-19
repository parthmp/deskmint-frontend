import common from './common';
import { getAccessToken, getRefreshToken } from '../services/TokenService';

export default{

	async isLoggedIn(){

		const access_token = await getAccessToken();
		const refresh_token = await getRefreshToken();

		if(common.isset(access_token) && access_token !== '' && common.isset(refresh_token) && refresh_token !== ''){
			return true;
		}

		return false;

	}

}