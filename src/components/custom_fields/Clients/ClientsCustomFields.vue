<template>
	<general-index-page page_title="Clients custom fields" :enable_arranged_columns="false" base_url="clients-custom-fields" slug="custom-fields/clients" :actions="['edit', 'delete']"></general-index-page>
</template>

<script lang="ts" setup>
	
	/* using compositon API */
	import GeneralIndexPage from '../../blocks/GeneralIndexPage.vue';

	// export interface ClientsCustomFieldsInterface{
		
	// }

	// import { defineComponent } from 'vue';

	
	// import RedirectToLoginForNoTokens from '../../../mixins/RedirectToLoginForNoTokens';
	// import GeneralIndexPage from '../../blocks/GeneralIndexPage.vue';
	
	
	// export default defineComponent({

	// 	name: 'ClientsCustomFields',

	// 	components: {
	// 		GeneralIndexPage
	// 	},

	// 	data() : ClientsCustomFieldsInterface {
	// 		return {
				
	// 		}
	// 	},

	// 	mixins: [RedirectToLoginForNoTokens],
	// 	methods : {

			
			
	// 	},

	// 	mounted(){
			
	// 	}

	// });

</script>