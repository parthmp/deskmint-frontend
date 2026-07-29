<template>
	<section class="main-content">
    <div class="card">
        <h1 class="text-2xl!">Edit Admin</h1>
		
		<input-button class="lg:float-start" btn_text="Back" url="/admins" icon="IconCaretLeft"></input-button>
		<div class="clear-both"></div>
			
		
        <br>
        <p>Note: Leave password fields blank if you do not want to change the password</p>
		<br>
		<skeleton-edit-admin v-if="settings_loading || loading"></skeleton-edit-admin>
		<form v-show="!loading && !settings_loading" @submit.prevent="createAdmin" class="form">

			<div class="grid grid-cols-12 gap-5">
				<div class="col-span-12 lg:col-span-6">
					<input-text :required="true" label="Enter name" prop_placeholder="Enter name" v-model="name.value" :error="name.error" ref="name"></input-text>
				</div>
				<div class="col-span-12 lg:col-span-6">
					<input-email :required="true" v-model="email" ref="email"></input-email>
				</div>
			</div>
			
			<div class="grid grid-cols-12 gap-5 mt-[20px]">
				<div class="col-span-12 lg:col-span-6">
					<input-password :required="require_password" v-model="password" ref="password"></input-password>
				</div>
				<div class="col-span-12 lg:col-span-6">
					<input-password :required="require_password" v-model="confirm_password" ref="confirm_password" label="Confirm Password"></input-password>
				</div>
			</div>
			<div class="mt-[30px]">
				<login-settings-block @data="handleData" :get_id="true" type="local" @loading="handleLoading"></login-settings-block>
			</div>
			<input-button btn_text="Save" :disabled="btn_disabled" icon="IconCheck" class="lg:float-end"></input-button>
			<div class="clear-both"></div>

		</form>
        
    </div>
</section>
</template>
<style scoped>

