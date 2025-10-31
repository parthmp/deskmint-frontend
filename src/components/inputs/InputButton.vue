<template>
	<div class="form-group" :class="{'mt-0!': local_remove_margin}">
		<component :is="url ? 'router-link' : 'button'" :to="url" :disabled="local_disabled" :type="local_type" :class="buttonClasses" @click="emitSubmit(url)">
			<span v-if="icon === 'IconCaretRight'">
				<span v-if="!local_disabled" class="flex gap-1 items-center">
					{{ btn_text ? btn_text : label }}&nbsp;<component :is="icon" :size="17"></component>
				</span>
				<span v-if="local_disabled" class="flex gap-1 items-center">
					{{ btn_text ? btn_text : label }}&nbsp;<IconRotateClockwise2 v-if="local_disabled" class="animate-spin" :size="17"></IconRotateClockwise2>
				</span>
			</span>
			<span v-if="icon !== 'IconCaretRight'">
				<span v-if="!local_disabled" class="flex gap-1 items-center">
					<component :is="icon" :size="17"></component>&nbsp;{{ btn_text ? btn_text : label }}
				</span>
				<span v-if="local_disabled" class="flex gap-1 items-center">
					<IconRotateClockwise2 v-if="local_disabled" class="animate-spin" :size="17"></IconRotateClockwise2>&nbsp;{{ btn_text ? btn_text : label }}
				</span>
			</span>
		</component>
	</div>
</template>


<style scoped>
.disabled_url {
    pointer-events: none;
    color: #999;
    cursor: not-allowed;
    text-decoration: none;
}
</style>

<script lang="ts">

	export interface InputButtonIntarface{
		local_disabled:boolean,
		local_full_width:boolean,
		local_style_type:string,
		local_remove_margin:boolean,
		local_type:string
	}

	import common from '../../helpers/common';

	import { IconRotateClockwise2, IconSend, IconLogin2, IconLink, IconCaretLeft, IconRepeat, IconKey, IconCaretRight, IconCheck, IconX, IconPlus, IconColumns3, IconPhoto, IconSquarePlus2, IconRefresh, IconEye } from '@tabler/icons-vue';

	import { defineComponent } from 'vue';

	export default defineComponent({

		name : 'InputButton',

		props : ['full_width', 'disabled', 'icon', 'btn_text', "style_type", "remove_margin", "url", "max_height", "min_width", "label", "type"],

		data() : InputButtonIntarface {
			return {
				local_disabled: false,
				local_full_width: true,
				local_style_type: 'success',
				local_remove_margin: false,
				local_type: 'submit'
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
			IconPlus,
			IconRepeat,
			IconColumns3,
			IconPhoto,
			IconSquarePlus2,
			IconRefresh,
			IconEye
		},

		watch: {
			disabled() : void{
				this.setDisabled();
			}
		},

		methods: {
			emitSubmit(url:any) : void{
				if(!common.isset(url)){
					this.$emit('submit', true);
				}
			},
			setDisabled() : void{
				
				if(common.isset(this.disabled)){
					this.local_disabled = this.disabled;
				}
			}
		},

		computed: {

			componentType() {
				return this.url ? 'router-link' : 'button';
			},

			buttonClasses(){

				const base_classes = 'p-[8px] px-[20px] m-auto text-white rounded-[5px] transition-all duration-300 w-full';
				
				const conditional_classes = {
					'max-h-[41px]' : this.max_height,
					'min-w-[140px]':this.min_width,

					'lg:w-full': this.local_full_width,
					'lg:w-fit': !this.local_full_width,
					
					
					'active:scale-[0.92]': !this.local_disabled,
					'shadow-lg': !this.local_disabled,
					'cursor-pointer': !this.local_disabled,
					
					
					'bg-gradient-to-r': !this.local_disabled && this.local_style_type === 'success',
					'from-deskmint-cyan': !this.local_disabled && this.local_style_type === 'success',
					'to-deskmint-original-dark': !this.local_disabled && this.local_style_type === 'success',
					'bg-red-600': !this.local_disabled && this.local_style_type === 'error',
					'bg-blue-800': !this.local_disabled && this.local_style_type === 'info',
					
					
					'hover:bg-gradient-to-l': !this.local_disabled && this.local_style_type === 'success',
					'hover:from-deskmint-original-dark-plus': !this.local_disabled && this.local_style_type === 'success',
					'hover:to-deskmint-original-dark-plus': !this.local_disabled && this.local_style_type === 'success',
					'hover:shadow-none': !this.local_disabled && this.local_style_type === 'success',
					
					'hover:bg-red-700': !this.local_disabled && this.local_style_type === 'error',
					'hover:bg-blue-900': !this.local_disabled && this.local_style_type === 'info',
					
					
					'opacity-80': this.local_disabled,
					'dark:opacity-100': this.local_disabled,
					'bg-deskmint-original-light': this.local_disabled,
					
					
					'flex': this.local_full_width,
					'flex-col': this.local_full_width,
					'items-center': this.local_full_width,
					
					
					'disabled_url': this.url && this.local_disabled,
					'text-white!': this.url

				};

				return [base_classes, conditional_classes];

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

			if(common.isset(this.type)){
				this.local_type = this.type;
			}

		}

	});

</script>