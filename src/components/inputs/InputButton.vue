<template>
	<div class="form-group">
		<button class="flex flex-col items-center w-full bg-deskmint-original-dark hover:hover:bg-deskmint-original-dark-plus shadow-lg p-[8px] px-[30px]  m-auto active:scale-[0.97] text-white rounded-[5px] cursor-pointer transition-all duration-300" :disabled="disabled" @click="emitSubmit">
			<span v-if="!disabled" class="flex gap-1 items-center"><component :is="icon" :size="17"></component>&nbsp;Login</span>
			<IconRotateClockwise2 v-if="disabled" class="animate-spin" :size="30"></IconRotateClockwise2>
		</button>
	</div>
</template>

<style>

</style>

<script lang="ts">

	export interface InputButtonIntarface{
		icon:string,
		disabled:boolean
	}

	import { IconRotateClockwise2, IconSend } from '@tabler/icons-vue';

	import { defineComponent } from 'vue';

	export default defineComponent({

		name : 'InputButton',

		props : ['full_width'],

		data() : InputButtonIntarface {
			return {
				icon : '',
				disabled: false
			};
		},

		components: {
			IconRotateClockwise2,
			IconSend
		},

		methods: {
			emitSubmit() : void{
				this.$emit('submit', true);
			}
		}

	});

</script>