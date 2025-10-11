<template>
	<div v-for="(n, key) in 5" :key="key">
		<div class="h-[40px]"></div>
		
		<div class="clear-both"></div>
		<div class="grid lg:grid-cols-12 gap-5">
			<div class="lg:col-span-6">
				<div class="h-[40px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
			</div>
			<div class="lg:col-span-6">
				<div class="h-[40px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
			</div>
		</div>
		<div class="h-[40px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full mt-[20px]"></div>
	</div>
	<div class="h-[40px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full lg:w-[150px] lg:float-end mt-[25px]"></div>
	<div class="clear-both"></div>
</template>