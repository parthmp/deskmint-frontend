<template>
	<div>
		<EmailSettingsSMTPSkeleton v-if="data.loading"></EmailSettingsSMTPSkeleton>
		<form @submit.prevent="saveEmailSettingsSMTP" v-if="!data.loading">

			<div class="lg:grid lg:grid-cols-12 lg:gap-5">
				<div class="lg:col-span-4">
					<input-text label="Host" placeholder="Host" v-model="data.host.value" :error="data.host.error" :required="true" ref="host_ref"></input-text>
				</div>
				<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
					<input-number label="Port" placeholder="Port" v-model="data.port.value" :error="data.port.error" :required="true" ref="port_ref"></input-number>
				</div>
				<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
					<input-select label="Encryption" placeholder="Select" :options="encryption_options" v-model="data.encryption.value" :error="data.encryption.error" :required="true" ref="encryption_ref"></input-select>
				</div>
			</div>

			<div class="lg:grid lg:grid-cols-12 lg:gap-5">
				<div class="lg:col-span-6 mt-[20px]">
					<input-text label="Username" placeholder="Username" v-model="data.username.value" :error="data.username.error" :required="true" ref="username_ref"></input-text>
				</div>
				<div class="lg:col-span-6 mt-[20px]">
					<input-password label="Password" placeholder="Password" v-model="data.password.value" :error="data.password.error" ref="password_ref"></input-password>
				</div>
			</div>

			<div class="lg:grid lg:grid-cols-12 lg:gap-5">
				<div class="lg:col-span-4 mt-[20px]">
					<input-email label="Mail from address" placeholder="Mail from address" v-model="data.mail_from_address.value" :error="data.mail_from_address.error" :required="true" ref="mail_from_address_ref"></input-email>
				</div>
				<div class="lg:col-span-4 mt-[20px]">
					<input-text label="Mail from name" placeholder="Mail from name" v-model="data.mail_from_name.value" :error="data.mail_from_name.error" :required="true" ref="mail_from_name_ref"></input-text>
				</div>
				<div class="lg:col-span-4 mt-[20px]">
					<input-email label="Reply-to address" placeholder="Reply-to address" v-model="data.reply_to_address.value" :error="data.reply_to_address.error" :required="true" ref="reply_to_address_ref"></input-email>
				</div>
			</div>

			<input-email label="Test email address" placeholder="Test email address" v-model="data.test_email_address.value" :error="data.test_email_address.error" :required="true" ref="test_email_ref"></input-email>
			<p>A test email will be sent to the above email address to confirm validity of SMTP settings.</p>
			<input-button class="lg:float-end" btn_text="Save & send test email" icon="IconCheck" :disabled="data.btn_disabled"></input-button>
			
			<div class="lg:clear-both"></div>
			
		</form>
	</div>
