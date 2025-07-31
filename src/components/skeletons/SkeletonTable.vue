<template>
	<span>
		<div class="table-skeleton">
			<div class="h-[50px] w-full lg:w-[150px] animate-[pulse_1s_ease-in-out_infinite] float-end">
				<div class="h-[38px] bg-deskmint-loading rounded-lg w-full"></div>
			</div>
			<div class="clear-both mb-2"></div>
			<div class="h-[50px] lg:w-[150px] w-full animate-[pulse_1s_ease-in-out_infinite] float-start">
				<div class="h-[38px] rounded-lg bg-deskmint-loading w-full"></div>
			</div>
			<div class="lg:ml-[25px] h-[50px] lg:w-[180px] w-full animate-[pulse_1s_ease-in-out_infinite] float-start">
				<div class="h-[38px] rounded-lg bg-deskmint-loading w-full"></div>
			</div>
			<div class="h-[50px] lg:w-[350px] w-full animate-[pulse_1s_ease-in-out_infinite] float-end">
				<div class="h-[38px] rounded-lg bg-deskmint-sage-loading w-full"></div>
			</div>
			<div class="clear-both mb-2"></div>
			<div role="status" class="w-full">
				<div class="h-[38px] bg-deskmint-cyan rounded-lg w-full mb-2 animate-[pulse_3s_ease-in-out_infinite]"></div>
				<div v-for="z in rows" :key="z" class="h-[42px] animate-[pulse_0.9s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full mb-2 shadow-sm"></div>
				<div class="h-[38px] bg-deskmint-cyan rounded-lg w-full mb-2"></div>
			</div>
		</div>
	</span>
</template>

<script lang="ts">


	import { defineComponent } from 'vue';
	
	export default defineComponent({
		name : 'SkeletonTable',
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