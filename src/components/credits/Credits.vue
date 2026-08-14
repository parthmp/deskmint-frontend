<template>
	<general-index-page page_title="Manage credits" :enable_arranged_columns="true" base_url="manage-credits" slug="credits" :actions="['view','edit', 'delete', apply_credit]" @action="handleAction" :checkbox_actions="['Delete', 'Export CSV']"></general-index-page>
</template>

<script lang="ts" setup>
	
/* using compositon API */
import { onMounted, reactive } from 'vue';
import GeneralIndexPage from '../blocks/GeneralIndexPage.vue';
import api from '../../helpers/api.ts';
import { toastEvents } from '../../events/toastEvents.ts';
import { useRouter } from 'vue-router';
import common from '../../helpers/common.ts';

const router = useRouter();

type actionObject = {
	action:string,
	row : {
		company_id : number,
		id : number
	}
};

const data = reactive<{time_offset_minutes:number}>({
	time_offset_minutes : 0
});

const apply_credit = {

	labels: {
		apply_or_unapply: [1,2],
	},
	mapped : 'status'

};



const handleAction = (obj:actionObject) => {
	
	if(obj.action.toLowerCase() === 'apply_or_unapply'){
		router.push(`/credits/apply/${obj.row.id}`);
	}

}



onMounted(() => {
	const d = new Date();
	data.time_offset_minutes = -(d.getTimezoneOffset());
});

</script>