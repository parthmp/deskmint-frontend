<template>
	<section class="main-content">
    <div class="card">
        <h1 class="text-2xl!">Admins</h1>
        <br>
        <data-table :data="table_data"></data-table>
        
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
							first_name: 'Jack',
							last_name: 'Sparrow',
							date: '1950-05-25',
							actions: ['edit', 'delete']
						},
						{
							index: 2,
							first_name: 'Jack2',
							last_name: 'Sparrow',
							date:'1950-05-26',
							actions: ['edit', 'delete']
						},
						{
							index: 3,
							first_name: 'Jack3',
							last_name: 'Sparrow5',
							date: '1950-05-27',
							actions: ['edit', 'delete']
						},
						{
							index: 4,
							first_name: 'Jack4',
							last_name: 'Sparrow',
							date: '1950-05-27',
							actions: ['edit', 'delete']
						}
					]
				}
			}
		},
		methods : {
			
		},
		mixins: [RedirectToLoginForNoTokens],
		mounted : function(){
			
		}

	});

</script>