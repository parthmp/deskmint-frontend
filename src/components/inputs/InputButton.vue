<template>
	<div class="form-group">
		<button class="flex flex-col items-center p-[8px] px-[30px] m-auto text-white rounded-[5px] transition-all duration-300" :class="{'w-full' : local_full_width, 'active:scale-[0.97]': !local_disabled, 'bg-deskmint-original-dark': !local_disabled, 'hover:hover:bg-deskmint-original-dark-plus': !local_disabled, 'shadow-lg': !local_disabled, 'cursor-pointer': !local_disabled, 'opacity-80' :local_disabled,'dark:opacity-100': local_disabled, 'bg-deskmint-original-light': local_disabled}" :disabled="local_disabled" @click="emitSubmit">
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
		local_full_width:boolean
	}

	import common from '../../helpers/common';

	import { IconRotateClockwise2, IconSend, IconLogin2, IconLink } from '@tabler/icons-vue';

	import { defineComponent } from 'vue';

	export default defineComponent({

		name : 'InputButton',

		props : ['full_width', 'disabled', 'icon', 'btn_text'],

		data() : InputButtonIntarface {
			return {
				local_disabled: false,
				local_full_width: true
			};
		},

		components: {
			IconRotateClockwise2,
			IconSend,
			IconLink,
			IconLogin2
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
		}

	});

</script>