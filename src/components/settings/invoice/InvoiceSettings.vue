<template>
	<section class="main-content">
		<div class="card">
			
			<h1 class="text-2xl!">Invoice Settings</h1>
			<input-button class="lg:float-start" btn_text="Back" url="/clients" icon="IconCaretLeft"></input-button>
			<div class="clear-both"></div>
       
			<br>
			<tabs :horizontal="false" :options="data.tab_options">
				<template v-slot:tab-0>
					<general-invoice-settings></general-invoice-settings>
				</template>
				<template v-slot:tab-1>
					456
				</template>
			</tabs>
		</div>
	</section>
</template>
<script lang="ts" setup>
	import { reactive } from 'vue';

	import Tabs from '../../UI/Tabs.vue';
	import GeneralInvoiceSettings from './blocks/GeneralInvoiceSettings.vue';
	import InputButton from '../../inputs/InputButton.vue';

	interface InvoiceSettingsInterface{
		tab_options : Array<string>
	}

	const data = reactive<InvoiceSettingsInterface>({
		tab_options : ['General', 'Numbers', 'Client Details', 'Company Details', 'Company Address', 'Invoice Details', 'Product Columns', 'Total Fields']
	});

</script>