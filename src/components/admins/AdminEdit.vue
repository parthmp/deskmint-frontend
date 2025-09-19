<template>
	<section class="main-content">
    <div class="card">
        <h1 class="text-2xl!">Edit Admin</h1>
		
		<input-button class="lg:float-start" btn_text="Back" url="/admins" icon="IconCaretLeft"></input-button>
		<div class="clear-both"></div>
			
		
        <br>
        <p>Note: Leave password fields blank if you do not want to change the password</p>
		<br>
		<skeleton-edit-admin v-if="loading"></skeleton-edit-admin>
		<form v-if="!loading" @submit.prevent="createAdmin" class="form">

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
	
	import { defineComponent } from 'vue';
	import { toastEvents } from '../../events/toastEvents';
	import api from '../../helpers/api';

	import SkeletonEditAdmin from '../skeletons/SkeletonEditAdmin.vue';
	
	export interface AdminCreateInterface{
		name:object,
		email:string,
		password:string,
		confirm_password: string,
		btn_disabled:boolean,
		loading: boolean,
		require_password: boolean
	}
	
	export default defineComponent({
		name : 'AdminEdit',
		components : {
			InputButton,
			InputEmail,
			InputPassword,
			InputText,
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
				loading: false,
				require_password: false
			}
		},
		watch: {
			"name.value"(): void {

				
				let name_validated = this.$refs?.name?.validate();

				if(name_validated){
					this.name.error = '';
				}else{
					this.name.error = 'Please enter your name';
				}
				
				
				
			},
			"email"(): void {
				
				this.$refs?.email?.validate();
				
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
						confirm_password: this.confirm_password
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
		mounted : function(){
			
			this.loading = true;
			
			api.get('manage-admins/'+this.$route.params.id).then((response) => {
				
				let rd = response.data;
				this.name.value = rd.name;
				this.email = rd.email;
				this.loading = false;
			}).catch((errors) => {});

		}

	});

</script>