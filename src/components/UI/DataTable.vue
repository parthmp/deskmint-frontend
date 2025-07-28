<template>

	<div>
		<div class="grid grid-cols-1 lg:grid-cols-12 items-center">
			<div class="lg:col-span-4 mb-[15px]! lg:mb-[0px]!"><input-dropdown v-if="paginate" :options="dropdown_options" v-model="per_page"></input-dropdown></div>
			<div class="lg:col-span-4 mb-[15px]! lg:mb-[0px]!" v-if="checkbox_actions?.length > 0"><input-dropdown v-if="paginate" :options="checkbox_actions" v-model="checkbox_actions_dropdown" @changed="handleCheckboxActions"></input-dropdown></div>
			<div class="lg:col-span-3"><input-search v-model="searched_term"></input-search></div>
		</div>
		<br>
		<div class="table-container">
			<table class="table">
				<thead>
					<tr class="cursor-pointer">
						<th v-if="checkbox_actions?.length > 0">
							<input-checkbox v-model="check_page_rows"></input-checkbox>
						</th>
						<th v-for="(column, ci) in local_table_data.columns" :key="ci" @click="sortColumns(column, ci)">
							<span class="inline-block">
								<span class="flex flex-row items-center">
									<span>{{ column.text }}</span>
									<span class="flex flex-col ml-[10px]!">
										<IconTriangleFilled v-if="column.sort_visibility !== '' && column.sort_visibility === 'asc'" class="inline-block" :size="8"></IconTriangleFilled>
										<IconTriangle v-if="column.sort_visibility === '' || column.sort_visibility === 'desc'" class="inline-block" :size="8"></IconTriangle>
										<IconTriangleInverted v-if="column.sort_visibility === '' || column.sort_visibility === 'asc'" class="inline-block" :size="8"></IconTriangleInverted>
										<IconTriangleInvertedFilled v-if="column.sort_visibility !== '' && column.sort_visibility === 'desc'" class="inline-block" :size="8"></IconTriangleInvertedFilled>
									</span>
								</span>
							</span>
							
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(row, ri) in local_table_data.rows" :key="ri">
						<td v-if="checkbox_actions?.length > 0"><input-checkbox v-model="row.selected"></input-checkbox></td>
						<td v-for="(column2, ci2) in local_table_data.columns" :key="ci2">
							<span v-if="Array.isArray(row[column2.label])" v-for="action in row[column2.label]" :key="action">
								<IconEdit class="inline-block cursor-pointer" v-if="action === 'edit'" :size="22"></IconEdit>&nbsp;
								<IconTrash class="inline-block text-red-500 cursor-pointer" v-if="action === 'delete'" :size="22" @click="handleDelete(row.id)"></IconTrash>
							</span>
							<span v-if="!Array.isArray(row[column2.label])">
								<span v-if="typeof row[column2.label] === 'object'">
									<span v-if="row[column2.label].type === 'label'">
										<span class="bg-deskmint-green-light pl-[10px]! pr-[10px]! pt-[2px]! pb-[2px]! rounded-2xl">{{ row[column2.label].text }}</span>
									</span>
								</span>
								<span v-else>{{ row[column2.label] }}</span>
							</span>
						</td>
					</tr>
					<tr>
						<td v-if="local_table_data.rows.length === 0" :colspan="local_table_data.columns.length" class="text-center!">
							No data in the table
						</td>
					</tr>
				</tbody>
				<tfoot>
					<tr>
						<th v-if="checkbox_actions?.length > 0">
							<input-checkbox v-model="check_page_rows"></input-checkbox>
						</th>
						<th v-for="(column, ci) in local_table_data.columns" :key="ci">{{ column.text }}</th>
					</tr>
				</tfoot>
			</table>

			<p v-if="paginate">Total pages: {{ total_pages }} | Current Page: {{ current_page }}</p>
			<ul v-if="paginate" class="flex gap-2">
				<li v-if="current_page > 1">
					<a href="javascript:;" @click="setCurrentPage(current_page - 1)">‹</a>
				</li>
				
				<li v-for="page in visiblePages" :key="page">
					<a href="javascript:;" @click="setCurrentPage(page)" :class="{ 'active': page === current_page }">{{ page }}</a>
				</li>
				
				<li v-if="current_page < total_pages">
					<a href="javascript:;" @click="setCurrentPage(current_page + 1)">›</a>
				</li>
			</ul>
			<confirmation-popup confirm_text="Are you sure?" v-model:show_popup="show_popup" :blocker="true" :scrollable="false" :close_outside="false" @closed="handleDeletePopup"></confirmation-popup>
		</div>
	</div>
	

