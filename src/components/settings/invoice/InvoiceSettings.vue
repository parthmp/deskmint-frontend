<template>
	<section class="main-content">
		<div class="card">
			
			<h1 class="text-2xl!">Invoice Settings</h1>
			
       
			<br>
			<tabs :horizontal="false" :options="data.tab_options">
				<template v-slot:tab-0>
					<general-invoice-settings></general-invoice-settings>
				</template>
				<template v-slot:tab-1>
					<numbers-invoice-settings></numbers-invoice-settings>
				</template>
			</tabs>
		</div>
	</section>
</template>
<script lang="ts" setup>

	import { reactive } from 'vue';
	import Tabs from '../../UI/Tabs.vue';
	import GeneralInvoiceSettings from './blocks/GeneralInvoiceSettings.vue';
	import NumbersInvoiceSettings from './blocks/NumbersInvoiceSettings.vue';
	
	interface InvoiceSettingsInterface{
		tab_options : Array<string>
	}

	const data = reactive<InvoiceSettingsInterface>({
		tab_options : ['General', 'Numbers', 'Client Details', 'Company Details', 'Company Address', 'Invoice Details', 'Product Columns', 'Total Fields']
	});

</script>