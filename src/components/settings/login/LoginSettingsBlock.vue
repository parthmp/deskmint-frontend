<template>
	<div class="mt-[20px]">
		<div class="flex gap-2">
			<span><input-switch v-model="data.login_limits_flag"></input-switch></span>
			<span @click="data.login_limits_flag = !data.login_limits_flag">&nbsp;Login limits/attempts on/off</span>
		</div>
	</div>
	<div class="mt-[20px]">
		<div class="flex gap-2">
			<span><input-switch v-model="data.two_factor_auth_flag"></input-switch></span>
			<span @click="data.two_factor_auth_flag = !data.two_factor_auth_flag">&nbsp;Two factor auth on/off</span>
		</div>
	</div>
	<div class="mt-[20px]">
		<div class="flex gap-2">
			<span><input-switch v-model="data.login_email_flag"></input-switch></span>
			<span @click="data.login_email_flag = !data.login_email_flag">&nbsp;Send email on login on/off</span>
		</div>
	</div>
	<div class="lg:grid lg:grid-cols-12 lg:gap-5 mt-[25px]">
		<div class="lg:col-span-6">
			<input-number label="Allowed login attempts" v-model="data.login_limits_attempts" placeholder="Enter number of attempts" step="1" min="1"></input-number>
		</div>
		<div class="lg:col-span-6">
			<input-number label="Lock minutes if failed attempts exceeded" v-model="data.login_limits_minutes" placeholder="Enter number of minutes" step="1" min="1"></input-number>
		</div>
	</div>
</template>
<script lang="ts" setup>

import { onMounted, reactive, watch } from 'vue';
import InputNumber from '../../inputs/InputNumber.vue';
import InputSwitch from '../../inputs/InputSwitch.vue';
import api from '../../../helpers/api.ts';

const emit = defineEmits(['loading', 'data']);
const props = defineProps(['type']);

const data = reactive({
	login_limits_flag : false,
	two_factor_auth_flag : false,
	login_email_flag : false,
	login_limits_attempts : 1,
	login_limits_minutes : 1,
	btn_disabled : false,
	loading: false,
	local_type: 'global'
});

watch(props.type, () => {
	setType();
});

watch(data, () => {
	emit('data', data);
}, {deep : true});


const fetchInit = async () => {

	data.loading = true;
	emit('loading', data.loading);
	const response = await api.get('manage-login-settings', {
		params : {
			type : data.local_type
		}
	});

	const rd = response.data;
	data.login_limits_flag = rd.login_limits_flag === 1 ? true : false;
	data.two_factor_auth_flag = rd.two_factor_auth_flag === 1 ? true : false;
	data.login_email_flag = rd.login_email_flag === 1 ? true : false;
	data.login_limits_attempts = rd.login_limits_attempts;
	data.login_limits_minutes = rd.login_limits_minutes;

	data.loading = false;

	emit('loading', data.loading);

}

const setType = () => {
	if(typeof props.type !== 'undefined' && props.type !== null){
		data.local_type = props.type === 'local' ? 'local' : 'global';
	}
}

onMounted(() => {
	setType();
	fetchInit();
});

</script>