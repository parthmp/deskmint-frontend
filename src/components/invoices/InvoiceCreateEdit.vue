<template>
	<section class="main-content">
    	<div class="card">
			 <h1 class="text-2xl!">Create an invoice</h1>
			 <br>
			 <tabs :options="tab_options" :horizontal="true">
				<template v-slot:tab-0>
					<div>
						<form>
							
							<div class="lg:grid lg:grid-cols-12 lg:gap-5">
								<div class="lg:col-span-4">
									<input-auto-complete label="Client" :required="true" placeholder="Type to select a client" :options="data.all_clients"></input-auto-complete>
								</div>
								<div class="lg:col-span-4">
									<input-date-time mode="date" label="Invoice date" :required="true" placeholder="Select invoice date"></input-date-time>
								</div>
								<div class="lg:col-span-4">
									<input-date-time mode="date" label="Due date" :required="true" placeholder="Select due date"></input-date-time>
								</div>
							</div>
						
							<div class="lg:grid lg:grid-cols-12 lg:gap-5">
								<div class="lg:col-span-4 mt-[20px]">
									<input-text label="Invoice number" :required="true" placeholder="Invoice number"></input-text>
								</div>
								<div class="lg:col-span-4 mt-[20px]">
									<input-text label="PO number" :required="true" placeholder="PO number"></input-text>
								</div>
								<div class="lg:col-span-4 mt-[20px]">
									<div class="lg:grid lg:grid-cols-12 lg:gap-2">
										<div class="lg:col-span-6">
											<input-number label="Discount" :required="false" placeholder="Discount" :step="0.01"></input-number>
										</div>
										<div class="lg:col-span-6 mt-[20px] lg:mt-[0px]">
											<input-select label="Discount type" placeholder="Select" :options="discount_options"></input-select>
										</div>
										
									</div>
									
								</div>
							</div>

							<product-row class="mt-[20px]"></product-row>
						</form>
					</div>
				</template>
				<template v-slot:tab-1>
					<div>
						invoice settings here
					</div>
				</template>
				<template v-slot:tab-2>
					<div>
						invoice preview here
					</div>
				</template>
			 </tabs>
		</div>
	</section>
</template>
<script lang="ts" setup>

	import { reactive } from 'vue';
	import Tabs from '../UI/Tabs.vue';
	import InputAutoComplete from '../inputs/InputAutoComplete.vue';
	import InputDateTime from '../inputs/InputDateTime.vue';
	import InputText from '../inputs/InputText.vue';
	import InputNumber from '../inputs/InputNumber.vue';
	import InputSelect from '../inputs/InputSelect.vue';

	import ProductRow from './blocks/ProductRow.vue';

	const tab_options = ['Invoice Details', 'Custom Fields', 'Settings', 'Preview'];
	const discount_options = [
		{
			text: 'Percentage',
			value: 'percentage'
		},
		{
			text: 'Amount',
			value: 'amount'
		}
	];

	const data = reactive({
		all_clients : []
	});

</script>