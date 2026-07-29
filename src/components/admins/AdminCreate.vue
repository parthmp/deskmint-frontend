<template>
	<section class="main-content">
		<div class="card">
			<h1 class="text-2xl!">Create Admin</h1>
			
				<input-button class="lg:float-start" btn_text="Back" url="/admins" icon="IconCaretLeft"></input-button>
				<div class="clear-both"></div>
				
			
			<br>
			<skeleton-edit-admin v-show="loading"></skeleton-edit-admin>
			<form v-show="!loading" @submit.prevent="createAdmin" class="form">

				<div class="grid grid-cols-12 gap-5">
					<div class="col-span-12 lg:col-span-6">
						<input-text :required="true" label="Enter name" placeholder="Enter name" v-model="name.value" :error="name.error" ref="name"></input-text>
					</div>
					<div class="col-span-12 lg:col-span-6">
						<input-email :required="true" v-model="email" ref="email"></input-email>
					</div>
				</div>
				
				<div class="grid grid-cols-12 gap-5 mt-[20px]">
					<div class="col-span-12 lg:col-span-6">
						<input-password :required="true" v-model="password" ref="password"></input-password>
					</div>
					<div class="col-span-12 lg:col-span-6">
						<input-password :required="true" v-model="confirm_password" ref="confirm_password" label="Confirm Password"></input-password>
					</div>
				</div>
				<div class="mt-[30px]">
					<login-settings-block @data="handleData" type="local" @loading="handleLoading"></login-settings-block>
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
	import LoginSettingsBlock from '../settings/login/LoginSettingsBlock.vue';
	import { defineComponent } from 'vue';
	import { toastEvents } from '../../events/toastEvents';
	import api from '../../helpers/api';
	import type { LoginSettings } from '../../types/LoginSettings.ts';
	import SkeletonEditAdmin from '../skeletons/SkeletonEditAdmin.vue';

	export interface AdminCreateInterface{
		name:object,
		email:string,
		password:string,
		confirm_password: string,
		btn_disabled:boolean,
		login_limits_flag:boolean,
		two_factor_auth_flag:boolean,
		login_email_flag:boolean,
		login_limits_attempts:number,
		login_limits_minutes:number,
		loading:boolean,
	}
	
	export default defineComponent({
		name : 'AdminCreate',
		components : {
			InputButton,
			InputEmail,
			InputPassword,
			InputText,
			LoginSettingsBlock,
			SkeletonEditAdmin
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
				login_limits_flag : false,
				two_factor_auth_flag : false,
				login_email_flag : false,
				login_limits_attempts : 1,
				login_limits_minutes : 1,
				loading: false
			}
		},
		watch: {
			"name.value"(): void {

				let name_validated = this.$refs.name.validate();

				if(name_validated){
					this.name.error = '';
				}else{
					this.name.error = 'Please enter your name';
				}
				
			},
			"email"(): void {
				this.$refs.email.validate();
			},
			"password"(): void {
				this.$refs.password.validate();
			},
			"confirm_password"(): void {
				this.$refs.confirm_password.validate();
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
				this.loading = loading;
			},

			createAdmin() : void{

				this.btn_disabled = true;

				let name_validated = this.$refs.name.validate();
				let email_validated = this.$refs.email.validate();
				let password_validated = this.$refs.password.validate();
				let confirm_password_validated = this.$refs.confirm_password.validate();

				if(name_validated && email_validated && password_validated && confirm_password_validated){

					if(this.password !== this.confirm_password){
						this.btn_disabled = false;
						toastEvents.emit('toast', {
							type: 'error',
							message: 'Password and Confirm password do not match'
						});

					}else{

						api.post('manage-admins', {
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

				}else{

					this.btn_disabled = false;
					toastEvents.emit('toast', {
						type: 'error',
						message: 'Please fill in all fields.'
					});

				}

				

			}

		},
		mounted : function(){
			
			

		}

	});

</script>