<template>
	<div>
		<div class="mt-[25px]" v-for="n in 3" :key="n">
			<div class="h-[35px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
		</div>
		<div class="lg:grid lg:grid-cols-12 lg:gap-5 mt-[25px]">
		<div class="lg:col-span-6">
			<div class="h-[35px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
		</div>
		<div class="lg:col-span-6 lg:mt-0 mt-[25px]">
			<div class="h-[35px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full"></div>
		</div>
		
	</div>
	<div class="h-[40px] animate-[pulse_1s_ease-in-out_infinite] bg-deskmint-loading rounded-lg w-full lg:w-[150px] lg:float-end mt-[25px]"></div>
	<div class="clear-both"></div>
	</div>
</template>