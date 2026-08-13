<template>
	<div class="overflow-auto! max-h-60 relative">
		<table class="table">
			<thead>
				<tr class="sticky! w-full top-0">
					<td class="p-1" v-for="(header, hi) in props.headers" :key="hi">
						{{ header }}
					</td>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(obj,i) of props.data" :key="i">
					<td v-if="i === 0">
						<InputButton btn_text="Add" :full_width="false"></InputButton>
					</td>
					<td v-for="(obj2, k) in obj">
						{{ obj2 }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
<script lang="ts" setup>
	
import InputButton from '../inputs/InputButton.vue';

const props = defineProps(['headers', 'data']);

</script>