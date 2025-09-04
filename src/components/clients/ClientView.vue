<template>
	<section class="main-content">
		<div class="card">
			<h1 class="text-2xl!">View Client</h1>
			<br>
			<tabs :horizontal="tabs_horizontal" :options="tab_options">
				<template v-slot:tab-0>
					<div>Client info goes here</div>
				</template>
				<template v-slot:tab-1>
					<div>Client invoices goes here</div>
				</template>
			</tabs>
		</div>
	</section>
</template>

<script lang="ts">


	import { defineComponent } from 'vue';
	
	import RedirectToLoginForNoTokens from '../../mixins/RedirectToLoginForNoTokens';
	import Tabs from '../UI/Tabs.vue';

	export default defineComponent({
		name : 'ClientView',
		mixins: [RedirectToLoginForNoTokens],
		components : {
			Tabs
		},
		data: function(){
			return {
				tab_options: ['Client Info', 'Invoices'],
				tabs_horizontal: false
			}
		},
		methods : {
			
		},
		mounted : function(){

			
		}

	});

</script>