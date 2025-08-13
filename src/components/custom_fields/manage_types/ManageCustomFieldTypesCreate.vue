<template>
	<section class="main-content">
		<div class="card">
			<h1 class="text-2xl!">Create Custom Field Type</h1>
			
			<input-button class="lg:float-start" btn_text="Back" url="/custom-fields/manage-field-types" icon="IconCaretLeft"></input-button>
			<div class="clear-both"></div>
				

			<br>
			<manage-custom-field-types-create-skeleton v-if="data_loading"></manage-custom-field-types-create-skeleton>
			<form v-if="!data_loading" @submit.prevent="createCustomFieldType" class="form">

				<div class="lg:grid lg:grid-cols-12 lg:gap-5">
					<div class="lg:col-span-6 mt-[20px] lg:mt-[0px]">
						<input-select :options="options" label="Input type" :required="true" prop_placeholder="Select an option" v-model="input_type" ref="input_type"></input-select>
					</div>
					<div class="lg:col-span-6 mt-[20px] lg:mt-[0px]">
						<input-text label="Input name" :required="true" v-model="input_name.value" :error="input_name.error" ref="input_name"></input-text>
					</div>
				</div>
				

				<input-button btn_text="Save" :disabled="btn_disabled" icon="IconCheck" class="lg:float-end"></input-button>
				<div class="clear-both"></div>

			</form>
			
		</div>
	</section>
</template>

<script lang="ts">

	export interface ManageCustomFieldTypesCreateInterface{
		data_loading:boolean,
		btn_disabled:boolean,
		options: object,
		input_type:string,
		input_name:object
	}

	import { defineComponent } from 'vue';
	import api from '../../../helpers/api';

	import InputButton from '../../inputs/InputButton.vue';
	import InputSelect from '../../inputs/InputSelect.vue';
	import InputText from '../../inputs/InputText.vue';

	import ManageCustomFieldTypesCreateSkeleton from '../../skeletons/ManageCustomFieldTypesCreateSkeleton.vue';
	import { toastEvents } from '../../../events/toastEvents';
	import RedirectToLoginForNoTokens from '../../../mixins/RedirectToLoginForNoTokens';
	
	export default defineComponent({

		name: 'ManageCustomFieldTypesCreate',

		components: {
			InputButton,
			InputSelect,
			InputText,
			ManageCustomFieldTypesCreateSkeleton
		},

		data() : ManageCustomFieldTypesCreateInterface{
			return {
				data_loading : false,
				btn_disabled: false,
				options: [],
				input_type: '',
				input_name: {
					value: '',
					error: 'Please enter input name'
				}
			}
		},

		mixins: [RedirectToLoginForNoTokens],

		watch: {
			input_type() : void{
				this.$refs.input_type.validate();
			},
			"input_name.value"() : void{

				let input_name_validated = this.$refs.input_name.validate();

				if(input_name_validated){
					this.input_name.error = '';
				}else{
					this.input_name.error = 'Please enter input name';
				}
				
			}
		},

		methods : {
			createCustomFieldType() : void{
				
				let input_type_v = this.$refs.input_type.validate();
				let input_name_v = this.$refs.input_name.validate();

				if(!input_type_v || !input_name_v){

					toastEvents.emit('toast', {
						type:'error',
						message : 'Please fill in all fields'
					});

				}else{

					this.btn_disabled = true;
					
					api.post('manage-field-types', {
						input_type:this.input_type,
						input_name:this.input_name.value	
					}).then((response) => {
						this.btn_disabled = false;
						this.$router.push('/custom-fields/manage-field-types');
					}).catch((error) => {
						this.btn_disabled = false;
					});

				}

			},

			fetchInputTypes() : void{
				this.data_loading = true;
				api.get('manage-field-types/fetch-input-types').then((response) => {
					this.options = response.data;
					this.data_loading = false;
				}).catch((error) => { this.data_loading = false; });
			}

		},

		mounted(){
			this.fetchInputTypes();
		}

	});

</script>