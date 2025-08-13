<template>
	<section class="main-content">
    <div class="card">
        <h1 class="text-2xl!">Clients</h1>
        <br>
        
    </div>
	
</section>
</template>
<style scoped>

</style>
<script lang="ts">


	import RedirectToLoginForNoTokens from '../mixins/RedirectToLoginForNoTokens';
	
	import { defineComponent } from 'vue';

	import DataTable from './UI/DataTable.vue';
	import common from '../helpers/common';
	
	export default defineComponent({
		name : 'Clients',
		components : {
			DataTable
		},
		data: function(){
			return {
				per_page: 15,
				table_data: {
					columns : [],
					rows: []
				}
			}
		},
		mixins: [RedirectToLoginForNoTokens],
		watch: {
			
		},
		methods : {
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
				
				
				console.log('API CALL START');
				console.log(json_object);
				console.log('API CALL END');
				/* handle axios here for fetching data */

				/*
					this.table_data.rows.push({
						id: 400,
						index: 400,
						first_name: 'searched tony',
						last_name: 'Statk',
						status: {
							type:'label',
							text: 'active'
						},
						date: '1950-05-27',
						actions: ['edit', 'delete']
					});
		
				*/

				
			}

		},
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

			/*
			if(common.isset(this.$route.params.id)){
				this.handleAPI(this.$route.params.id);
			}else{
				this.handleAPI(btoa(JSON.stringify({
					per_page: this.per_page,
					current_page: 1
				})));
			}*/
			
		}

	});

</script>