<template>
	<section class="main-content">
    <div class="card">
        <h1 class="text-2xl!">Admins</h1>
		
			<input-button class="lg:float-end" btn_text="Add New" url="/admins/create" icon="IconPlus"></input-button>
			<div class="clear-both"></div>
			
		
        <br>
        <data-table :data="table_data" :per_page="per_page" @deleted_row_id="handleDeleted" :paginate="true" :checkbox_actions="['Delete', 'Export CSV']" @deleted_rows="handleMultipleDelete" :static="true" url_slug="admins"></data-table>
        
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
					columns : [
						{
							label: 	'index',
							text:	'#'
						},
						{
							label: 	'first_name',
							text:	'First name'
						},
						{
							label: 	'last_name',
							text:	'Last name'
						},
						{
							label: 	'status',
							text:	'Status'
						},
						{
							label: 	'date',
							text:	'Date'
						},
						{
							label: 	'actions',
							text:	'Actions'
						}
					],
					rows: [
						{
							id: 1,
							index: 1,
							first_name: 'Jack1',
							last_name: 'Sparrow',
							status: {
								type:'label',
								text: 'active'
							},
							date: '1950-05-25',
							actions: ['edit', 'delete']
						},
						{
							id: 2,
							index: 2,
							first_name: 'Peter',
							last_name: 'Sparrow',
							status: {
								type:'label',
								text: 'active'
							},
							date:'1950-05-26',
							actions: ['edit', 'delete']
						},
						{
							id: 3,
							index: 3,
							first_name: 'Jack3',
							last_name: 'Sparrow5',
							status: {
								type:'label',
								text: 'Inactive'
							},
							date: '1950-05-27',
							actions: ['edit', 'delete']
						},
						{
							id: 4,
							index: 4,
							first_name: 'Jack4',
							last_name: 'Sparrow',
							status: {
								type:'label',
								text: 'active'
							},
							date: '1950-05-27',
							actions: ['edit', 'delete']
						},
						{
							id: 5,
							index: 5,
							first_name: 'Jack1',
							last_name: 'Sparrow',
							status: {
								type:'label',
								text: 'active'
							},
							date: '1950-05-25',
							actions: ['edit', 'delete']
						},
						{
							id: 6,
							index: 6,
							first_name: 'Peter',
							last_name: 'Sparrow',
							status: {
								type:'label',
								text: 'active'
							},
							date:'1950-05-26',
							actions: ['edit', 'delete']
						},
						{
							id: 7,
							index: 7,
							first_name: 'Jack3',
							last_name: 'Sparrow5',
							status: {
								type:'label',
								text: 'Inactive'
							},
							date: '1950-05-27',
							actions: ['edit', 'delete']
						},
						{
							id: 8,
							index: 8,
							first_name: 'Jack4',
							last_name: 'Sparrow',
							status: {
								type:'label',
								text: 'active'
							},
							date: '1950-05-27',
							actions: ['edit', 'delete']
						},
						{
							id: 9,
							index: 9,
							first_name: 'Jack1',
							last_name: 'Sparrow',
							status: {
								type:'label',
								text: 'active'
							},
							date: '1950-05-25',
							actions: ['edit', 'delete']
						},
						{
							id: 10,
							index: 10,
							first_name: 'Peter',
							last_name: 'Sparrow',
							status: {
								type:'label',
								text: 'active'
							},
							date:'1950-05-26',
							actions: ['edit', 'delete']
						},
						{
							id: 11,
							index: 11,
							first_name: 'Jack3',
							last_name: 'Sparrow5',
							status: {
								type:'label',
								text: 'Inactive'
							},
							date: '1950-05-27',
							actions: ['edit', 'delete']
						},
						{
							id: 12,
							index: 12,
							first_name: 'Jack4',
							last_name: 'Sparrow',
							status: {
								type:'label',
								text: 'active'
							},
							date: '1950-05-27',
							actions: ['edit', 'delete']
						},
						{
							id: 13,
							index: 13,
							first_name: 'Jack1',
							last_name: 'Sparrow',
							status: {
								type:'label',
								text: 'active'
							},
							date: '1950-05-25',
							actions: ['edit', 'delete']
						},
						{
							id: 14,
							index: 14,
							first_name: 'Peter',
							last_name: 'Sparrow',
							status: {
								type:'label',
								text: 'active'
							},
							date:'1950-05-26',
							actions: ['edit', 'delete']
						},
						{
							id: 15,
							index: 15,
							first_name: 'Jack3',
							last_name: 'Sparrow5',
							status: {
								type:'label',
								text: 'Inactive'
							},
							date: '1950-05-27',
							actions: ['edit', 'delete']
						}/*,
						{
							id: 16,
							index: 16,
							first_name: 'Jack4',
							last_name: 'Sparrow',
							status: {
								type:'label',
								text: 'active'
							},
							date: '1950-05-27',
							actions: ['edit', 'delete']
						}*/
					]
				}
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
					this.table_data = response;
				}).catch((errors) => {

				});
				
				
				
			}

		},
		mounted : function(){
			
			this.fetchAdmins();

		}

	});

</script>