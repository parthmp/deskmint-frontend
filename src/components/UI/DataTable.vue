<template>
	<div>
		<div class="grid grid-cols-1 lg:grid-cols-12 items-center">
			<div class="lg:col-span-9">
				<div class="lg:flex lg:gap-0 lg:items-center">
					<div class="lg:mr-[15px]" v-if="paginate"><input-dropdown :options="dropdown_options" v-model="local_per_page"></input-dropdown></div>
					<div class="mt-[10px] lg:mt-[0px]" v-if="checkbox_actions?.length > 0"><input-dropdown :options="checkbox_actions" v-model="checkbox_actions_dropdown" @changed="handleCheckboxActions"></input-dropdown></div>
				</div>
			</div>
			
			<div class="lg:col-span-3 mt-[25px]! lg:mt-[0px]!">
				<input-search v-model="searched_term"></input-search>
			</div>
		</div>
		<br>
		<div class="table-container">
			<!---<div v-if="dynamic_loading_status" class="h-[10px] bg-deskmint-cyan rounded-xs w-full mb-0 animate-[pulse_0.5s_ease-in-out_infinite] absolute top-0 bottom-0"></div>-->
			<table class="table">
				<thead>
					<tr :class="{'animate-[pulse_0.5s_ease-in-out_infinite]':dynamic_loading_status, 'opacity-75': dynamic_loading_status}">
						<th v-if="checkbox_actions?.length > 0">
							<input-checkbox v-model="check_page_rows" :border_white="true"></input-checkbox>
						</th>
						<th v-for="(column, ci) in local_table_data.columns" :key="ci" @click="sortColumns(column, ci)" :class="{'cursor-pointer':(column.label !== 'actions')}">
							<span class="inline-block">
								<span class="flex flex-row items-center">
									<span>{{ column.text }}</span>
									<span v-if="column.label !== 'actions'" class="flex flex-col ml-[10px]!">
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
							<span v-if="column2.label === 'actions'" v-for="action in row_actions" :key="action">
								<router-link :to="'/'+url_slug+'/edit/'+row.id" class="transition-all duration-300 inline-flex items-center justify-center w-[35px] h-[35px] rounded-lg bg-blue-500 hover:bg-blue-600 text-white!" v-if="action === 'edit'"><IconEdit class="inline-block" :size="20"></IconEdit></router-link>
								<a href="javascript:;" class="transition-all duration-300 ml-[10px] inline-flex items-center justify-center w-[35px] h-[35px] rounded-lg bg-red-500 hover:bg-red-600 text-white!" v-if="action === 'delete'" @click="handleDelete(row.id)"><IconTrash :size="22"></IconTrash></a>
							</span>
							<span v-if="!Array.isArray(row[column2.label])">
								<span v-if="typeof row[column2.label] === 'object'">
									<span v-if="row[column2.label].type === 'label'">
										<span v-if="row[column2.label].highlight === 'success'" class="bg-green-500/18 pl-[12px]! pr-[12px]! pt-[3px]! pb-[3px]! rounded-2xl text-sm text-green-950 dark:text-green-600">{{ row[column2.label].text }}</span>
										<span v-if="row[column2.label].highlight === 'error'" class="bg-red-500/18 pl-[12px]! pr-[12px]! pt-[3px]! pb-[3px]! rounded-2xl text-sm text-red-950 dark:text-red-600">{{ row[column2.label].text }}</span>
									</span>
								</span>
								<span v-else>{{ row[column2.label] }}</span>
							</span>
						</td>
					</tr>
					<tr>
						<td v-if="local_table_data.rows.length === 0" :colspan="local_table_data.columns.length+5" class="text-center!">
							No data available in the table
						</td>
					</tr>
				</tbody>
				<tfoot>
					<tr :class="{'animate-[pulse_0.5s_ease-in-out_infinite]':dynamic_loading_status, 'opacity-75': dynamic_loading_status}">
						<th v-if="checkbox_actions?.length > 0">
							<input-checkbox v-model="check_page_rows" :border_white="true"></input-checkbox>
						</th>
						<th v-for="(column, ci) in local_table_data.columns" :key="ci">{{ column.text }}</th>
					</tr>
				</tfoot>
			</table>
			
			<confirmation-popup confirm_text="Are you sure?" v-model:show_popup="show_popup" :blocker="true" :scrollable="false" :close_outside="false" @closed="handleDeletePopup"></confirmation-popup>
		</div>
		<div class="mt-[15px]! block lg:flex lg:items-center lg:gap-5">
			<p v-if="paginate" class="text-center mb-[15px]! lg:mb-[0px]!">Total pages: {{ local_total_pages }} | Current Page: {{ current_page }}</p>
			<span class="lg:grow">
				<ul v-if="paginate" class="flex gap-2 lg:justify-end justify-center">
					<li v-if="current_page > 1">
						<a href="javascript:;" class="block px-[5px]! lg:px-[10px]! py-[8.5px]! transition-all duration-300 rounded-lg bg-deskmint-green-light hover:bg-deskmint-original-dark-plus hover:text-white!" @click="setCurrentPage(current_page - 1)">
							<IconChevronLeft :size="24"></IconChevronLeft>
						</a>
					</li>
					
					<li v-for="page in visiblePages" :key="page">
						<a href="javascript:;" class="block px-[14px]! lg:px-[18px]! py-[8px]! transition-all duration-300 rounded-lg bg-deskmint-green-light hover:bg-transparent" @click="setCurrentPage(page)" :class="{'page-active': page === current_page, 'bg-deskmint-original-dark-plus': page === current_page}">{{ page }}</a>
					</li>
					
					<li v-if="current_page < local_total_pages">
						<a href="javascript:;" class="block px-[5px]! lg:px-[10px]! py-[8.5px]! transition-all duration-300 rounded-lg bg-deskmint-green-light hover:bg-deskmint-original-dark-plus hover:text-white!" @click="setCurrentPage(current_page + 1)">
							<IconChevronRight :size="24"></IconChevronRight>
						</a>
					</li>
				</ul>
			</span>
		</div>
	</div>
