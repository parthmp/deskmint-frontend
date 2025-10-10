<template>
	<div>
		<input-button url="./product-columns/additional-fields" label="Additional fields" icon="IconSquarePlus2" class="lg:float-end"></input-button>
		<div class="clear-both"></div>
		<br>
		<general-draggable-fields url="manage-invoice-settings-product-columns"></general-draggable-fields>
	</div>
	
</template>
<script lang="ts" setup>

	import GeneralDraggableFields from '../../GeneralDraggableFields.vue';
	import InputButton from '../../../../inputs/InputButton.vue';

</script>