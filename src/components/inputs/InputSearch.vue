<template>
	<!--<div class="form-group">
		<input type="text" name="" placeholder="123" id="">
			
	</div>-->
	<div class="form-group flex items-center search-wrapper rounded-[5px] focus-within:shadow-lg">
		<label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
		<div class="relative grow">
			<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
				<IconSearch class="ml-[10px] w-5 h-5 text-default-text"></IconSearch>
			</div>
			
			<input 
				
				type="text" 
				id="default-search" 
				v-model="searchValue"
				@input="updateValue"
				class="block w-full !pl-10 pr-12 py-3 border rounded-[5px]" 
				placeholder="Search" 
			/>

			
			
			<button 
				v-if="!use_default_x && searchValue && searchValue.length > 0"
				@click="clearSearch"
				type="button"
				class="absolute inset-y-0 right-0 flex items-center pr-3 text-deskmint-green-dark transition-colors focus:outline-none">
				<IconX class="w-5 h-5" />
			</button>
		</div>
	</div>
</template>

<style scoped>

</style>

<script lang="ts">
export interface InputSearchInterface {
	searchValue: string;
	use_default_x: boolean;
}

import common from '../../helpers/common';
import { defineComponent } from 'vue';
import { IconSearch, IconX } from '@tabler/icons-vue';

export default defineComponent({
	name: 'InputSearch',
	
	props: {
		modelValue: {
			type: String,
			default: ''
		},
		use_default_x: {
			type: Boolean,
			default: false
		}
	},
	
	emits: ['update:modelValue'],
	
	data(): InputSearchInterface {
		return {
			searchValue: this.modelValue || '',
			use_default_x: this.use_default_x
		};
	},

	components: {
		IconSearch,
		IconX
	},

	watch: {
		modelValue(newVal: string) {
			this.searchValue = newVal;
		}
	},

	methods: {
		updateValue(): void {
			const sanitizedValue = this.sanitizeInput(this.searchValue);
			this.$emit('update:modelValue', sanitizedValue);
		},
		
		clearSearch(): void {
			this.searchValue = '';
			this.$emit('update:modelValue', '');
			this.$nextTick(() => {
				const input = this.$el.querySelector('#default-search') as HTMLInputElement;
				if (input) input.focus();
			});
		},
		
		sanitizeInput(in_string: string): string {
			return common.stripTags(common.sanitize(in_string));
		}
	}
});
</script>