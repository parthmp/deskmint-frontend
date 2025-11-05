<template>
	<section class="main-content">
		<div class="card">
			<h1 class="text-2xl!">Payments Settings</h1>
			<br>
			<tabs :horizontal="false" :options="data.tab_options" routing="/settings/payments">
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
	
	interface PaymentsSettingsInterface{
		tab_options : Array<string>
	}

	const data = reactive<PaymentsSettingsInterface>({
		tab_options : ['Integrations', 'Settings']
	});

</script>