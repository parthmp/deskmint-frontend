<template>
	<div class="form-group" ref="dropdownWrapper">
	
		<button id="dropdown_default" class="transition-all duration-300 flex gap-1 items-center bg-deskmint-original-dark text-white py-[7px] px-[15px] rounded-lg w-full lg:w-[initial] cursor-pointer hover:hover:bg-deskmint-original-dark-plus" data-dropdown-toggle="dropdown" type="button" @click="show_menu = !show_menu"> {{ modelValue }} <span class="transition-all duration-300" :class="{'rotate-180':show_menu}"><IconChevronDown :size="22"></IconChevronDown></span></button>
		<transition name="fade-scale">
			<div v-if="show_menu" id="dropdown" class="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-[75%] lg:w-44 dark:bg-gray-700">
				<ul class="dropdown_ul bg-background-2" aria-labelledby="dropdown_default">
					<li v-for="(option, i) in options" class="group hover:bg-deskmint-green-light rounded-lg" :key="i"><a href="javascript:;" @click="updatePerPage(option)" class="text-default-text! group-hover:text-deskmint-green-dark!">{{ option }}</a></li>
				</ul>
			</div>
		</transition>
	</div>
</template>

<style scoped>
	@reference "tailwindcss/theme";
	.dropdown_ul{
		@apply p-[10px] rounded-lg shadow-lg;
	}
	.dropdown_ul li a{
		@apply block p-[10px] transition-all duration-300;
	}
	.dropdown_ul li{
		@apply transition-all duration-300;
	}
</style>

<script lang="ts">

	export interface InputEmailInterface{
		input_value: string,
		show_menu:boolean
	}

	import common from '../../helpers/common';

	import { defineComponent } from 'vue';
	import { IconChevronDown } from '@tabler/icons-vue';

	export default defineComponent({

		name : 'InputDropdown',

		props : ['options', 'modelValue'],

		data() : InputEmailInterface {
			return {
				input_value: '',
				show_menu: false
			};
		},

		components: {
			IconChevronDown
		},

		watch: {
			
		},

		computed : {
			
		},

		methods: {
			
			updatePerPage(pp:number) : void{
				this.$emit('update:modelValue', pp);
				this.$emit('changed', pp);
				this.show_menu = false;
			},
			sanitizeInput(in_string:string) : string{
				return common.stripTags(common.sanitize(in_string));
			},
			handleClickOutside(e: MouseEvent) {
				const target = e.target as Node;
				const dropdownWrapper = this.$refs.dropdownWrapper as HTMLElement;
				if (dropdownWrapper && !dropdownWrapper.contains(target)) {
					this.show_menu = false;
				}
			}
			
		},

		mounted(){
			document.addEventListener('click', this.handleClickOutside);
		},
		beforeUnmount() {
			document.removeEventListener('click', this.handleClickOutside);
		}

	});

</script>