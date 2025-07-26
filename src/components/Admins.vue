<template>
	<section class="main-content">
    <div class="card">
        <h1 class="text-2xl!">Admins</h1>
        <br>
        <data-table :data="table_data" :per_page="per_page" @deleted_row="handleDeleted"></data-table>
        
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


	import RedirectToLoginForNoTokens from '../mixins/RedirectToLoginForNoTokens';
	
	import { defineComponent } from 'vue';

	import DataTable from './UI/DataTable.vue';
	
	export default defineComponent({
		name : 'Admins',
		components : {
			DataTable
		},
		data: function(){
			return {
				per_page: 10,
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
							index: 2,
							first_name: 'Jack2',
							last_name: 'Sparrow',
							status: {
								type:'label',
								text: 'active'
							},
							date:'1950-05-26',
							actions: ['edit', 'delete']
						},
						{
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
							index: 4,
							first_name: 'Jack4',
							last_name: 'Sparrow',
							status: {
								type:'label',
								text: 'active'
							},
							date: '1950-05-27',
							actions: ['edit', 'delete']
						}
					]
				}
			}
		},
		methods : {
			handleDeleted(removed:object) : void{
				console.log('===');
				console.log(removed);
				console.log('===');
				/* handle axios here */
			}
		},
		mixins: [RedirectToLoginForNoTokens],
		mounted : function(){
			/*setInterval(() => {
				this.table_data.rows.push({
							index: 4,
							first_name: 'Jack4 ==',
							last_name: 'Sparrow',
							status: {
								type:'label',
								text: 'active'
							},
							date: '1950-05-27',
							actions: ['edit', 'delete']
						});
			}, 200);*/
		}

	});

</script>