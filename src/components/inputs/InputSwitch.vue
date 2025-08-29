<template>
	<div class="form-group">
		<div class="switch cursor-pointer" @click="toggleSwitch">
			<div class="w-[50px] min-h-[25px] rounded-[6px] border border-1 relative overflow-hidden" :class="{'dark:border-deskmint-cyan border-deskmint-green-light':!input_value, 'dark:border-deskmint-green border-deskmint-cyan':input_value}">
				<span class="absolute block w-[25px] h-full transition-transform duration-300" :class="{'translate-x-0 rounded-l-[6px] bg-deskmint-green-light dark:bg-deskmint-cyan': !input_value, 'translate-x-[25px] rounded-r-[6px] dark:bg-deskmint-green-dark bg-deskmint-cyan': input_value}">

				</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">

	export interface InputSwitchInterface{
		input_value: boolean
	}

	import common from '../../helpers/common';

	import { defineComponent } from 'vue';

	export default defineComponent({

		name : 'InputSwitch',

		props : {
			modelValue : {
				type:Boolean
			}
		},

		data() : InputSwitchInterface {
			return {
				input_value: false,
			};
		},

		components: {

		},
		watch: {

		},

		computed : {

		},

		methods: {
			toggleSwitch() : void{
				this.input_value = !this.input_value;
				this.EmitModel();
			},
			EmitModel() : void{
				this.$emit('update:modelValue', this.input_value);
			}
		},

		mounted(){

			if(common.isset(this.modelValue)){
				this.input_value = this.modelValue;
			}
			this.EmitModel();
		}

	});

</script>