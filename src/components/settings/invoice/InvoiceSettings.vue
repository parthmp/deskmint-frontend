<template>
	<section class="main-content">
		<div class="card">
			<h1 class="text-2xl!">Invoice Settings</h1>
			<br>
			<tabs :horizontal="false" :options="data.tab_options" routing="/settings/invoice">
				<template v-slot:whole_content>
					<router-view></router-view>
				</template>
			</tabs>
		</div>
	</section>
</template>
<script lang="ts" setup>

	import { reactive } from 'vue';
	import Tabs from '../../UI/Tabs.vue';
	
	interface InvoiceSettingsInterface{
		tab_options : Array<string>
	}

	const data = reactive<InvoiceSettingsInterface>({
		tab_options : ['General', 'Numbers', 'Client Details', 'Company Details', 'Company Address', 'Invoice Details', 'Product Columns', 'Total Fields']
	});

</script>