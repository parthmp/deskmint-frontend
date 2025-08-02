<template>
	<section class="main-content">
		<div class="card">
			<h1 class="text-2xl!">Create Clients Custom Field</h1>
			
				<input-button class="lg:float-start" btn_text="Back" url="/custom-fields/clients" icon="IconCaretLeft"></input-button>
				<div class="clear-both"></div>
				
			
			<br>
			
			<form @submit.prevent="createClientCustomField" class="form">

				
				

				<input-button btn_text="Save" :disabled="btn_disabled" icon="IconCheck" class="lg:float-end"></input-button>
				<div class="clear-both"></div>

			</form>
			
		</div>
	</section>
</template>

<script lang="ts">

	export interface ClientsCustomFieldsCreateInterface{
		data_loading:boolean,
		btn_disabled:boolean
	}

	import { defineComponent } from 'vue';

	import InputButton from '../../inputs/InputButton.vue';
	
	export default defineComponent({

		name: 'ClientsCustomFieldsCreate',

		components: {
			InputButton
		},

		data() : ClientsCustomFieldsCreateInterface {
			return {
				data_loading : false,
				btn_disabled: false
			}
		},

		methods : {
			createClientCustomField() : void{

			}
		}

	});

</script>