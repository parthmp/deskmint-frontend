<template>
	<span>
		<div class="skeleton">

			<div v-for="(row, index) in  rows" :key="index" class="px-5 py-2 mt-3 rounded-xl shadow-sm outline-1 outline-deskmint-green-light dark:bg-deskmint-cyan-light  animate-[pulse_1s_ease-in-out_infinite]">
				<span class="grid grid-cols-12 gap-1">
					<span class="col-span-4 lg:col-span-8 h-[22px]"></span>
					<span class="col-span-4 lg:col-span-2 m-auto"></span>
					<span class="col-span-4 lg:col-span-2 m-auto"></span>
				</span>
			</div>

			
		</div>
	</span>
</template>

<script lang="ts">


	import { defineComponent } from 'vue';
	
	export default defineComponent({
		name : 'ArragneColumnsSkeleton',
		props: {
			rows:Number
		},
		components : {

		},
		data: function(){
			return {
				
			}
		},
		methods : {
			
		},
		mounted : function(){

			
		}

	});

</script>