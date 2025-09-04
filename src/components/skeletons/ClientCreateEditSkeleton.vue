<template>
	<span>
		<div class="skeleton">

			<div class="tabs">
				<ul class="flex gap-2 flex-col xl:flex-row">
					<li v-for="(option, key) in 5" :key="key"><a class="block border-1 cursor-default border-solid border-transparent pl-4 lg:pl-8 pt-2 pr-4 lg:pr-8 pb-2 rounded-lg lg:rounded-none! lg:rounded-t-lg! bg-deskmint-green-light lg:border-b-0 transition-all duration-300 xl:w-[150px] w-[100%] h-[42px] animate-[pulse_1s_ease-in-out_infinite]" href="javascript:;"></a></li>
				</ul>

				<div class="tab-content mt-[20px]">
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
				<div class="h-[40px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full lg:w-[150px] lg:float-end mt-[25px]"></div>
				<div class="clear-both"></div>
			</div>

			
		</div>
	</span>
</template>

<script lang="ts">


	import { defineComponent } from 'vue';
	
	export default defineComponent({
		name : 'ClientCreateEditSkeleton',
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