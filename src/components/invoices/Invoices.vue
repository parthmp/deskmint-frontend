<template>
	<general-index-page page_title="Manage invoices" :enable_arranged_columns="true" base_url="manage-invoices" slug="invoices" :actions="['view','edit', 'delete', 'send invoice']" @action="handleAction"></general-index-page>
</template>

<script lang="ts" setup>
	
	/* using compositon API */
	import GeneralIndexPage from '../blocks/GeneralIndexPage.vue';

	const handleAction = (obj:object) => {
		//console.log(obj);
	}

</script>