<template>
	<general-index-page page_title="Manage payments" :enable_arranged_columns="true" base_url="manage-payments" slug="payments" :actions="['view','edit', 'delete', apply_payment]" @action="handleAction" :checkbox_actions="['Delete', 'Export CSV']"></general-index-page>
</template>

<script lang="ts" setup>
	
/* using compositon API */
import GeneralIndexPage from '../../blocks/GeneralIndexPage.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

type actionObject = {
	action:string,
	row : {
		company_id : number,
		id : number
	}
};

const apply_payment = {

	labels: {
		apply_or_unapply: [1,2, 3],
	},
	mapped : 'status'

};



const handleAction = (obj:actionObject) => {
	
	if(obj.action.toLowerCase() === 'apply_or_unapply'){
		router.push(`/payments/apply/${obj.row.id}`);
	}

}


</script>