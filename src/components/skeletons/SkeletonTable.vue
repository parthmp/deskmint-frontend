<template>
	<span>
		<div class="table-skeleton">
			<div class="h-[50px] w-full lg:w-[150px] animate-pulse float-end">
				<div class="h-[38px] bg-deskmint-green-light rounded-lg w-full"></div>
			</div>
			<div class="clear-both mb-2"></div>
			<div class="h-[50px] lg:w-[150px] w-full animate-pulse float-start">
				<div class="h-[38px] rounded-lg bg-deskmint-green-light w-full"></div>
			</div>
			<div class="lg:ml-[25px] h-[50px] lg:w-[180px] w-full animate-pulse float-start">
				<div class="h-[38px] rounded-lg bg-deskmint-green-light w-full"></div>
			</div>
			<div class="h-[50px] lg:w-[350px] w-full animate-pulse float-end">
				<div class="h-[38px] rounded-lg bg-deskmint-green-light w-full"></div>
			</div>
			<div class="clear-both mb-2"></div>
			<div role="status" class="w-full animate-pulse">
				<div class="h-[38px] bg-deskmint-green-dark rounded-lg dark:bg-deskmint-green-dark w-full mb-2"></div>
				<div v-for="z in rows" :key="z" class="h-[38px] bg-deskmint-green-light rounded-lg dark:bg-deskmint-green-light w-full mb-1"></div>
				<div class="h-[38px] bg-deskmint-green-dark rounded-lg dark:bg-deskmint-green-dark w-full mb-2"></div>
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