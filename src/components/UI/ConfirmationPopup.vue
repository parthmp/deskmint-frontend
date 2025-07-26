<template>
	<div class="absolute top-0 left-0 w-[100%]! bg-background-2-tra z-40" v-show="show_popup" :class="{'h-[100vh]':local_blocker}" @click.self="selfClick">
		<div class="delete-popup outline-2 outline-deskmint-green-light bg-background-2  left-1/2 lg:-translate-x-1/2" :class="{'top-40':!local_blocker, 'top-2/10':local_blocker}">
			<IconX class="float-end cursor-pointer" @click="closePopup(false)" :size="22"></IconX>
			<div class="clear-both"></div>
			<h1>{{ local_confirm_text }}</h1>
			<br>
			<div class="grid grid-cols-2 gap-5">
				<input-button btn_text="Yes" :full_width="true" icon="IconCheck" style_type="success" @click="closePopup(true)"></input-button>
				<input-button btn_text="No" :full_width="true" icon="IconX" style_type="error" @click="closePopup(false)" :remove_margin="true"></input-button>
			</div>
		</div>
	</div>
</template>
<style scoped>
	@reference "tailwindcss/theme";
	.delete-popup{
		@apply sticky w-[95%] m-[25px] lg:w-[25%] p-[25px] rounded-lg shadow-lg ;
	}
	.delete-popup h1{
		@apply text-2xl text-center;
	}
	
</style>
<script lang="ts">
	
	import { defineComponent } from 'vue';
	import common from '../../helpers/common';

	import InputButton from '../inputs/InputButton.vue';

	import { IconX } from '@tabler/icons-vue';


	export interface ConfirmationPopupInterface{
		local_confirm_text:string,
		local_blocker:boolean,
		local_scrollable:boolean
		local_close_outside:boolean,
		outside_click_handler:any
	}
	
	export default defineComponent({
		name : 'ConfirmationPopup',
		components : {
			InputButton,
			IconX
		},
		props : {
			confirm_text: String,
			show_popup:Boolean,
			blocker:Boolean,
			scrollable:Boolean,
			close_outside:Boolean
		},
		emits: ['update:show_popup', 'closed'],
		data(): ConfirmationPopupInterface{
			return {
				local_confirm_text : '',
				local_blocker: true,
				local_scrollable:true,
				local_close_outside: true,
				outside_click_handler: null
			}
		},
		methods : {

			selfClick() : void{
				if(this.local_close_outside){
					this.closePopup();
				}
			},
			
			closePopup(value:boolean) : void{
				this.$emit('update:show_popup', false);
				this.$emit('closed', {
					closed: true,
					value
				});
			},
			handleScrollable() : void{
				if(common.isset(this.scrollable)){
					this.local_scrollable = this.scrollable;
					if(!this.local_scrollable && this.show_popup){
						document.body.style.overflow = 'hidden';
					}else{
						document.body.style.overflow = '';
					}
				}
			}
		},
		watch : {
			blocker() : void{
				this.local_blocker = this.blocker;
			},
			close_outside() : void{
				this.local_close_outside = this.close_outside;
			},
			scrollable() : void{
				this.handleScrollable();
			},
			show_popup() : void{
				this.handleScrollable();
			}
		},
		
		mounted : function(){
			
			if(common.isset(this.confirm_text)){
				this.local_confirm_text = this.confirm_text || '';
			}

			if(common.isset(this.close_outside)){
				this.local_close_outside = this.close_outside;
			}

			this.handleScrollable();
			if(common.isset(this.blocker)){
				this.local_blocker = this.blocker;
			}

			
			
		},

		beforeUnmount(){
			if (this.outside_click_handler) {
				document.removeEventListener('click', this.outside_click_handler);
				this.outside_click_handler = null;
			}
			document.body.style.overflow = '';
		}

	});

</script>