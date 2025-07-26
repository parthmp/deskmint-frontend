<template>

	<div class="table-container">
		<table class="table">
			<tr class="cursor-pointer">
				<th v-for="(column, ci) in local_table_data.columns" :key="ci" @click="sortColumns(column.label)">
					{{ column.text }}
					<IconChevronDown v-if="sort_column !== column.label || sort_direction === 'asc'" class="inline-block" :size="18"></IconChevronDown>
    				<IconChevronUp v-if="sort_column === column.label && sort_direction === 'desc'" class="inline-block" :size="18"></IconChevronUp>
				</th>
			</tr>
			<tr v-for="(row, ri) in local_table_data.rows" :key="ri">
				
				<td v-for="(column2, ci2) in local_table_data.columns" :key="ci2">
					<span v-if="Array.isArray(row[column2.label])" v-for="action in row[column2.label]" :key="action">
						<IconEdit class="inline-block cursor-pointer" v-if="action === 'edit'" :size="22"></IconEdit>&nbsp;
						<IconTrash class="inline-block text-red-500 cursor-pointer" v-if="action === 'delete'" :size="22"></IconTrash>
					</span>
					<span v-else>{{ row[column2.label] }}</span>
				</td>
			</tr>
			<tr>
				<th v-for="(column, ci) in local_table_data.columns" :key="ci" @click="sortColumns(column.label)">{{ column.text }}</th>
			</tr>
		</table>
	</div>
</template>
<style scoped>

</style>
<script lang="ts">


	
	import { IconChevronDown, IconChevronUp, IconEdit, IconTrash } from '@tabler/icons-vue';
	import { defineComponent } from 'vue';
	import common from '../../helpers/common';


	export interface DataTableInterface{
		local_table_data : object,
		sort_column: string,
        sort_direction: string
	}
	
	export default defineComponent({
		name : 'DataTable',
		components : {
			IconChevronDown,
			IconChevronUp,
			IconEdit,
			IconTrash
		},
		props : {
			data: Object
		},
		data(): DataTableInterface{
			return {
				local_table_data : {},
				sort_column: '',
        		sort_direction: 'asc'
			}
		},
		methods : {
			sortColumns(column_label:string) : void{
				this.sort_column = column_label;
				if (this.sort_column === column_label) {
					this.sort_direction = this.sort_direction === 'asc' ? 'desc' : 'asc';
				} else {
					this.sort_column = column_label;
					this.sort_direction = 'asc';
				}

				this.local_table_data.rows.sort((a, b) => {
					let valueA = a[column_label];
					let valueB = b[column_label];
					
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
			}
		},
		
		mounted : function(){
			
			if(common.isset(this.data)){
				this.local_table_data = this.data || {};
			}

		}

	});

</script>