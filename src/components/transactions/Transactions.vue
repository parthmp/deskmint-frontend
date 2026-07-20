<template>
	<general-index-page page_title="Manage Transactions" :enable_arranged_columns="true" base_url="manage-transactions" slug="transactions" :actions="['view', void_data]" @action="handleAction"></general-index-page>
</template>

<script lang="ts" setup>
	
/* using compositon API */
import { onMounted, reactive } from 'vue';
import GeneralIndexPage from '../blocks/GeneralIndexPage.vue';
import api from '../../helpers/api.ts';
import { toastEvents } from '../../events/toastEvents.ts';
import { useRouter } from 'vue-router';

const router = useRouter();



const data = reactive<{time_offset_minutes:number}>({
	time_offset_minutes : 0
});

const void_data = {

	labels: {
		void: 3
	},
	mapped : 'status'

};

type objType = {
	row : {
		id:number,
		payment_method : {
			text : string
		},
		status : {
			highlight : string,
			text : string
		}
	},
	
	action: string
};

const handleAction = (obj:objType) => {
	if(obj.row.payment_method.text.toLowerCase() !== 'cash' && obj.row.payment_method.text.toLowerCase() !== 'netbanking'){
		toastEvents.emit('toast', {
			type: 'error',
			message : 'You can only void offline transactions'
		});
	}else{
		if(obj.action.toLowerCase() === 'void'){
			obj.row.status.highlight = 'error';
			obj.row.status.text = 'Void';
			voidTransaction(+obj.row.id);
		}
	}
	
}

const voidTransaction = async (id:number) : Promise<void> => {

	try{
		api.patch('manage-transactions/void-transaction', {
			id : id
		});
	}catch(e){

	}

}

onMounted(() => {
	const d = new Date();
	data.time_offset_minutes = -(d.getTimezoneOffset());
});

</script>