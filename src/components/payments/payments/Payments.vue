<template>
	<general-index-page page_title="Manage payments" :enable_arranged_columns="true" base_url="manage-payments" slug="payments/payments" :actions="['view',edit_action, delete_action, apply_payment]" @action="handleAction" :checkbox_actions="['Delete', 'Export CSV']"></general-index-page>
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

const edit_action = {
	labels : {
		edit : [null]
	},
	mapped : 'payment_gateway'
};

const delete_action = {
	labels : {
		delete : [null]
	},
	mapped : 'payment_gateway'
};



const handleAction = (obj:actionObject) => {
	
	if(obj.action.toLowerCase() === 'apply_or_unapply'){
		router.push(`/payments/payments/apply/${obj.row.id}`);
	}

}


</script>