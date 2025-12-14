<template>
	<div>
		<input-button url="./product-columns/additional-fields" label="Additional fields" icon="IconSquarePlus2" class="lg:float-end"></input-button>
		<div class="clear-both"></div>
		<br>
		<p>Arrange how you want to display product columns in the invoice</p>
		<br>
		<general-draggable-fields url="manage-invoice-settings-product-columns" :deletion_exceptions="['product_id']"></general-draggable-fields>
	</div>
	
</template>
<script lang="ts" setup>

	import GeneralDraggableFields from '../../GeneralDraggableFields.vue';
	import InputButton from '../../../../inputs/InputButton.vue';
	import { reactive } from 'vue';

</script>