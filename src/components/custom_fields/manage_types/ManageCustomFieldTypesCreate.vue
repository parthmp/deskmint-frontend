<template>
	<section class="main-content">
		<div class="card">
			<h1 class="text-2xl!">Create Clients Custom Field</h1>
			
				<input-button class="lg:float-start" btn_text="Back" url="/custom-fields/manage-field-types" icon="IconCaretLeft"></input-button>
				<div class="clear-both"></div>
				
			
			<br>
			
			<form @submit.prevent="createCustomFieldType" class="form">

				<div class="grid grid-cols-12 gap-5">
					<div class="col-span-6">
						<input-select :options="options" label="Input type" :required="true" prop_placeholder="Select" v-model="input_type" ref="input_type"></input-select>
					</div>
					<div class="col-span-6">

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
		input_type:string
	}

	import { defineComponent } from 'vue';

	import InputButton from '../../inputs/InputButton.vue';
	import InputSelect from '../../inputs/InputSelect.vue';
	
	export default defineComponent({

		name: 'ManageCustomFieldTypesCreate',

		components: {
			InputButton,
			InputSelect
		},

		data() : ManageCustomFieldTypesCreateInterface{
			return {
				data_loading : false,
				btn_disabled: false,
				options: [
					{
						id: 1,
						value: 1,
						text: 'text input',
						selected: true
					},
					{
						id: 2,
						value: 2,
						text: 'text input2'
					}
				],
				input_type: ''
			}
		},

		watch: {
			input_type() : void{
				this.$refs.input_type.validate();
			}
		},

		methods : {
			createCustomFieldType() : void{
				console.log(this.input_type);
			}
		}

	});

</script>