<template>
	<general-index-page page_title="Manage Transactions" :add_new="false" :enable_arranged_columns="true" base_url="manage-transactions" slug="transactions" :actions="['view']" @action="handleAction"></general-index-page>
</template>

<script lang="ts" setup>
	
/* using compositon API */
import { onMounted, reactive } from 'vue';
import GeneralIndexPage from '../blocks/GeneralIndexPage.vue';

const data = reactive<{time_offset_minutes:number}>({
	time_offset_minutes : 0
});

onMounted(() => {
	const d = new Date();
	data.time_offset_minutes = -(d.getTimezoneOffset());
});

</script>