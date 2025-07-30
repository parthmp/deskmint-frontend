<template>
	<section class="main-content">
    <div class="card">
        <h1 class="text-2xl!">Admins</h1>

			<div class="table-skeleton">
				<div class="h-[50px] w-[150px] animate-pulse float-end">
					<div class="h-[38px] bg-deskmint-green-dark rounded-lg dark:bg-deskmint-green-dark w-full mb-2"></div>
				</div>
				<div class="clear-both"></div>
				<div class="h-[50px] w-[350px] animate-pulse float-end">
					<div class="h-[38px] bg-deskmint-green-dark rounded-lg dark:bg-deskmint-green-dark w-full mb-2"></div>
				</div>
				<div class="clear-both"></div>
				<div role="status" class="w-full animate-pulse">
					<br>
					<div class="h-[38px] bg-deskmint-green-dark rounded-lg dark:bg-deskmint-green-dark w-full mb-2"></div>
					<div v-for="z in 10" :key="z" class="h-[38px] bg-deskmint-green-light rounded-lg dark:bg-deskmint-green-light w-full mb-2"></div>
					<div class="h-[38px] bg-deskmint-green-dark rounded-lg dark:bg-deskmint-green-dark w-full mb-2"></div>
				</div>
			</div>



			<input-button class="lg:float-end" btn_text="Add New" url="/admins/create" icon="IconPlus"></input-button>
			<div class="clear-both"></div>
			
		
        <br>
		
        <data-table :data="table_data" :per_page="per_page" :key="table_data_key" @deleted_row_id="handleDeleted" :paginate="true" :checkbox_actions="['Delete', 'Export CSV']" @deleted_rows="handleMultipleDelete" :static="true" url_slug="admins" :row_actions="['edit', 'delete']"></data-table>
        
    </div>
	<br>
	<div class="card">
		Test card
	</div>
</section>
</template>
<style scoped>

</style>
<script lang="ts">


	import RedirectToLoginForNoTokens from '../../mixins/RedirectToLoginForNoTokens';
	
	import { defineComponent } from 'vue';

	import DataTable from '../UI/DataTable.vue';
	import InputButton from '../inputs/InputButton.vue';
	import common from '../../helpers/common';
	import api from '../../helpers/api';
	
	export default defineComponent({
		name : 'Admins',
		components : {
			DataTable,
			InputButton
		},
		data: function(){
			return {
				per_page: 15,
				disabled: false,
				table_data: {
					columns : [],
					rows: []
				},
				table_data_key: 1
					
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
			fetchAdmins() : void{
				
				api.get('manage-admins').then((response:any) => {
					this.table_data = response.data;
					this.table_data_key = 2;
					console.log(response);
				}).catch((errors) => {
					
				});
				
				
				
			}

		},
		mounted : function(){
			
			this.fetchAdmins();

		}

	});

</script>