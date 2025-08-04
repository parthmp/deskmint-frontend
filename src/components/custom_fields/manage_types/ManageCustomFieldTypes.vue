<template>
	<section class="main-content">
		<div class="card">
			<h1 class="text-2xl! mb-[25px] lg:mb-[0px]">Manage Custom Field Types</h1>

			<skeleton-table v-if="data_loading" :rows="10"></skeleton-table>
			
			<span v-if="!data_loading" class="">
				<input-button class="lg:float-end" btn_text="Add New" url="/custom-fields/manage-field-types/create" icon="IconPlus"></input-button>
				<div class="clear-both"></div>
				<br>
				<data-table :data="table_data" @deleted_row_id="handleDeleted" :paginate="true" :checkbox_actions="['Delete', 'Export CSV']" @deleted_rows="handleMultipleDelete" :static="false" url_slug="custom-fields/manage-field-types" :row_actions="['edit', 'delete']" :total_pages="total_pages" @handle_api="handleAPI" :dynamic_loading_status="dynamic_loading_status"></data-table>
			</span>
			
		</div>
	</section>
</template>

<script lang="ts">

	export interface ManageCustomFieldTypesInterface{
		data_loading: boolean,
		table_data: object,
		per_page: number,
		total_pages: number,
		dynamic_loading_status:boolean
	}

	import { defineComponent } from 'vue';
	import api from '../../../helpers/api';
	
	import InputButton from '../../inputs/InputButton.vue';
	import DataTable from '../../UI/DataTable.vue';

	import SkeletonTable from '../../skeletons/SkeletonTable.vue';
	import { env } from '../../../env';
	
	
	export default defineComponent({

		name: 'ManageCustomFieldTypes',

		components: {
			InputButton,
			DataTable,
			SkeletonTable
		},

		data() : ManageCustomFieldTypesInterface {
			return {
				data_loading : false,
				table_data : {
					columns: [],
					rows: []
				},
				total_pages : 1,
				per_page: 15,
				dynamic_loading_status: false
			}
		},

		methods : {

			fetchFieldTypes(page_data = '') : void{
				
				if(page_data === ''){
					this.data_loading = true;
				}else{
					this.dynamic_loading_status = true;
				}
				
				api.post('manage-field-types', {

					page_data:JSON.stringify(page_data),
					default_per_page: env.DEFAULT_TABLE_ROWS

				}).then((response) => {

					if(page_data === ''){
						this.data_loading = false;
					}else{
						this.dynamic_loading_status = false;
					}

					this.table_data = response.data.table_data;
					this.total_pages = response.data.total_pages;

				}).catch((error) => {
					if(page_data === ''){
						this.data_loading = false;
					}else{
						this.dynamic_loading_status = false;
					}

				});
			},

			handleAPI(e:any) :void {
				this.fetchFieldTypes(e);
			},

			handleDeleted(id:number) : void{
				
				this.deleteFields([id]);
			},

			handleMultipleDelete(ids:any) : void{
				this.deleteFields(ids);
			},

			deleteFields(ids:any) : void{
				api.delete('manage-field-types', {
					data : {
						ids : ids
					}
				}).catch((error) => {
					
				}).finally((e) => {
					this.fetchFieldTypes();
				});
			}
			
		},

		mounted(){
			this.fetchFieldTypes();
		}

	});

</script>