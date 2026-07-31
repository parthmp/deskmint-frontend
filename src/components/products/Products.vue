<template>
	<general-index-page page_title="Manage products" :enable_arranged_columns="false" base_url="manage-products" slug="products" :actions="['edit', 'delete']" :checkbox_actions="['Delete', 'Export CSV']"></general-index-page>
</template>

<script lang="ts" setup>
	
	/* using compositon API */
	import GeneralIndexPage from '../blocks/GeneralIndexPage.vue';
</script>