<template>
	<div>
		<div v-if="data.loading">
			<logo-company-settings-skeleton></logo-company-settings-skeleton>
		</div>
		<div v-if="!data.loading">
			<p>Note: only images (jpg, jpeg, png, gif, webp) are allowed to upload. Max file size must not exceed more than 5mb.</p>
			<br>
			<input-file label="Select logo image" icon="IconPhoto" :multiple="false" type="image" :mb_limit="5" ref="logo_image_file" @invalid_file="triggerInvalidFile" @invalid_size="triggerInvalidSize" @get_files="getFiles"></input-file>

			<input-button @click.prevent="saveLogoImage" label="Save" icon="IconCheck" :disabled="data.btn_disabled" class="lg:float-start"></input-button>
			<div class="clear-both"></div>
		</div>
	</div>
</template>

<script lang="ts" setup>

	import { reactive, ref } from 'vue';
	import InputFile from '../../../inputs/InputFile.vue';
	import { toastEvents } from '../../../../events/toastEvents';
	import LogoCompanySettingsSkeleton from '../../../skeletons/LogoCompanySettingsSkeleton.vue';

	import InputButton from '../../../inputs/InputButton.vue';
	import api from '../../../../helpers/api';

	interface LogoImageFileInterface{
		getFiles: () => Array<object>
	}

	interface LogoCompanySettingsInterface{
		loading:boolean,
		btn_disabled:boolean,
		image : object
	}

	const logo_image_file = ref<LogoImageFileInterface | null>(null);
	const data = reactive<LogoCompanySettingsInterface>({
		loading:false,
		btn_disabled : false,
		image: {}
	});

	/* methods */
	const triggerInvalidFile = (file:object) : void => {
		toastEvents.emit('toast', {
			type: 'error',
			message: file.name+' is not allowed to upload'
		});
	}

	const triggerInvalidSize = (file:object) : void => {
		toastEvents.emit('toast', {
			type: 'error',
			message: file.name+' is too large'
		});
	}

	const getFiles = (files: Array<object>) : void => {
		data.image = files[0] ?? {};
	}

	const saveLogoImage = () : void => {
		data.btn_disabled = true;
		if(!data.image || !(data.image instanceof File)){
			toastEvents.emit('toast', {
				type: 'error',
				message: 'Please select image file to upload'
			});
			data.btn_disabled = false;
		}else{
			let form_data = new FormData();
			form_data.append('logo', data.image)
			api.post('manage-company-settings-logo', form_data).then(response => {
				
			}).catch(error => {

			}).finally(() => {
				data.btn_disabled = false;
			});
		}

		
	}


</script>