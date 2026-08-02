<template>
	<span>
		<div class="skeleton" v-for="(looper) in 2" :key="looper">
			
			<div class="lg:grid lg:grid-cols-12 gap-5">
				<div class="lg:col-span-4">
					<div class="h-[25px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
				</div>
				<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
					<div class="h-[25px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
				</div>
				<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
					<div class="h-[25px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
				</div>
			</div>
			<div class="lg:grid lg:grid-cols-12 gap-5">
				<div class="lg:col-span-4 mt-[20px]">
					<div class="h-[25px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
				</div>
				<div class="lg:col-span-4 mt-[20px]">
					<div class="h-[25px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
				</div>
				<div class="lg:col-span-4 mt-[20px]">
					<div class="h-[25px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
				</div>
			</div>
			<br>
		
			
		</div>
		<SkeletonTable :rows="5" :table_only="true"></SkeletonTable>
	</span>
</template>

<script lang="ts" setup>
import SkeletonTable from './SkeletonTable.vue';
</script>