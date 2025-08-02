<template>
	<section class="main-content">
		<div class="card">
			<h1 class="text-2xl! mb-[25px] lg:mb-[0px]">Custom Fields - Clients</h1>

			<span v-if="!data_loading" class="">
				<input-button class="lg:float-end" btn_text="Add New" url="/custom-fields/clients/create" icon="IconPlus"></input-button>
				<div class="clear-both"></div>
				<br>
				<!--<data-table :data="table_data" :per_page="per_page" @deleted_row_id="handleDeleted" :paginate="true" :checkbox_actions="['Delete', 'Export CSV']" @deleted_rows="handleMultipleDelete" :static="true" url_slug="admins" :row_actions="['edit', 'delete']"></data-table>-->
			</span>
			
		</div>
	</section>
</template>

<script lang="ts">

	export interface ClientsCustomFieldsInterface{
		data_loading: boolean
	}

	import { defineComponent } from 'vue';

	import InputButton from '../../inputs/InputButton.vue';
	
	export default defineComponent({

		name: 'ClientsCustomFields',

		components: {
			InputButton
		},

		data() : ClientsCustomFieldsInterface {
			return {
				data_loading : false
			}
		}

	});

</script>