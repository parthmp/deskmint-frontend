<template>
	<general-index-page page_title="Manage Transactions" :add_new="false" :enable_arranged_columns="true" base_url="manage-transactions" slug="transactions" :actions="['view']" :checkbox_actions="['Export CSV']"></general-index-page>
</template>

<script lang="ts" setup>
	
/* using compositon API */

import GeneralIndexPage from '../blocks/GeneralIndexPage.vue';


</script>