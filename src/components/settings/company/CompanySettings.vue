<template>
	<section class="main-content">
		<div class="card">
			<h1 class="text-2xl!">Company Settings</h1>
			<br>
			<tabs :horizontal="false" :options="data.tab_options" routing="/settings/company">
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
	
	interface ComapnySettingsInterface{
		tab_options : Array<string>
	}

	const data = reactive<ComapnySettingsInterface>({
		tab_options : ['Details', 'Address', 'Logo', 'Defaults', 'Additional fields']
	});

</script>