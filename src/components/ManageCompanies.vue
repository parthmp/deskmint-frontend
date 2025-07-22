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
		methods : {
			
		},
		mounted : function(){

			

		}

	});

</script>