<template>
	<general-index-page page_title="Manage payment requests" :add_new="true" :enable_arranged_columns="true" base_url="manage-payment-requests" slug="payments/requests" :actions="[edit, 'Delete', cancel, send, mark_sent, mark_completed]" :checkbox_actions="['Delete', 'Export CSV']" @action="handleAction"></general-index-page>
	<Popup :show_popup="data.show_popup" :close_outside="true" header="Create payment?" :scrollable="false" :blocker="true" @closed="data.show_popup = false">
		<CreatePaymentPopupSkeleton v-if="data.loading"></CreatePaymentPopupSkeleton>
		<form @submit.prevent="handleSubmitCompleted" v-if="!data.loading">
			<span class="flex gap-5 items-center mt-[25px]">
				<input-switch v-model="data.create_payment_switch" />
				<span @click.prevent="data.create_payment_switch = !data.create_payment_switch">
					Create payment
				</span>
			</span>
			<input-select v-show="data.create_payment_switch" label="Payment type" placeholder="Select payment type" :disabled="false" v-model="data.payment_type.value" :error="data.payment_type.error" :required="true" :options="data.payment_types" ref="payment_type_ref"></input-select>
			<input-button btn_text="Save" :disabled="data.disabled" icon="IconCheck" class="lg:float-end"></input-button>
			<div class="clear-both"></div>
		</form>
	</Popup>
</template>

<script lang="ts" setup>

interface RequestsInterface {
	time_offset_minutes : number,
	create_payment_switch: boolean,
	show_popup: boolean,
	disabled : boolean,
	row :RowType,
	payment_types : Array<object>,
	payment_type : {
		value : string,
		error : string
	},
	loading : boolean
}
type RowType = {status : {value : number, highlight:string, text:string}, id :number, sent_at: string};
type ActionType = {
	row : RowType,
	action: string
};

/* using compositon API */
import { onMounted, reactive, ref } from 'vue';
import GeneralIndexPage from '../../blocks/GeneralIndexPage.vue';
import common from '../../../helpers/common.ts';
import api from '../../../helpers/api.ts';
import Popup from '../../UI/Popup.vue';
import InputSwitch from '../../inputs/InputSwitch.vue';
import InputButton from '../../inputs/InputButton.vue';
import InputSelect from '../../inputs/InputSelect.vue';
import CreatePaymentPopupSkeleton from '../../skeletons/CreatePaymentPopupSkeleton.vue';

const mark_sent = {
	labels: {
		mark_sent : [1],
	},
	mapped : 'status'
};

const send = {
	labels: {
		send : [1, 2],
	},
	mapped : 'status'
};

const cancel = {
	labels: {
		cancel : [1, 2],
	},
	mapped : 'status'
};

const mark_completed = {
	labels: {
		mark_completed : [1, 2],
	},
	mapped : 'status'
};

const edit = {
	labels: {
		edit : [1, 2],
	},
	mapped : 'status'
};

const data = reactive<RequestsInterface>({
	time_offset_minutes : 0,
	create_payment_switch: true,
	show_popup: false,
	disabled : false,
	row : {
		status : { value : 0, highlight : '', text:'' },
		id : 0,
		sent_at: ''
	},
	payment_types : [],
	payment_type : {
		value : '',
		error : 'Select payment type'
	},
	loading : false
});

const payment_type_ref = ref();

const handleAction = (action:ActionType) : void => {
	data.row = action.row;
	const action_type = action.action.toLowerCase().trim();
	if(action_type === 'send' || action_type === 'mark_sent'){
		action.row.status.highlight = 'success';
		action.row.status.text = 'Sent';
		action.row.status.value = 2;
		const sql_datetime = common.toLocalSqlDatetime();
		action.row.sent_at = common.formatDate(sql_datetime, false);
		
		if(action_type === 'mark_sent'){
			
			makePaymentRequest(action.row.id, 'mark-sent');
		}else{
			makePaymentRequest(action.row.id, 'send');
		}
		
	}else if(action_type === 'cancel'){
		action.row.status.value = 3;
		action.row.status.highlight = 'error';
		action.row.status.text = 'Cancelled';
		makePaymentRequest(action.row.id, 'cancel');
	}else if(action_type === 'mark_completed'){
		data.show_popup = true;
		fetchPaymentTypes();
	}
}

const handleSubmitCompleted = () => {
	
	makePaymentRequest(data.row.id, 'completed');
}

const fetchPaymentTypes = async () => {
	data.loading = true;
	const response = await api.get(`manage-payment-requests/payment-types`);
	data.payment_types = response.data;
	data.loading = false;
}

const makePaymentRequest = async (id : number, slug : string) : Promise<void> => {
	if(slug === 'completed'){

		if(data.create_payment_switch){
			const payment_type_v = payment_type_ref.value.validate();
			if(!payment_type_v){
				data.payment_type.error = 'Select payment type';
				return ;
			}
		}
		data.row.status.value = 4;
		data.row.status.highlight = 'success';
		data.row.status.text = 'Completed';
		
		data.disabled = true;
	}
	let patch_url = `manage-payment-requests/${slug}/${id}`;
	try{
		await api.patch(patch_url, {
			id:id,
			create_payment:data.create_payment_switch,
			payment_type:data.payment_type.value
		});
		data.show_popup = false;
	}finally{
		data.disabled = false;
	}
	
	
}

onMounted(() => {
	const d = new Date();
	data.time_offset_minutes = -(d.getTimezoneOffset());
});

</script>