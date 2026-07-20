<template>
	<div v-for="n in 8" :key="n">
		<div class="lg:grid lg:grid-cols-12 gap-5 mt-[25px]">
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