</template>

<style scoped>
	@reference "tailwindcss/theme";
	.page-active{
		@apply bg-transparent hover:text-[initial]!;
	}
</style>

<script lang="ts">
import { IconTriangleInvertedFilled, IconTriangleInverted, IconTriangleFilled, IconEdit, IconTrash, IconTriangle, IconChevronLeft, IconChevronRight } from '@tabler/icons-vue';
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
	local_per_page:number,
	searched_term:string,
	original_rows:any,
	local_total_pages : number,
	current_page:number,
	filtered_rows:Array<object>,
	local_checkbox_actions: Array<string>,
	checkbox_actions_dropdown: string,
	check_page_rows:boolean,
	handle_delete_multiple:boolean,
	to_be_handled_rows_multiple: Array<number>,
	local_static : boolean,
	metadata:object,
	temp_sorted_column:object
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
		IconChevronLeft,
		IconChevronRight,
		IconTrash
	},
	props : {
		data: Object,
		paginate:Boolean,
		checkbox_actions: Array<string>,
		static:Boolean,
		per_page:Number,
		total_pages:Number,
		url_slug: String,
		row_actions: Array<string>,
		dynamic_loading_status:Boolean
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
			local_per_page: env.DEFAULT_TABLE_ROWS,
			searched_term:'',
			original_rows: {},
			local_total_pages: 1,
			current_page:1,
			filtered_rows: [],
			local_checkbox_actions : [],
			checkbox_actions_dropdown: 'Choose Option',
			check_page_rows: false,
			handle_delete_multiple: false,
			to_be_handled_rows_multiple: [],
			local_static: true,
			metadata: {
				per_page: null,
				searched_term: null,
				current_page: null,
				sorted_column: null
			},
			temp_sorted_column: {},
		}
	},
	computed : {
		visiblePages(): Array<number>{
			const pages = [];
			const max_visible = 5;
			let start = Math.max(1, this.current_page - Math.floor(max_visible / 2));
			let end = Math.min(this.local_total_pages, start + max_visible - 1);
			
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
		local_per_page() : void{
			
			this.current_page = 1;
			this.resetColumnSort();
			
			
			if(this.local_static === true){
				this.local_table_data.rows = this.original_rows;
			}else{
				
				this.sendData('per_page');
				
			}
			
			if(this.paginate){
				this.checkCheckboxesForCurrentPage(false);
				this.generatePages();
			}
		},
		
		searched_term(): void{
			this.checkCheckboxesForCurrentPage(false);
			
			
			this.resetColumnSort();
			this.current_page = 1;
			
			
			if(this.local_static === true){
				this.applySearch();
			}else{
				
				this.sendData('search');
				
			}
			
			if(this.paginate) {
				this.generatePages();
			}
		},
		
		total_pages() : void{
			if(this.local_static === false){
				this.local_total_pages = this.total_pages;
			}
		},
		
		check_page_rows(check_checkboxes:boolean) : void{
			this.checkCheckboxesForCurrentPage(check_checkboxes);
		},
		data() : void{
			/*this.bootMeUp(false);*/
			this.local_table_data.rows = this.data.rows;
			this.local_table_data.rows.forEach(row => {
				row.selected = false;
				if(common.isset(row.created_at)){
					row.created_at = common.formatDate(row.created_at);
				}
			});
		}
	},
	methods : {

		applySearch(): void {
			if(!this.searched_term){
				this.filtered_rows = this.original_rows;
			} else {
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
						} else if(cell?.toString().toLowerCase().includes(search_term_temp)){
							found = true;
							break;
						}
					}
					return found;
				});
			}
		},
		
		
		sendData(type: string): void {
			
			if(this.local_static === false) {
				let json_response = {
					type: type,
					per_page: this.local_per_page,
					searched_term: this.searched_term,
					current_page: this.current_page,
					sorted_column: this.temp_sorted_column
				};
				this.$emit('handle_api', json_response);
			}
		},

		sortColumns(column:object, index:number) : void{

			if(column.label !== 'actions'){

				this.checkCheckboxesForCurrentPage(false);
				this.resetColumnSort();
				
				if(this.last_index > -1){
					this.local_table_data.columns[this.last_index].sort_visibility = '';
				}

				this.sort_column = column.label;
				this.sort_direction = this.sort_direction === 'asc' ? 'desc' : 'asc';
				column.sort_visibility = this.sort_direction;
				this.temp_sorted_column = column;
				
				if(this.local_static === true){
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
				
				}else{
					this.current_page = 1;
					
					this.sendData('sort');
					this.current_page = 1;
					
				}
				this.last_index = index;

			}
			
			
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
			if(this.local_static === true){
				
				const data_to_paginate = this.searched_term === '' ? this.original_rows : this.filtered_rows;
				
				let pages = (data_to_paginate.length / this.local_per_page);
				this.local_total_pages = Math.ceil(pages);
				
				if (this.current_page > this.local_total_pages && this.local_total_pages > 0) {
					this.current_page = this.local_total_pages;
				}
				
				if (this.current_page < 1) {
					this.current_page = 1;
				}
				
				const startIndex = (this.current_page - 1) * this.local_per_page;
				const endIndex = startIndex + this.local_per_page;
				
				this.local_table_data.rows = data_to_paginate.slice(startIndex, endIndex);
			}
		},

		setCurrentPage(page_number:number) : void{
			this.current_page = page_number;
			this.checkCheckboxesForCurrentPage(false);
			
			if(this.local_static === false){
				this.sendData('page');
			}
			
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
				if(this.to_be_handled_rows_multiple.length === 0){
					toastEvents.emit('toast', {
						type: 'error',
						message: 'Please select rows to export'
					});
					this.resetCheckboxDropdown();
				}else{
					this.exportToCSV(this.to_be_handled_rows_multiple);
				}
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
			a.download = `export_${new Date().toISOString()}.csv`;
			a.click();
			window.URL.revokeObjectURL(url);
			
			this.checkCheckboxesForCurrentPage(false);
		},

		resetCheckboxDropdown() : void{
			this.checkbox_actions_dropdown = 'Choose Option';
		},

		handleEdit(row_id:number) : void{
			this.$router.push('/'+this.url_slug+'/edit/'+row_id);
		},

		setColumnSort(column_label:string, visibility:string) : void{
			for(let z = 0 ; z < this.local_table_data.columns.length ; z++){
				if(this.local_table_data.columns[z].label === column_label){
					this.local_table_data.columns[z].sort_visibility = visibility;
					if(visibility === 'asc'){
						this.sort_direction = 'asc';
					}else{
						this.sort_direction = 'desc';
					}
					break;
				}
			}
		},
		
		resetColumnSort() : void{
			for(let z = 0 ; z < this.local_table_data.columns.length ; z++){
				this.local_table_data.columns[z].sort_visibility = '';
			}
			this.temp_sorted_column = {};
		},

		bootMeUp(omit = false) : void{
			
			if(common.isset(this.data)){

					this.local_table_data = this.data || {};
					
					if(common.isset(this.checkbox_actions) && common.isset(this.local_table_data.rows)){
						this.local_table_data.rows.forEach(row => {
							row.selected = false;
							if(common.isset(row.created_at)){
								row.created_at = common.formatDate(row.created_at);
							}
						});
					}
				}

				if(common.isset(this.per_page)){
					this.local_per_page = this.per_page || env.DEFAULT_TABLE_ROWS;
				}
				
				if(!omit){

					if(!common.isObjectEmpty(this.local_table_data)){
						if(common.isset(this.local_table_data.columns)){
							for(let z = 0 ; z < this.local_table_data.columns.length ; z++){
								this.local_table_data.columns[z]['sort_visibility'] = '';
							}
						}
					}

				}
				
				
				this.original_rows = this.local_table_data.rows;
				this.filtered_rows = this.original_rows;

				if(common.isset(this.checkbox_actions)){
					this.local_checkbox_actions = this.checkbox_actions || [];
				}

				if(common.isset(this.static)){
					this.local_static = this.static;
				}

				if(!omit){
					if(common.isset(this.total_pages)){
						if(this.local_static === false){
							this.local_total_pages = this.total_pages;
						}
					}
				}

				
				// Generate pages after state is loaded
				if(this.paginate && !omit){
					this.generatePages();
				}

			}
	},
	
	mounted : function(){

		this.bootMeUp();

	}
});
</script>