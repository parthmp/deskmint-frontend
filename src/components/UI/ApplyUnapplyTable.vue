<template>
		<Table>
			<template #headers>
				<tr class="sticky! w-full top-0">
					<td class="p-1" v-for="(header, hi) in data.headers" :key="hi">
						{{ header }}
					</td>
				</tr>
			</template>
			<template #body>
				<tr v-for="(obj,i) in props.data" :key="i">
					<td v-for="(obj2, k) in obj" :key="k">
						<span v-if="k === 'add' && props.mode !== 'edit'">
							<InputButton @click="() => addToApplied(obj)" btn_text="Add" :full_width="false"></InputButton>
						</span>
						<!-- <span v-if="k === 'add' && props.mode === 'edit'">
							<InputButton @click="() => allowAppliedEdit(obj)" btn_text="Edit" :full_width="false"></InputButton>
						</span> -->
						<span v-else-if="k === 'amount' && props.mode === 'add'">
							<InputNumber :max="props.max" @keyup.enter="() => addToApplied(obj)" v-model="obj[k]" placeholder="Amount" step="0.01"></InputNumber>
						</span>
						<span v-else-if="k === 'amount' && props.mode === 'edit'">
							<InputNumber :max="props.max" @keyup="() => modifyApplied(obj)" v-model="obj[k]" placeholder="Amount" step="0.01"></InputNumber>
						</span>
						<span v-else>
							{{ obj2 }}
						</span>
					</td>
				</tr>
			</template>
		</Table>
</template>

<script lang="ts" setup>

interface TableInterface{
	headers : Array<string>
}
	
import { onMounted, reactive } from 'vue';
import InputButton from '../inputs/InputButton.vue';
import common from '../../helpers/common.ts';
import Table from './Table.vue';
import InputNumber from '../inputs/InputNumber.vue';
import Decimal from 'decimal.js';
import { toastEvents } from '../../events/toastEvents.ts';

const props = defineProps(['data', 'max', 'mode']);

const emit = defineEmits(['apply', 'edit']);

const data = reactive<TableInterface>({
	headers : []
});

const generateHeaders = () : void => {
	if(typeof props.data[0] !== 'undefined'){
		for(const [key, value] of Object.entries(props.data[0])){
			data.headers.push(common.capitalizeFirstLetter(key.split('_').join(' ')));
		}
	}
	
}

const addToApplied = (obj) => {

	if(+obj.amount <= 0 || isNaN(+obj.amount)){
		return ;
	}

	const amount = new Decimal(obj.amount);
	const due = new Decimal(obj.due);

	if(!amount.greaterThan(due) && props.mode === 'add'){
		emit('apply', obj);
		return ;
	}

	// if(!amount.greaterThan(due) && props.mode === 'edit'){
	// 	emit('edit', obj);
	// 	return ;
	// }

	toastEvents.emit('toast',{
		type:'error',
		message : `You can not apply ${obj.amount} for this invoice`
	});
	
}
const modifyApplied = (obj) => {
	emit('edit', obj);
}
onMounted(() => {
	generateHeaders();
});

</script>