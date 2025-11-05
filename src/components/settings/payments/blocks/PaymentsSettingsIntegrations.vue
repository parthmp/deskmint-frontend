<template>
	
	<!-- <skeleton-table v-if="data.loading" :rows="10"></skeleton-table> -->

	<span v-if="!data.loading" class="">
		<input-button class="lg:float-end" btn_text="Add new payment gateway" url="/settings/payments/integrations/new-gateway" icon="IconPlus"></input-button>
		<div class="clear-both"></div>
		<br>
		<data-table :data="data.table_data" :show_search="false" :per_page="data.per_page" @deleted_row_id="handleDeleted" :paginate="true" :checkbox_actions="['Delete', 'Export CSV']" @deleted_rows="handleMultipleDelete" :static="true" url_slug="settings/payments/integrations" :row_actions="['edit', 'delete']"></data-table>
	</span>
</template>

<script lang="ts" setup>
	
	import { reactive } from 'vue';
	import DataTable from '../../../UI/DataTable.vue';
	import InputButton from '../../../inputs/InputButton.vue';

	const data = reactive({
		loading : false,
		table_data: {
					columns : [],
					rows: []
				},
		per_page: 15
	});

	const handleDeleted = () : void => {

	}

	const handleMultipleDelete = () : void => {
		
	}

</script>