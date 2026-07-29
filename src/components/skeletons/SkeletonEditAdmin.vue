<template>
	<span>
		<div class="skeleton">

			<div class="grid grid-cols-12 gap-5">
				<div class="col-span-12 lg:col-span-6">
					<div class="h-[40px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
				</div>
				<div class="col-span-12 lg:col-span-6">
					<div class="h-[40px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
				</div>
			</div>
			
			<div class="grid grid-cols-12 gap-5 mt-[20px]">
				<div class="col-span-12 lg:col-span-6">
					<div class="h-[40px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
				</div>
				<div class="col-span-12 lg:col-span-6">
					<div class="h-[40px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
				</div>
			</div>

			<LoginSettingsSkeleton></LoginSettingsSkeleton>
			
			
		</div>
	</span>
</template>

<script lang="ts">


	import { defineComponent } from 'vue';
	import LoginSettingsSkeleton from './LoginSettingsSkeleton.vue';
	
	export default defineComponent({
		name : 'SkeletonEditAdmin',
		props: {
			rows:Number
		},
		components : {
			LoginSettingsSkeleton:LoginSettingsSkeleton
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