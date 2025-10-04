<template>
	<div>

		<defaults-company-settings-skeleton v-if="data.loading"></defaults-company-settings-skeleton>

		<form v-if="!data.loading" @submit.prevent="saveDefaultCompanySettingsFields">
			
			<input-textarea label="Invoice terms" v-model="data.invoice_terms" :required="false"></input-textarea>
			
			<input-textarea label="Invoice footer" v-model="data.invoice_footer" :required="false"></input-textarea>
			
			<input-button btn_text="Save" :disabled="data.btn_disabled" icon="IconCheck" class="lg:float-end"></input-button>
			<div class="clear-both"></div>

		</form>
	</div>
</template>

<script lang="ts" setup>

	import { onMounted, reactive } from 'vue';
	import InputTextarea from '../../../inputs/InputTextarea.vue';
	import InputButton from '../../../inputs/InputButton.vue';
	import api from '../../../../helpers/api';

	import DefaultsCompanySettingsSkeleton from '../../../skeletons/DefaultsCompanySettingsSkeleton.vue';

	interface DefaultsCompanySettingsInterface{
		loading:boolean,
		btn_disabled:boolean,
		invoice_terms:string,
		invoice_footer:string
	}

	const data = reactive<DefaultsCompanySettingsInterface>({
		loading: false,
		btn_disabled: false,
		invoice_terms : '',
		invoice_footer: ''
	});

	/* methods */
	const saveDefaultCompanySettingsFields = () : void => {
		data.btn_disabled = true;
		api.post('manage-company-settings-defaults', {
			invoice_terms : data.invoice_terms,
			invoice_footer : data.invoice_footer,
		}).finally(() => {
			data.btn_disabled = false;
		});

	}

	const fetchDefaultCompanySettingsFields = () : void => {
		data.loading = true;
		api.get('manage-company-settings-defaults').then(response => {
			data.invoice_terms = response.data.invoice_terms ?? '';
			data.invoice_footer = response.data.invoice_footer ?? '';
			data.loading = false;
		});

	}

	/* hooks */
	onMounted(() : void => {
		fetchDefaultCompanySettingsFields();
	});

</script>