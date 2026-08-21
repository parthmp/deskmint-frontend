<template>
		<Table>
			<template #headers>
				<tr class="sticky! w-full top-0">
					<template v-for="(header, hi) in props.headers" :key="hi" >
						<th v-if="((header.toLocaleLowerCase() !== 'allowed' && props.mode === 'add') || (props.mode === 'edit'))">
							
							{{ header }}
							
						</th>
					</template>
				</tr>
			</template>
			<template #body>
				
				<tr v-if="!props.searching" v-for="(obj,i) in props.data" :key="i">
					<template v-for="(obj2, k) in obj" :key="k">
						<template v-if="((k !== 'allowed' && props.mode === 'add') || (props.mode === 'edit'))">
							<td v-if="k !== 'show_text_input'">
								<span>
									<span v-if="k === 'add' && props.mode === 'add'">
										<InputButton @click="() => addToApplied(obj, 'apply')" btn_text="Add" :full_width="false"></InputButton>
									</span>
									<span v-if="k === 'add' && props.mode === 'edit'" class="flex gap-10">
										<IconCheck v-if="obj.show_text_input" class="float-end text-green-500! cursor-pointer" @click="() => modifyToApplied(obj)"></IconCheck>
										<IconEdit v-if="!obj.show_text_input" @click.prevent="showInput(obj)" class="float-end text-blue-500! cursor-pointer"></IconEdit>
										<IconTrash class="float-end text-red-500! cursor-pointer" @click="removeApplied(obj)"></IconTrash>
									</span>
									
									<span v-else-if="k === 'amount' && props.mode === 'add'">
										<InputNumber :max="props.max" @keyup.enter="() => addToApplied(obj, 'apply')" v-model="obj[k]" placeholder="Amount" step="0.01"></InputNumber>
									</span>
									
									<span v-else>
										<span v-if="props.mode === 'edit'">
											<span v-if="!obj.show_text_input && k === 'amount'">
												{{ obj2 }}
											</span>
											<span v-else-if="k !== 'amount'">
												{{ obj2 }}
											</span>
											<span v-if="k === 'amount' && obj.show_text_input">
												<InputNumber :max="props.max" @keyup.enter="() => modifyToApplied(obj)" v-model="obj[k]" placeholder="Amount" step="0.01"></InputNumber>
											</span>
										</span>
										<span v-if="props.mode === 'add'">
											{{ obj2 }}
										</span>
										
									</span>
									
								</span>
							</td>
						</template>
					</template>
				</tr>
				<tr v-if="props.data.length === 0 && !props.searching">
					<td colspan="100">
						<p class="text-center">
							No data found
						</p>
					</td>
				</tr>
				<tr v-if="props.searching" v-for="n in 15" :key="n">
					<td colspan="100" class="p-0!">
						<div class="h-[45px]! animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full p-0"></div>
					</td>
				</tr>
			</template>
		</Table>
</template>

<script lang="ts" setup>

type TableRow = {
	id : number,
	invoice : string,
	total : string,
	due : string,
	allowed : string,
	amount : string,
	add: string,
	show_text_input:boolean
};

interface PropsInterface {
	headers: Array<string>,
	data: Array<TableRow>,
	max: string|number,
	mode: string,
	searching: boolean
}


import InputButton from '../inputs/InputButton.vue';
import Table from './Table.vue';
import InputNumber from '../inputs/InputNumber.vue';
import Decimal from 'decimal.js';
import { toastEvents } from '../../events/toastEvents.ts';
import { IconTrash } from '@tabler/icons-vue';
import { IconCheck } from '@tabler/icons-vue';
import { IconEdit } from '@tabler/icons-vue';

const props = defineProps<PropsInterface>();

const emit = defineEmits(['apply', 'edit', 'modify_amount_left', 'remove']);


const addToApplied = (obj:TableRow, mode:string) : void => {

	if(+obj.amount <= 0 || isNaN(+obj.amount)){
		return ;
	}

	const amount = new Decimal(obj.amount);
	const allowed = new Decimal(obj.allowed);

	if(!amount.greaterThan(allowed)){
		emit(mode, obj);
		return ;
	}

	toastEvents.emit('toast',{
		type:'error',
		message : `You can not apply ${obj.amount} for this invoice`
	});
	
}

const showInput = (obj:TableRow) : void => {
	obj.show_text_input = true;
	emit('modify_amount_left', obj.amount);
}
const removeApplied = (obj:TableRow) : void => {
	emit('remove', obj);
}
const modifyToApplied = (obj:TableRow) : void => {
	addToApplied(obj, 'edit');
}


</script>