<template>
	<div>
		<div>
			<div class="h-[40px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
		</div>
		<br>
		<div>
			<div class="h-[40px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
		</div>
		<br>
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
		<div class="lg:col-span-4">
			<div class="h-[110px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
		</div>
		<br>
		<div class="lg:col-span-4">
			<div class="h-[110px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
		</div>
		<br>
		<div class="lg:grid lg:grid-cols-12 gap-5">
			<div class="lg:col-span-9">
				<div class="h-[130px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
			</div>
			<div class="lg:col-span-3">
				<div class="h-[130px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
			</div>
		</div>
		
		<div v-for="z in 3" :key="z" class="lg:grid lg:grid-cols-12 gap-5 mt-5">
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
		
	</div>
</template>

<script setup lang="ts"></script>