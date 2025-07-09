<template>
	<div class="form-group">
		<button class="" :class="{'w-full':full_width}">123</button>
	</div>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';

	export default defineComponent({

		name : 'InputButton',

		props : ['full_width'],

		data() : any {
			return {};
		},

		components: {

		},

		methods: {

		}

	});

</script>