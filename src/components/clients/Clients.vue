<template>
	<section class="main-content">
    <div class="card">
        <h1 class="text-2xl!">Clients</h1>
        <br>
        <skeleton-table v-if="data_loading" :rows="10"></skeleton-table>
		<a href="javascript:;" @click="show_popup = !show_popup">Test for popup</a>
		<input-switch v-model="switchstatus"></input-switch>
		<popup :show_popup="show_popup" @closed="closePopup" header="Arrange columns">
			<div class="mt-4">
				<p class="mb-5">Drag and drop to arrange columns, use switches to show/hide and enable/disable column search.</p>
				<draggable v-model="myArray" group="people" @start="drag=true" @end="drag=false" item-key="id" :animation="200">
					<template #item="{element, index}">
						<transition-group name="fade" tag="div">
							<div class="px-5 py-2 mt-3 rounded-xl shadow-sm outline-1 outline-deskmint-green-light dark:bg-deskmint-cyan-light" :key="element.id">
								<span class="flex gap-2">
									<span><icon-grain /></span>
									<span>{{element.name}}</span>
									<!-- <span><input-switch></input-switch></span> -->
								</span>
							</div>
						</transition-group>
					</template>
				</draggable>

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

	import draggable from 'vuedraggable';
	import { IconGrain } from '@tabler/icons-vue';
	import InputSwitch from '../inputs/InputSwitch.vue';

	export interface ClientsInterface{
		data_loading:boolean,
		per_page:number,
		table_data:object,
		total_pages: number,
		dynamic_loading_status:boolean,
		show_popup: boolean,
		switchstatus: boolean,

		myArray: Array<object>
	}
	
	export default defineComponent({
		name : 'Clients',
		components : {
			DataTable,
			InputButton,
			SkeletonTable,
			Popup,
			draggable,
			IconGrain,
			InputSwitch
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
				show_popup: false,
				switchstatus: true,
				myArray: [
					{
						id:1,
						name: 'test 1',
						value: 'val 1'
					},
					{
						id:2,
						name: 'test 2',
						value: 'val 2'
					},
					{
						id:3,
						name: 'test 3',
						value: 'val 3'
					},
					{
						id:4,
						name: 'test 4',
						value: 'val 4'
					},
					{
						id:5,
						name: 'test 5',
						value: 'val 5'
					},
					{
						id:6,
						name: 'test 6',
						value: 'val 6'
					}
				]
			}
		},
		mixins: [RedirectToLoginForNoTokens],
		watch: {
			switchstatus(): void{
				console.log(this.switchstatus);
			}
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
			console.log(this.switchstatus);
		}

	});

</script>