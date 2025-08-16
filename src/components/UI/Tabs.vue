<template>
	<div class="tabs">
		<ul class="flex gap-2 flex-col lg:flex-row">
			<li v-for="(option, key) in options" :key="key"><a class="block border-1 border-solid border-transparent pl-4 lg:pl-8 pt-2 pr-4 lg:pr-8 pb-2 rounded-lg lg:rounded-none! lg:rounded-t-lg! bg-deskmint-green-light hover:bg-transparent hover:border-deskmint-green-light lg:border-b-0 transition-all duration-300" :class="{'tab-active': (key === local_active_tab_index)}" href="javascript:;" @click="setActiveTab(key)">{{ option }}</a></li>
		</ul>

		<div class="tab-content">
			<slot :name="`tab-${local_active_tab_index}`"></slot>
		</div>
	</div>
</template>

<script lang="ts">

	export interface TabsInterface{
		local_options : Array<object>,
		local_active_tab_index: number
	}

	import { defineComponent } from 'vue';
	import common from '../../helpers/common';
	
	export default defineComponent({
		name : 'Tabs',
		props: ['options', 'active_tab_index'],
		components : {

		},
		data(): TabsInterface{
			return {
				local_options : [],
				local_active_tab_index: 0
			}
		},
		watch:{
			active_tab_index() : void{
				this.local_active_tab_index = this.active_tab_index;
			}
		},
		methods : {
			
			resetTabs(callback:any) : void{
				this.local_active_tab_index = 0;
				callback();

			},

			setTabs() : void{
				
				if(common.isset(this.active_tab_index)){
					this.local_active_tab_index = this.active_tab_index;
				}

				if(common.isset(this.options)){
					this.local_options = this.options;
				}
				
				
			},

			setActiveTab(index:number) : void{
				this.resetTabs(() => {
					this.local_active_tab_index = index;
				});
			}

		},
		mounted : function(){

			this.setTabs();

		}

	});

</script>