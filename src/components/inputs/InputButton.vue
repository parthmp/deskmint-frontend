<template>
	<div class="form-group" :class="{'mt-0!':local_remove_margin}">
		<button class="p-[8px] px-[30px] m-auto text-white rounded-[5px] transition-all duration-300" :class="
			{
				'w-full' : local_full_width,
				'w-fit':!local_full_width,
				'active:scale-[0.92]': !local_disabled,
				'bg-deskmint-original-dark': !local_disabled && local_style_type === 'success',
				'hover:hover:bg-deskmint-original-dark-plus': !local_disabled && local_style_type === 'success',
				'bg-red-600': !local_disabled && local_style_type === 'error',
				'bg-blue-800': !local_disabled && local_style_type === 'info',
				'hover:hover:bg-deskmint-original-dark-plus': !local_disabled && local_style_type === 'success',
				'hover:hover:bg-red-700': !local_disabled && local_style_type === 'error',
				'hover:hover:bg-blue-900': !local_disabled && local_style_type === 'info',
				'shadow-lg': !local_disabled,
				'cursor-pointer': !local_disabled,
				'opacity-80' :local_disabled,
				'dark:opacity-100': local_disabled,
				'bg-deskmint-original-light': local_disabled,
				'flex':local_full_width,
				'flex-col':local_full_width,
				'items-center':local_full_width
			}
			" :disabled="local_disabled" @click="emitSubmit">
			<span v-if="!local_disabled" class="flex gap-1 items-center"><component :is="icon" :size="17"></component>&nbsp;{{ btn_text }}</span>
			<IconRotateClockwise2 v-if="local_disabled" class="animate-spin" :size="26"></IconRotateClockwise2>
		</button>
	</div>
</template>

<style>

</style>

<script lang="ts">

	export interface InputButtonIntarface{
		local_disabled:boolean,
		local_full_width:boolean,
		local_style_type:string,
		local_remove_margin:boolean
	}

	import common from '../../helpers/common';

	import { IconRotateClockwise2, IconSend, IconLogin2, IconLink, IconCaretLeft, IconRepeat, IconKey, IconCaretRight, IconCheck, IconX } from '@tabler/icons-vue';

	import { defineComponent } from 'vue';

	export default defineComponent({

		name : 'InputButton',

		props : ['full_width', 'disabled', 'icon', 'btn_text', "style_type", "remove_margin"],

		data() : InputButtonIntarface {
			return {
				local_disabled: false,
				local_full_width: true,
				local_style_type: 'success',
				local_remove_margin: false
			};
		},

		components: {
			IconRotateClockwise2,
			IconSend,
			IconLink,
			IconLogin2,
			IconCaretLeft,
			IconCaretRight,
			IconKey,
			IconCheck,
			IconX,
			IconRepeat
		},

		watch: {
			disabled() : void{
				this.setDisabled();
			}
		},

		methods: {
			emitSubmit() : void{
				this.$emit('submit', true);
			},
			setDisabled() : void{
				
				if(common.isset(this.disabled)){
					this.local_disabled = this.disabled;
				}
			}
		},

		mounted(){
			this.setDisabled();

			if(common.isset(this.full_width)){
				this.local_full_width = this.full_width;
			}

			if(common.isset(this.style_type)){
				this.local_style_type = this.style_type;
			}

			if(common.isset(this.remove_margin)){
				this.local_remove_margin = this.remove_margin;
			}

		}

	});

</script>