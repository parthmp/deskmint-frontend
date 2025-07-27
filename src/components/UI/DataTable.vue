<template>

	<div>
		<div class="grid grid-cols-1 lg:grid-cols-12 items-center">
			<div class="lg:col-span-9 mb-[15px]! lg:mb-[0px]!"><input-dropdown :options="dropdown_options" v-model="per_page"></input-dropdown></div>
			<div class="lg:col-span-3"><input-search v-model="searched_term"></input-search></div>
		</div>
		<br>
		<div class="table-container">
			<table class="table">
				<tr class="cursor-pointer">
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
				<tr v-for="(row, ri) in local_table_data.rows" :key="ri">
					
					<td v-for="(column2, ci2) in local_table_data.columns" :key="ci2">
						<span v-if="Array.isArray(row[column2.label])" v-for="action in row[column2.label]" :key="action">
							<IconEdit class="inline-block cursor-pointer" v-if="action === 'edit'" :size="22"></IconEdit>&nbsp;
							<IconTrash class="inline-block text-red-500 cursor-pointer" v-if="action === 'delete'" :size="22" @click="handleDelete(ri)"></IconTrash>
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
					<th v-for="(column, ci) in local_table_data.columns" :key="ci">{{ column.text }}</th>
				</tr>
			</table>
			<ul class="flex gap-2">
				<li><a href="javascript:;">1</a></li>
				<li><a href="javascript:;">2</a></li>
				<li><a href="javascript:;">3</a></li>
				<li><a href="javascript:;">4</a></li>
				<li><a href="javascript:;">5</a></li>
				<li><a href="javascript:;">></a></li>
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

	import { env } from '../../env.example';


	export interface DataTableInterface{
		local_table_data : object,
		sort_column: string,
        sort_direction: string,
		last_index: number,
		to_be_deleted: number,
		show_popup:boolean,
		dropdown_options: any,
		per_page:number,
		searched_term:string
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
			IconTrash
		},
		props : {
			data: Object
		},
		data(): DataTableInterface{
			return {
				local_table_data : {},
				sort_column: '',
        		sort_direction: 'asc',
				last_index: -1,
				to_be_deleted: -1,
				show_popup: false,
				dropdown_options: [
					5, 10, 15, 35, 50, 100
				],
				per_page: env.DEFAULT_TABLE_ROWS,
				searched_term:''
			}
		},
		watch: {
			per_page() : void{
				console.log('changed');
				console.log(this.per_page);
			}
		},
		methods : {
			sortColumns(column:object, index:number) : void{
				
				if(this.last_index > -1){
					this.local_table_data.columns[this.last_index].sort_visibility = '';
				}

				this.sort_column = column.label;
				
				this.sort_direction = this.sort_direction === 'asc' ? 'desc' : 'asc';
				
				column.sort_visibility = this.sort_direction;

				this.local_table_data.rows.sort((a, b) => {

					let valueA = '';
					let valueB = '';

					if(typeof a[column.label] === 'object'){
						valueA = a[column.label].text;
					}else{
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
					
					if (this.sort_direction === 'asc') {
						return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
					} else {
						return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
					}

				});

				this.last_index = index;
			},

			handleDelete(row_index:number) : void{
				this.to_be_deleted = row_index;
				this.show_popup = true;
			},

			handleDeletePopup(obj:object) : void{

				if(this.to_be_deleted > -1){
					if(obj.closed && obj.value){
						let removed = this.local_table_data.rows[this.to_be_deleted];
						this.local_table_data.rows.splice(this.to_be_deleted, 1);
						this.$emit('deleted_row', removed);
					}
				}

			}

		},
		
		mounted : function(){
			
			if(common.isset(this.data)){
				this.local_table_data = this.data || {};
			}

			if(!common.isObjectEmpty(this.local_table_data)){
				if(common.isset(this.local_table_data.columns)){

					for(let z = 0 ; z < this.local_table_data.columns.length ; z++){
						this.local_table_data.columns[z]['sort_visibility'] = '';
					}

				}
			}

		}

	});

</script>