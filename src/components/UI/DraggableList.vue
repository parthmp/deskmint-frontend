<template>
	<div class="mt-4 overflow-auto styled-scrollbar p-1 pt-0">
		<draggable group="fields" @start="true" @end="emitModel" v-model="data.rows" item-key="id" :animation="200">
			<template #item="{element, index}">
				<transition-group name="fade" tag="div">
					<div class="px-5 py-2 mt-3 rounded-xl shadow-sm outline-1 outline-deskmint-green-light dark:bg-deskmint-cyan-light" :key="element.id">
						<span class="grid grid-cols-12 gap-1">
							<span class="col-span-4 lg:col-span-8"><icon-grain class="inline-block" />&nbsp;{{element.text}}</span>
						</span>
					</div>
				</transition-group>
			</template>
		</draggable>
	</div>
</template>
<script lang="ts" setup>

	import draggable from 'vuedraggable';
	import { IconGrain } from '@tabler/icons-vue';
	import { onMounted, reactive, watch } from 'vue';
	import common from '../../helpers/common';

	interface DraggableListInterface{
		rows : Array<object>
	}

	const props = defineProps({
		modelValue: Array<object>
	});

	const emit = defineEmits<{
		'update:modelValue': [value: Array<object>]
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

	/* watchers */
	watch(() => props.modelValue, () => {
		hydrateVars();
	});

	/* lifecycle hooks */
	onMounted(() : void => {
		hydrateVars();
	});

</script>