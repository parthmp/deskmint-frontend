<template>
	<section class="main-content">
    <div class="card">
        <h1 class="text-2xl!">Clients</h1>
        <br>
        <skeleton-table v-if="data_loading" :rows="10"></skeleton-table>
		<a href="javascript:;" @click="show_popup = !show_popup">Test for popup</a>
		<popup :show_popup="show_popup" @closed="closePopup">
			<div>
				this is test
			</div>
		</popup>
		<span v-if="!data_loading" class="">
			<input-button class="lg:float-end" btn_text="Add New" url="/clients/create" icon="IconPlus"></input-button>
			<div class="clear-both"></div>
			<br>
			<data-table :data="table_data" :show_search="true" @deleted_row_id="handleDeleted" :paginate="true" :checkbox_actions="['Delete', 'Export CSV']" @deleted_rows="handleMultipleDelete" :static="false" url_slug="clients" :row_actions="['edit', 'delete']" :datetime_filter="true" :total_pages="total_pages" @handle_api="handleAPI" :dynamic_loading_status="dynamic_loading_status"></data-table>
		</span>
		
    </div>
	
</section>
</template>
<style scoped>

</style>
<script lang="ts">


	import RedirectToLoginForNoTokens from '../../mixins/RedirectToLoginForNoTokens';

	import SkeletonTable from '../skeletons/SkeletonTable.vue';
	
	import { defineComponent } from 'vue';

	import InputButton from '../inputs/InputButton.vue';
	import Popup from '../UI/Popup.vue';

	import DataTable from '../UI/DataTable.vue';
	import common from '../../helpers/common';
	import api from '../../helpers/api';
	import { env } from '../../env';

	export interface ClientsInterface{
		data_loading:boolean,
		per_page:number,
		table_data:object,
		total_pages: number,
		dynamic_loading_status:boolean,
		show_popup: boolean
	}
	
	export default defineComponent({
		name : 'Clients',
		components : {
			DataTable,
			InputButton,
			SkeletonTable,
			Popup
		},
		data(): ClientsInterface{
			return {
				data_loading : false,
				per_page: 15,
				table_data: {
					columns : [],
					rows: []
				},
				total_pages: 0,
				dynamic_loading_status: false,
				show_popup: false
			}
		},
		mixins: [RedirectToLoginForNoTokens],
		watch: {
			
		},
		methods : {
			fetchClients(page_data = '') : void{
				
				if(page_data === ''){
					this.data_loading = true;
				}else{
					this.dynamic_loading_status = true;
				}
				
				api.get('manage-clients', {
					params: {
						...(page_data || {}),
						default_per_page: env.DEFAULT_TABLE_ROWS,
						timezone: common.getBrowserTimezone()
					}

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
			handleDeleted(row_id:object) : void{
				console.log('===');
				console.log(row_id);
				console.log('===');
				/* handle axios here for single deletes */
			},
			handleMultipleDelete(ids:any) : void{
				console.log('FIRED');
				console.log(ids);
				console.log('===');
				/* handle axios here for multiple deletes */
			},
			handleAPI(json_object:object) : void{
				this.fetchClients(json_object);
			},

			closePopup(e:any): void{
				this.show_popup = false;
			}

		},
		mounted : function(){
			this.fetchClients();
		}

	});

</script>