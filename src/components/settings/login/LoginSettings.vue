<template>
	<section class="main-content">
		<div class="card">
			<h1 class="text-2xl!">Login Settings</h1>
			&nbsp;
			<login-settings-skeleton v-show="data.loading"></login-settings-skeleton>
			<form v-show="!data.loading" @submit.prevent="handleSubmit">
				<login-settings-block @data="handleData" type="global" @loading="handleLoading"></login-settings-block>
				<div class="mt-[25px]">
					<input-button :disabled="data.btn_disabled" btn_text="Save" icon="IconCheck" class="lg:float-end"></input-button>
					<div class="clear-both"></div>
				</div>
			</form>
			
		</div>
	</section>
</template>
<script lang="ts" setup>

import { reactive } from 'vue';
import InputButton from '../../inputs/InputButton.vue';
import LoginSettingsBlock from './LoginSettingsBlock.vue';
import api from '../../../helpers/api.ts';
import type { LoginSettings } from '../../../types/LoginSettings.ts';
import LoginSettingsSkeleton from '../../skeletons/LoginSettingsSkeleton.vue';

const data = reactive<LoginSettings>({
	login_limits_flag : false,
	two_factor_auth_flag : false,
	login_email_flag : false,
	login_limits_attempts : 1,
	login_limits_minutes : 1,
	btn_disabled : false,
	loading: false
});

const handleSubmit = async () : Promise<void> => {
	
	data.btn_disabled = true;

	try{
		await api.patch('manage-login-settings', {
			...data, type:'global'
		});
	}finally{
		data.btn_disabled = false;
	}

}

const handleData = (data_obj:LoginSettings) => {
	data.login_limits_flag = data_obj.login_limits_flag;
	data.two_factor_auth_flag = data_obj.two_factor_auth_flag;
	data.login_email_flag = data_obj.login_email_flag;
	data.login_limits_attempts = data_obj.login_limits_attempts;
	data.login_limits_minutes = data_obj.login_limits_minutes;
}

const handleLoading = (loading:boolean) => {
	data.loading = loading;
}

</script>