</template>
<script lang="ts" setup>

	import EmailSettingsSMTPSkeleton from '../../../skeletons/EmailSettingsSMTPSkeleton.vue';

	import InputText from '../../../inputs/InputText.vue';
	import InputEmail from '../../../inputs/InputEmail.vue';
	import InputPassword from '../../../inputs/InputPassword.vue';
	import InputNumber from '../../../inputs/InputNumber.vue';
	import InputButton from '../../../inputs/InputButton.vue';
	import InputSelect from '../../../inputs/InputSelect.vue';

	import { nextTick, onMounted, reactive, ref, watch } from 'vue';
	import api from '../../../../helpers/api';
	import { toastEvents } from '../../../../events/toastEvents';

	type InputStringTypeWithError = {
		value : string,
		error : string
	};

	type InputNumberTypeWithError = {
		value : number,
		error : string
	};

	type EncryptionOptions = {
		text : string, 
		value : string
	};

	interface EmailSettingsSMTPInterface{
		btn_disabled : boolean,
		loading : boolean,
		host : InputStringTypeWithError,
		port : InputNumberTypeWithError,
		username : InputStringTypeWithError,
		password : InputStringTypeWithError,
		mail_from_address : InputStringTypeWithError,
		mail_from_name : InputStringTypeWithError,
		reply_to_address : InputStringTypeWithError,
		encryption : InputStringTypeWithError,
		test_email_address : InputStringTypeWithError
	}

	interface InputInterface{
		validate : () => void
	}

	const encryption_options : EncryptionOptions[] = [
		{
			text : 'SSL',
			value: 'ssl'
		},
		{
			text : 'TLS',
			value : 'tls'
		}
	];

	const data = reactive<EmailSettingsSMTPInterface>({
		btn_disabled : false,
		loading : false,
		host : {
			value : '',
			error: 'Please enter the host'
		},
		port : {
			value : 0,
			error : 'Please enter the port'
		},
		username : {
			value : '',
			error : 'Please enter the username'
		},
		password : {
			value : '',
			error : ''
		},
		mail_from_address : {
			value : '',
			error : 'Please enter a valid mail from address'
		},
		mail_from_name : {
			value : '',
			error : 'Please enter mail from name'
		},
		reply_to_address: {
			value : '',
			error : 'Please enter a valid reply to address'
		},
		encryption: {
			value : '',
			error : 'Please select encryption type'
		},
		test_email_address: {
			value : '',
			error : 'Please enter a valid email'
		}
	});

	const host_ref = ref<InputInterface | null>(null);
	const port_ref = ref<InputInterface | null>(null);
	const username_ref = ref<InputInterface | null>(null);
	const password_ref = ref<InputInterface | null>(null);
	const mail_from_address_ref = ref<InputInterface | null>(null);
	const mail_from_name_ref = ref<InputInterface | null>(null);
	const reply_to_address_ref = ref<InputInterface | null>(null);
	const encryption_ref = ref<InputInterface | null>(null);
	const test_email_ref = ref<InputInterface | null>(null);



	watch(() => data.host.value, () : void => {
		validateField(data.host, host_ref, 'Please enter the host');
	});

	watch(() => data.port.value, () : void => {
		validateField(data.port, port_ref, 'Please enter the port');
	});

	watch(() => data.username.value, () : void => {
		validateField(data.username, username_ref, 'Please enter the username');
	});
	
	watch(() => data.mail_from_address.value, () : void => {
		validateField(data.mail_from_address, mail_from_address_ref, 'Please enter a valid mail from address');
	});

	watch(() => data.encryption.value, () : void => {
		validateField(data.encryption, encryption_ref, 'Please select encryption type');
	});

	watch(() => data.mail_from_name.value, () : void => {
		validateField(data.mail_from_name, mail_from_name_ref, 'Please enter mail from name');
	});

	watch(() => data.reply_to_address.value, () : void => {
		validateField(data.reply_to_address, reply_to_address_ref, 'Please enter a valid reply to address');
	});
	
	watch(() => data.test_email_address.value, () : void => {
		validateField(data.test_email_address, test_email_ref, 'Please enter a valid email');
	});

	const validateField = (field: InputStringTypeWithError | InputNumberTypeWithError, field_ref: any, message: string) => {
		nextTick(() => {
			field.error = message;
			if (field_ref.value?.validate()) {
				field.error = '';
			}
		});
	};

	const saveEmailSettingsSMTP = async () : Promise<void> => {

		data.btn_disabled = true;

		/* validate */
		const v_host = host_ref.value?.validate() ?? false;
		const v_port = port_ref.value?.validate() ?? false;
		const v_username = username_ref.value?.validate() ?? false;
		const v_password = password_ref.value?.validate() ?? false;
		const v_mail_from_address = mail_from_address_ref.value?.validate() ?? false;
		const v_mail_from_name = mail_from_name_ref.value?.validate() ?? false;
		const v_reply_to_address = reply_to_address_ref.value?.validate() ?? false;
		const v_enc = encryption_ref.value?.validate() ?? false;
		const v_test_email = test_email_ref.value?.validate() ?? false;
		
		if(v_host && v_port && v_username && v_password && v_mail_from_address && v_mail_from_name && v_reply_to_address && v_enc && v_test_email){

			try{

				await api.post('manage-email-settings-smtp', {
					host : data.host.value,
					port : data.port.value,
					username : data.username.value,
					password : data.password.value,
					mail_from_address : data.mail_from_address.value,
					mail_from_name : data.mail_from_name.value,
					reply_to_address : data.reply_to_address.value,
					encryption : data.encryption.value,
					test_email_address : data.test_email_address.value
				});

			}finally{
				data.btn_disabled = false;
			}

		}else{
			toastEvents.emit('toast', {
				type : 'error',
				message : 'Please fill in highlighted fields'
			});
		}

		data.btn_disabled = false;
		
		
	}

	const fetchEmailSettingsSMTP = async () : Promise<void> => {

		data.loading = true;

		const response = await api.get('manage-email-settings-smtp');
		data.host.value = response.data.host;
		data.port.value = response.data.port;
		data.username.value = response.data.username;
		data.password.value = response.data.password;
		data.mail_from_address.value = response.data.mail_from_address;
		data.mail_from_name.value = response.data.mail_from_name;
		data.reply_to_address.value = response.data.reply_to_address;
		data.encryption.value = response.data.encryption;
		data.test_email_address.value = response.data.test_email_address;

		data.loading = false;

	}

	onMounted(() : void => {
		fetchEmailSettingsSMTP();
	})

</script>