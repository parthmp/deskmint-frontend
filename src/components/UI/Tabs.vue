<template>
	<div class="tabs">
		<ul class="flex gap-2 flex-col lg:flex-row">
			<li v-for="(option, key) in options" :key="key"><a class="block border-1 border-solid border-transparent pl-4 lg:pl-8 pt-2 pr-4 lg:pr-8 pb-2 rounded-lg lg:rounded-none! lg:rounded-t-lg! bg-deskmint-green-light lg:border-b-0 transition-all duration-300" :class="{'tab-active': (key === local_active_tab_index), 'hover:bg-transparent hover:border-deskmint-green-light': is_item_can_be_active(key), 'cursor-not-allowed': !is_item_can_be_active(key)}" href="javascript:;" @click="setActiveTab(key)">{{ option }}</a></li>
		</ul>

		<div class="tab-content mt-[20px]">
			<slot :name="`tab-${local_active_tab_index}`"></slot>
		</div>
	</div>
</template>

<script lang="ts">

	export interface TabsInterface{
		local_options : Array<object>,
		local_active_tab_index: number,
		activated_indexes: Array<number>
	}

	import { defineComponent } from 'vue';
	import common from '../../helpers/common';
	
	export default defineComponent({
		name : 'Tabs',
		props: ['options', 'active_tab_index', 'disable_further'],
		components : {

		},
		data(): TabsInterface{
			return {
				local_options : [],
				local_active_tab_index: 0,
				activated_indexes : []
			}
		},
		watch:{
			active_tab_index() : void{
				console.log('fired');
				this.local_active_tab_index = this.active_tab_index;
				if(this.disable_further === true){
					this.activated_indexes.push(this.local_active_tab_index);
				}
			}
		},
		computed: {
			
		},
		methods : {
			is_item_can_be_active(index:number) : boolean{
				if(this.disable_further === true){
					if(this.activated_indexes.includes(index)){
						return true;
					}
					return false;
				}
				return true;
			},

			setTabs() : void{
				
				if(common.isset(this.active_tab_index)){
					this.local_active_tab_index = this.active_tab_index;
					if(this.disable_further === true){
						this.activated_indexes.push(this.active_tab_index);
					}
				}

				if(common.isset(this.options)){
					this.local_options = this.options;
				}
				
				
			},

			setActiveTab(index:number) : void{
				if(this.disable_further !== true){
					this.local_active_tab_index = index;
				}else if(this.disable_further === true){
					if(this.activated_indexes.includes(index)){
						this.local_active_tab_index = index;
					}
				}

				this.emitTabChanged(this.local_active_tab_index);

			},

			emitTabChanged(index:number) : void{
				this.$emit('tab-changed', index);
			}

		},
		mounted : function(){

			this.setTabs();

		}

	});

</script>