</style>
<script lang="ts">

	import InputButton from '../inputs/InputButton.vue';
	import InputText from '../inputs/InputText.vue';
	import InputEmail from '../inputs/InputEmail.vue';
	import InputPassword from '../inputs/InputPassword.vue';
	
	import { defineComponent, nextTick } from 'vue';
	import { toastEvents } from '../../events/toastEvents';
	import api from '../../helpers/api';

	import SkeletonEditAdmin from '../skeletons/SkeletonEditAdmin.vue';
	import type { LoginSettings } from '../../types/LoginSettings.ts';
	import LoginSettingsBlock from '../settings/login/LoginSettingsBlock.vue';
	
	export interface AdminCreateInterface{
		name:object,
		email:string,
		password:string,
		confirm_password: string,
		btn_disabled:boolean,
		loading: boolean,
		require_password: boolean,
		login_limits_flag:boolean,
		two_factor_auth_flag:boolean,
		login_email_flag:boolean,
		login_limits_attempts:number,
		login_limits_minutes:number,
		settings_loading : boolean,
		suppressed_watcher : boolean
	}
	
	export default defineComponent({
		name : 'AdminEdit',
		components : {
			InputButton,
			InputEmail,
			InputPassword,
			InputText,
			SkeletonEditAdmin,
			LoginSettingsBlock
		},
		data() : AdminCreateInterface{
			return {
				name: {
					value: '',
					error: 'Please enter your name'
				},
				email: '',
				password: '',
				confirm_password: '',
				btn_disabled: false,
				loading: false,
				require_password: false,
				login_limits_flag : false,
				two_factor_auth_flag : false,
				login_email_flag : false,
				login_limits_attempts : 1,
				login_limits_minutes : 1,
				settings_loading : false,
				suppressed_watcher : false
			}
		},
		watch: {
			"name.value"(): void {

				if(this.suppressed_watcher){
					let name_validated = this.$refs?.name?.validate();

					if(name_validated){
						this.name.error = '';
					}else{
						this.name.error = 'Please enter your name';
					}
				}
				
				
				
				
				
			},
			"email"(): void {
				if(this.suppressed_watcher){
					this.$refs?.email?.validate();
				}
				
			},
			"password"(): void {
				
				if(this.password !== '' || this.confirm_password !== ''){
					this.require_password = true;
				}else{
					this.require_password = false;
				}

				this.$refs?.password?.validate();
				
			},
			"confirm_password"(): void {
				if(this.password !== '' || this.confirm_password !== ''){
					
					this.require_password = true;
				}else{
					this.require_password = false;
				}
				this.$refs?.confirm_password?.validate();
				
			}
		},
		methods : {
			handleData(data_obj:LoginSettings) : void {
				this.login_limits_flag = data_obj.login_limits_flag;
				this.two_factor_auth_flag = data_obj.two_factor_auth_flag;
				this.login_email_flag = data_obj.login_email_flag;
				this.login_limits_attempts = data_obj.login_limits_attempts;
				this.login_limits_minutes = data_obj.login_limits_minutes;
			},

			handleLoading(loading:boolean) : void {
				this.settings_loading = loading;
			},
			createAdmin() : void{

				this.btn_disabled = true;

				let name_validated = this.$refs.name.validate();
				let email_validated = this.$refs.email.validate();
				let password_validated = this.$refs.password.validate();
				let confirm_password_validated = this.$refs.confirm_password.validate();

				let make_request = false;
				let error_message = '';

				if((!name_validated || !email_validated) && this.password === '' && this.confirm_password === ''){
					error_message = 'Please fill in name and email address';
				}else if((!name_validated || !email_validated) && (this.password !== '' || this.confirm_password !== '')){
					error_message = 'Please fill in all fields';
				}else if((name_validated && email_validated) && (this.password === '' && this.confirm_password === '')){
					make_request = true;
				}else if((name_validated && email_validated) && (this.password !== '' || this.confirm_password !== '')){
					if(!password_validated || !confirm_password_validated){
						error_message = 'Please fill in password fields.';
					}else if(password_validated && confirm_password_validated && this.password === this.confirm_password){
						make_request = true;
					}else{
						error_message = 'Passwords do not match';
					}
				}

				if(!make_request && error_message !== ''){

					this.btn_disabled = false;
					toastEvents.emit('toast', {
						type: 'error',
						message: error_message
					});


				}else{
					
					api.patch('manage-admins/'+this.$route.params.id, {
						name: this.name.value,
						email: this.email,
						password: this.password,
						confirm_password: this.confirm_password,
						login_limits_flag : this.login_limits_flag,
						two_factor_auth_flag : this.two_factor_auth_flag,
						login_email_flag : this.login_email_flag,
						login_limits_attempts : this.login_limits_attempts,
						login_limits_minutes : this.login_limits_minutes
					}).then(() => {
						this.btn_disabled = false;
						this.$router.push('/admins');
					}).catch((errors) => {
						this.btn_disabled = false;
					})
				}

				/*
				if(name_validated && email_validated && password_validated && confirm_password_validated){

					if(this.password !== this.confirm_password){
						this.btn_disabled = false;
						toastEvents.emit('toast', {
							type: 'error',
							message: 'Password and Confirm password do not match'
						});

					}else{

						api.patch('manage-admins/'+this.$route.params.id, {
							name: this.name.value,
							email: this.email,
							password: this.password,
							confirm_password: this.confirm_password
						}).then(() => {
							this.btn_disabled = false;
							this.$router.push('/admins');
						}).catch((errors) => {
							this.btn_disabled = false;
						})

					}

				}else{

					this.btn_disabled = false;
					toastEvents.emit('toast', {
						type: 'error',
						message: 'Please fill in all fields.'
					});

				}
				*/
				

			}

		},
		mounted : async function(){
			
			this.loading = true;
			
			await api.get('manage-admins/'+this.$route.params.id).then((response) => {
				
				let rd = response.data;
				this.name.value = rd.name;
				this.name.error = '';
				this.email = rd.email;
				this.loading = false;
				nextTick(() => {
					this.suppressed_watcher = true;
				});
				
			}).catch((errors) => {});
		}

	});

</script>