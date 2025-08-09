<template>
	<span>
		<div class="skeleton">

			<div class="lg:grid lg:grid-cols-12 gap-5">
				<div class="lg:col-span-4">
					<div class="h-[40px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
				</div>
				<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
					<div class="h-[40px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
				</div>
				<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
					<div class="h-[40px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
				</div>
			</div>

			<div class="lg:grid lg:grid-cols-12 gap-5">
				<div class="lg:col-span-4 mt-[20px]">
					<div class="h-[40px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
				</div>
				<div class="lg:col-span-4 mt-[20px]">
					<div class="h-[40px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
				</div>
				<div class="lg:col-span-4 mt-[20px]">
					<div class="h-[40px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
				</div>
			</div>

			<div class="lg:grid lg:grid-cols-12 gap-5">
				<div class="lg:col-span-6 mt-[20px]">
					<div class="h-[40px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
				</div>
				<div class="lg:col-span-6 mt-[20px]">
					<div class="h-[40px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
				</div>
			</div>

			<div class="mt-[20px]">
				<div class="h-[80px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
			</div>

			<div class="h-[40px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full lg:w-[150px] lg:float-end mt-[25px]"></div>
			<div class="clear-both"></div>

			
		</div>
	</span>
</template>

<script lang="ts">


	import { defineComponent } from 'vue';
	
	export default defineComponent({
		name : 'ClientsCustomFieldsCreateSkeleton',
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