<template>
	<div class="overflow-auto! max-h-60 relative">
		<table class="table">
			<thead>
				<slot name="headers"></slot>
			</thead>
			<tbody>
				<slot name="body"></slot>
			</tbody>
		</table>
	</div>
</template>
<script lang="ts" setup>



</script>