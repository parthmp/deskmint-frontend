<template>
	<section class="main-content">
    <div class="card">
        <h1 class="text-2xl!">Create admin</h1>
		
			<input-button class="lg:float-start" btn_text="Back" url="/admins" icon="IconCaretLeft"></input-button>
			<div class="clear-both"></div>
			
		
        <br>
        
		<form @submit.prevent="createAdmin" class="form">

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
					<input-password :required="true" v-model="password" ref="password"></input-password>
				</div>
				<div class="col-span-12 lg:col-span-6">
					<input-password :required="true" v-model="confirm_password" ref="confirm_password" label="Confirm Password"></input-password>
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


	import RedirectToLoginForNoTokens from '../../mixins/RedirectToLoginForNoTokens';

	import InputButton from '../inputs/InputButton.vue';
	import InputText from '../inputs/InputText.vue';
	import InputEmail from '../inputs/InputEmail.vue';
	import InputPassword from '../inputs/InputPassword.vue';
	
	import { defineComponent } from 'vue';
import { toastEvents } from '../../events/toastEvents';
import api from '../../helpers/api';
	
	export interface AdminCreateInterface{
		name:object,
		email:string,
		password:string,
		confirm_password: string,
		btn_disabled:boolean
	}
	
	export default defineComponent({
		name : 'Admins',
		components : {
			InputButton,
			InputEmail,
			InputPassword,
			InputText
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
				btn_disabled: false
			}
		},
		mixins: [RedirectToLoginForNoTokens],
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

				

			}

		},
		mounted : function(){
			
			

		}

	});

</script>