</template>
<style scoped>
	
</style>
<script lang="ts">


	
	import { IconTriangleInvertedFilled, IconTriangleInverted, IconTriangleFilled, IconEdit, IconTrash, IconTriangle } from '@tabler/icons-vue';
	import { defineComponent } from 'vue';
	import common from '../../helpers/common';

	import InputButton from '../inputs/InputButton.vue';

	import ConfirmationPopup from './ConfirmationPopup.vue';
	import InputDropdown from '../inputs/InputDropdown.vue';
	import InputSearch from '../inputs/InputSearch.vue';
	import InputCheckbox from '../inputs/InputCheckbox.vue';
	import { env } from '../../env';
	import { toastEvents } from '../../events/toastEvents';


	export interface DataTableInterface{
		local_table_data : object,
		sort_column: string,
    	sort_direction: string,
		last_index: number,
		to_be_deleted_row_id: number,
		show_popup:boolean,
		dropdown_options: any,
		per_page:number,
		searched_term:string,
		original_rows:any,
		total_pages : number,
		current_page:number,
		filtered_rows:Array<object>,
		local_checkbox_actions: Array<string>,
		checkbox_actions_dropdown: string,
		check_page_rows:boolean,
		handle_delete_multiple:boolean,
		to_be_handled_rows_multiple: Array<number>
	}
	
	export default defineComponent({
		name : 'DataTable',
		components : {
			IconTriangleInvertedFilled,
			IconTriangleInverted,
			IconTriangleFilled,
			IconEdit,
			IconTriangle,
			InputButton,
			ConfirmationPopup,
			InputDropdown,
			InputSearch,
			InputCheckbox,
			IconTrash
		},
		props : {
			data: Object,
			paginate:Boolean,
			checkbox_actions: Array<string>
		},
		data(): DataTableInterface{
			return {
				local_table_data : {
					columns: [],
					rows : []
				},
				sort_column: '',
        		sort_direction: 'asc',
				last_index: -1,
				to_be_deleted_row_id: -1,
				show_popup: false,
				dropdown_options: [
					2, 5, 10, 15, 35, 50, 100
				],
				per_page: env.DEFAULT_TABLE_ROWS,
				searched_term:'',
				original_rows: {},
				total_pages: 1,
				current_page:1,
				filtered_rows: [],
				local_checkbox_actions : [],
				checkbox_actions_dropdown: 'Choose Option',
				check_page_rows: false,
				handle_delete_multiple: false,
				to_be_handled_rows_multiple: []
			}
		},
		computed : {
			visiblePages(): Array<number>{

				const pages = [];
				const max_visible = 5;
				let start = Math.max(1, this.current_page - Math.floor(max_visible / 2));
				let end = Math.min(this.total_pages, start + max_visible - 1);
				
				if(end - start + 1 < max_visible) {
					start = Math.max(1, end - max_visible + 1);
				}
				
				for(let i = start; i <= end; i++) {
					pages.push(i);
				}
				
				return pages;
			}
		},
		watch: {
			per_page() : void{
				console.log(this.per_page);
				this.local_table_data.rows = this.original_rows;
				this.current_page = 1;
				if(this.paginate){
					this.checkCheckboxesForCurrentPage(false);
					this.generatePages();
				}
				console.log(this.total_pages);
			},
			searched_term(): void{
				this.checkCheckboxesForCurrentPage(false);
				if(!this.searched_term){
					this.filtered_rows = this.original_rows;
				}else{
					const search_term_temp = this.searched_term.toLowerCase();
					this.filtered_rows = this.original_rows.filter(row => {

						let found = false;

						for(let z = 0; z < this.local_table_data.columns.length; z++){

							let column = this.local_table_data.columns[z];
							if(column.label === 'actions' || column.label === 'index'){
								continue;
							}

							let cell = row[column.label];
							
							if (typeof cell === 'object' && cell?.text){
								if (cell.text.toLowerCase().includes(search_term_temp)) {
									found = true;
									break;
								}
							}else if(cell?.toString().toLowerCase().includes(search_term_temp)){
								found = true;
								break;
							}
						}
						return found;
					});
				}
				
				this.current_page = 1;
				if(this.paginate) {
					this.generatePages();
				}
			},
			check_page_rows(check_checkboxes:boolean) : void{
				this.checkCheckboxesForCurrentPage(check_checkboxes);
			}
		},
		methods : {
			sortColumns(column:object, index:number) : void{
				this.checkCheckboxesForCurrentPage(false);
				if(this.last_index > -1){
					this.local_table_data.columns[this.last_index].sort_visibility = '';
				}

				this.sort_column = column.label;
				this.sort_direction = this.sort_direction === 'asc' ? 'desc' : 'asc';
				column.sort_visibility = this.sort_direction;

				const datasetToSort = this.searched_term === '' ? this.original_rows : this.filtered_rows;
				
				datasetToSort.sort((a, b) => {

					let valueA = '';
					let valueB = '';

					if(typeof a[column.label] === 'object'){
						valueA = a[column.label].text;
					} else {
						valueA = a[column.label];
					}

					if(typeof b[column.label] === 'object'){
						valueB = b[column.label].text;
					}else{
						valueB = b[column.label];
					}

					if (typeof valueA === 'string') {
						valueA = valueA.toLowerCase();
						valueB = valueB.toLowerCase();
					}
					
					if(this.sort_direction === 'asc'){
						return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
					}else{
						return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
					}

				});

				if(this.paginate){
					this.generatePages();
				}else{
					this.local_table_data.rows = datasetToSort;
				}

				this.last_index = index;
			},

			handleDelete(row_id:number) : void{
				this.to_be_deleted_row_id = row_id;
				this.show_popup = true;
				this.handle_delete_multiple = false;
				this.to_be_handled_rows_multiple = [];
				this.checkCheckboxesForCurrentPage(false);
			},

			handleDeletePopup(obj:object) : void{
				
				if(this.to_be_deleted_row_id > -1 || (this.handle_delete_multiple && this.to_be_handled_rows_multiple.length > 0)){
					
					if(obj.closed && obj.value){
						

						if(this.handle_delete_multiple){
							let temp_ids = [];
							for(let z = 0 ; z < this.to_be_handled_rows_multiple.length ; z++){
								temp_ids.push(this.to_be_handled_rows_multiple[z].id);
								this.removeRowById(this.to_be_handled_rows_multiple[z].id);
							}
							
							this.$emit('deleted_rows', temp_ids);
							this.handle_delete_multiple = false;
							this.to_be_handled_rows_multiple = [];

						}else{

							this.removeRowById(this.to_be_deleted_row_id);
							this.generatePages();
							this.$emit('deleted_row_id', this.to_be_deleted_row_id);

						}

						
						
					}
				}

			},

			removeRowById(row_id:number) : void{
				const index = this.local_table_data.rows.findIndex(row => row.id === row_id);
						
				if(index !== -1){
					this.local_table_data.rows.splice(index, 1);
				}
				const original_rows_index = this.original_rows.findIndex(row => row.id === row_id);
				if(original_rows_index !== -1){
					this.original_rows.splice(original_rows_index, 1);
				}
			},

			generatePages() : void{

				const data_to_paginate = this.searched_term === '' ? this.original_rows : this.filtered_rows;
    
				let pages = (data_to_paginate.length / this.per_page);
				this.total_pages = Math.ceil(pages);
				
				if (this.current_page > this.total_pages) {
					this.current_page = this.total_pages;
				}
				
				const startIndex = (this.current_page - 1) * this.per_page;
				const endIndex = startIndex + this.per_page;
				
				this.local_table_data.rows = data_to_paginate.slice(startIndex, endIndex);
				
			},

			setCurrentPage(page_number:number) : void{
				this.current_page = page_number;
				this.checkCheckboxesForCurrentPage(false);
				this.generatePages();
			},

			handleCheckboxActions(checkbox_action:string) : void{
				this.resetCheckboxDropdown();
				let b_checkbox_action = checkbox_action.toLowerCase();

				this.to_be_handled_rows_multiple = this.local_table_data.rows.filter((row) => {
					if(row.selected){
						return true;
					}
					return false;
				});
				
				if(b_checkbox_action === 'delete'){
					
					if(this.to_be_handled_rows_multiple.length === 0){
						toastEvents.emit('toast', {
							type: 'error',
							message: 'Please select rows to delete'
						});
					}else{
						this.show_popup = true;
						this.handle_delete_multiple = true;
					}
					
				}else if(b_checkbox_action === 'export csv'){
					this.exportToCSV(this.to_be_handled_rows_multiple);
				}
			},

			checkCheckboxesForCurrentPage(status:boolean): void{
				if(status === false){
					this.check_page_rows = false;
				}
				this.local_table_data.rows.forEach((row) => {
					row.selected = status;
				});
			},

			exportToCSV(selected_rows:any) {

				if(selected_rows.length === 0) {
					toastEvents.emit('toast', {
						type: 'error',
						message: 'Please select rows to export'
					});
					this.resetCheckboxDropdown();
					return;
				}
				
				const headers = this.local_table_data.columns
					.filter(column => column.label !== 'actions')
					.map(column => column.text);
				
				
				const csvRows = selected_rows.map(row => {
					return this.local_table_data.columns
						.filter(column => column.label !== 'actions')
						.map(column => {
							let value = row[column.label];
							if(typeof value === 'object' && value?.text) {
								value = value.text;
							}
							return value && value.toString().includes(',') ? `"${value.toString().replace(/"/g, '""')}"` : value;
						});
				});
				
				
				const csvContent = [headers, ...csvRows].map(row => row.join(',')).join('\n');
				
				
				const blob = new Blob([csvContent], { type: 'text/csv' });
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'exported_data.csv';
				a.click();
				window.URL.revokeObjectURL(url);
				
				this.checkCheckboxesForCurrentPage(false);


			},

			resetCheckboxDropdown() : void{
				this.checkbox_actions_dropdown = 'Choose Option';
			}

		},
		
		mounted : function(){
			
			if(common.isset(this.data)){

				this.local_table_data = this.data || {};

				if(common.isset(this.checkbox_actions)){
					this.local_table_data.rows.forEach(row => {
						row.selected = false;
					});
				}

			}
			

			if(!common.isObjectEmpty(this.local_table_data)){
				if(common.isset(this.local_table_data.columns)){
					for(let z = 0 ; z < this.local_table_data.columns.length ; z++){
						this.local_table_data.columns[z]['sort_visibility'] = '';
					}
				}
			}
			
			this.original_rows = this.local_table_data.rows;
			this.filtered_rows = this.original_rows;

			if(common.isset(this.checkbox_actions)){
				this.local_checkbox_actions = this.checkbox_actions || [];
			}
			
			if(this.paginate){
				this.generatePages();
			}
			
			/*
			setInterval(() => {
				this.generatePagination();
			}, 2000);*/

		}

	});

</script>