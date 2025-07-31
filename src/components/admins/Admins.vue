<template>
	<section class="main-content">
		<div class="card">
			<h1 class="text-2xl! mb-[25px] lg:mb-[0px]">Admins</h1>

			
			<skeleton-table v-if="data_loading" :rows="10"></skeleton-table>
		
			<span v-if="!data_loading" class="">
				<input-button class="lg:float-end" btn_text="Add New" url="/admins/create" icon="IconPlus"></input-button>
				<div class="clear-both"></div>
				<br>
				<data-table :data="table_data" :per_page="per_page" @deleted_row_id="handleDeleted" :paginate="true" :checkbox_actions="['Delete', 'Export CSV']" @deleted_rows="handleMultipleDelete" :static="true" url_slug="admins" :row_actions="['edit', 'delete']"></data-table>
			</span>
			
		</div>
	</section>
</template>
<style scoped>
	
</style>
<script lang="ts">


	import RedirectToLoginForNoTokens from '../../mixins/RedirectToLoginForNoTokens';
	
	import { defineComponent } from 'vue';

	import DataTable from '../UI/DataTable.vue';
	import SkeletonTable from '../skeletons/SkeletonTable.vue';

	import InputButton from '../inputs/InputButton.vue';
	import common from '../../helpers/common';
	import api from '../../helpers/api';
	import { toastEvents } from '../../events/toastEvents';

	export interface AdminsInterface{
		per_page:number,
		disabled:boolean,
		table_data: object,
		data_loading:boolean
	}
	
	export default defineComponent({
		name : 'Admins',
		components : {
			DataTable,
			InputButton,
			SkeletonTable
		},
		data(): AdminsInterface{
			return {
				per_page: 15,
				disabled: false,
				table_data: {
					columns : [],
					rows: []
				},
				data_loading: true
					
			}
		},
		mixins: [RedirectToLoginForNoTokens],
		watch: {
			
		},
		methods : {

			showCreateAdminPage() : void{
				console.log('clicked!');
			},

			handleDeleted(row_id:object) : void{
			
				/* handle axios here for single deletes */
				this.deleteAdmins([row_id]);
			},
			handleMultipleDelete(ids:any) : void{
				
				/* handle axios here for multiple deletes */
				this.deleteAdmins(ids);
				
			},
			fetchAdmins() : void{
				
				api.get('manage-admins').then((response:any) => {
					this.table_data = response.data;
					this.data_loading = false;
				}).catch((errors) => {
					
				});
				
				
				
			},

			deleteAdmins(ids:any) : void{

				api.delete('manage-admins', {
					data : {
						ids : ids
					}
				}).catch((error) => {
					this.fetchAdmins();
				});

			}

		},
		mounted : function(){
			
			this.fetchAdmins();

		}

	});

</script>