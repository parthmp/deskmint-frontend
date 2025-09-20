<template>
	<general-index-page page_title="Manage clients" :enable_arranged_columns="true" base_url="manage-clients" slug="clients" :actions="['view','edit', 'delete']"></general-index-page>
</template>

<script lang="ts" setup>
	
	/* using compositon API */
	import GeneralIndexPage from '../blocks/GeneralIndexPage.vue';

</script>