<template>
	<div class="tabs" :class="{'grid grid-cols-12 gap-5':!horizontal}">
		<ul :class="{'flex gap-2 flex-col xl:flex-row': horizontal, 'col-span-12 xl:col-span-2':!horizontal}">
			<li v-for="(option, key) in options" :key="key">
				
				<a v-if="!routes_available" class="block border-1 border-solid border-transparent pl-4 lg:pl-8 pt-2 pr-4 lg:pr-8 pb-2 rounded-lg lg:rounded-none bg-deskmint-green-light transition-all duration-300" :class="{'lg:border-b-0! tab-active-h': (key === local_active_tab_index && horizontal), 'hover:bg-transparent hover:border-deskmint-green-light': is_item_can_be_active(key), 'cursor-not-allowed': !is_item_can_be_active(key), 'mb-[10px] lg:rounded-lg!':!horizontal, 'lg:rounded-t-lg! border-b-0':horizontal, 'tab-active-v':  (key === local_active_tab_index && !horizontal)}" href="javascript:;" @click="setActiveTab(key)">{{ option }}</a>

				<router-link :to="routes_path+'/'+option.split(' ').join('-').toLowerCase()" v-if="routes_available" class="block border-1 border-solid border-transparent pl-4 lg:pl-8 pt-2 pr-4 lg:pr-8 pb-2 rounded-lg lg:rounded-none bg-deskmint-green-light transition-all duration-300" :class="{'lg:border-b-0! tab-active-h': (key === local_active_tab_index && horizontal), 'hover:bg-transparent hover:border-deskmint-green-light': is_item_can_be_active(key), 'cursor-not-allowed': !is_item_can_be_active(key), 'mb-[10px] lg:rounded-lg!':!horizontal, 'lg:rounded-t-lg! border-b-0':horizontal, 'tab-active-v':  isRouteActive(option)}">{{ option }}</router-link>

			</li>
		</ul>

		<div v-if="!routes_available" class="tab-content" :class="{'col-span-12 xl:col-span-10':!horizontal, 'mt-[20px]' : horizontal}">
			<slot :name="`tab-${local_active_tab_index}`"></slot>
		</div>
		<div v-if="routes_available" class="tab-content" :class="{'col-span-12 xl:col-span-10':!horizontal, 'mt-[20px]' : horizontal}">
			<slot name="whole_content"></slot>
		</div>
	</div>
</template>

<script lang="ts">

	export interface TabsInterface{
		local_options : Array<object>,
		local_active_tab_index: number,
		activated_indexes: Array<number>,
		is_locked:boolean,
		routes_available : boolean,
		routes_path : string
	}

	import { defineComponent } from 'vue';
	import common from '../../helpers/common';
	
	export default defineComponent({
		name : 'Tabs',
		props: ['options', 'active_tab_index', 'disable_further', 'horizontal', 'routing'],
		components : {

		},
		data(): TabsInterface{
			return {
				local_options : [],
				local_active_tab_index: 0,
				activated_indexes : [],
				is_locked: false,
				routes_available: false,
				routes_path: ''
			}
		},
		watch:{
			active_tab_index() : void{
				this.local_active_tab_index = this.active_tab_index;
				this.is_locked = true;
				if(this.disable_further === true){
					this.activated_indexes.push(this.local_active_tab_index);
					this.is_locked = false;
				}
			}
		},
		computed: {
			
		},
		methods : {
			isRouteActive(option_text:string) : boolean{

				if(this.routes_available){
					let option_text_modified = option_text.split(' ').join('-').toLowerCase().trim();
					let path_array = this.$route.path.split('/');
					path_array = path_array.filter(item => typeof item === 'string' ? item.trim() !== '' : true);

					return option_text_modified === path_array[path_array.length-1] || option_text_modified === path_array[path_array.length-2];
				}

				return false;
			},
			is_item_can_be_active(index:number) : boolean{
				this.is_locked = true;
				if(this.disable_further === true){
					if(this.activated_indexes.includes(index)){
						this.is_locked = false;
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
						this.is_locked = true;
						this.activated_indexes.push(this.active_tab_index);
					}else{
						this.is_locked = false;
					}
				}

				if(common.isset(this.options)){
					this.local_options = this.options;
				}

				if(common.isset(this.routing)){
					if(this.routing !== ''){
						this.routes_available = true;
						this.routes_path = this.routing;
					}
				}
				
				
			},

			setActiveTab(index:number) : void{
				if(this.disable_further !== true){
					this.is_locked = false;
					this.local_active_tab_index = index;
				}else if(this.disable_further === true){
					this.is_locked = true;
					if(this.activated_indexes.includes(index)){
						this.local_active_tab_index = index;
						this.is_locked = false;
					}
				}

				this.emitTabChanged(this.local_active_tab_index);

			},

			emitTabChanged(index:number) : void{
				this.$emit('tab-changed', index, this.is_locked);
			}

		},
		mounted : function(){

			this.setTabs();

		}

	});

</script>