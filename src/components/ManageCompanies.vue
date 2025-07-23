<template>
	<section class="main-content">
		<add-new-company></add-new-company>
		<br>
		<Footer></Footer>
	</section>
</template>

<script lang="ts">

	import AddNewCompany from './blocks/AddNewCompany.vue';
	import Footer from './blocks/Footer.vue';
	
	import { defineComponent } from 'vue';

	import RedirectToLoginForNoTokens from '../mixins/RedirectToLoginForNoTokens';

	export default defineComponent({
		name : 'ManageCompanies',
		components : {
			AddNewCompany,
			Footer
		},
		data: function(){
			return {
				
			}
		},
		mixins: [RedirectToLoginForNoTokens],
		methods : {
			
		},
		mounted : function(){

			

		}

	});

</script>