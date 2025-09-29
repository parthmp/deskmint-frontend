<template>
	<div class="p-1 pt-0" :class="{'overflow-y-auto overflow-x-auto max-h-[400px] styled-scrollbar': overflow}">
		<draggable group="fields" @start="true" @end="emitModel" v-model="data.rows" item-key="id" :animation="200">
			<template #item="{element, index}">
				<transition-group name="fade" tag="div">
					<div class="px-5 py-2 mt-3 rounded-xl shadow-sm outline-1 outline-deskmint-green-light dark:bg-deskmint-cyan-light" :key="element.id">
						<span class="float-start">
							<span class="col-span-4 lg:col-span-8 flex"><icon-grain class="inline-block" /><span class="grow">&nbsp;{{element.text}}</span></span>
						</span>
						<icon-trash v-if="delete" @click.prevent="removeRow(index)" class="float-end cursor-pointer text-red-500!"></icon-trash>
						<div class="clear-both"></div>
					</div>
				</transition-group>
			</template>
		</draggable>
	</div>
</template>
<script lang="ts" setup>

	import draggable from 'vuedraggable';
	import { IconGrain, IconTrash } from '@tabler/icons-vue';
	import { onMounted, reactive, watch } from 'vue';
	import common from '../../helpers/common';

	interface DraggableListInterface{
		rows : Array<object>
	}

	const props = defineProps({
		modelValue: Array<object>,
		delete : Boolean,
		overflow: Boolean
	});

	const emit = defineEmits<{
		'update:modelValue': [value: Array<object>],
		'deleted':[value: object]
	}>()
	
	/* data */
	const data = reactive<DraggableListInterface>({
		rows : []
	});

	/* methods */
	const hydrateVars = () : void => {
		if(common.isset(props.modelValue)){
			data.rows = props.modelValue ?? [];
		}
	}

	const emitModel = () : void => {
		emit('update:modelValue', data.rows);
	}

	const removeRow = (index:number) : void => {
		let temp_object = data.rows[index];
		data.rows.splice(index, 1);
		emit('deleted', temp_object);
	}

	/* watchers */
	watch(() => props.modelValue, () => {
		hydrateVars();
	});

	/* lifecycle hooks */
	onMounted(() : void => {
		hydrateVars();
	});

</script>