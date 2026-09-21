<template>
	<general-index-page page_title="Manage recurring invoices" :enable_arranged_columns="true" base_url="manage-recurring-invoices" slug="invoices/recurring" :actions="['view','edit', 'delete','Send']" @action="handleAction" :add_new="true" :checkbox_actions="['Delete', 'Export CSV']"></general-index-page>
	
	
</template>

<script lang="ts" setup>
	
import GeneralIndexPage from '../blocks/GeneralIndexPage.vue';


const handleAction = () => {}

</script>