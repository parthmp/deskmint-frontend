<template>
	<general-index-page page_title="Manage payment types" :enable_arranged_columns="false" base_url="manage-payment-types" slug="payments/types" :actions="['edit', 'delete']" :checkbox_actions="['Delete', 'Export CSV']"></general-index-page>
</template>

<script lang="ts" setup>
	
	/* using compositon API */
	import GeneralIndexPage from '../../blocks/GeneralIndexPage.vue';
</script>