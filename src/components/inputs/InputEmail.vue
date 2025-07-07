<template>
	
	<div class="form-group">
		<label for="email">Email Address</label>
		<input type="email" @keyup="emit_value" v-model="input_value" class="form-control" id="email">
		<p v-if="!is_valid" class="text-red-600">Please enter valid email address.</p>
	</div>
	
</template>

<style scoped>
	
</style>
<!--for test-->
<script lang="ts">

	import { defineComponent } from 'vue';

	import common from '../../helpers/common';

	export default defineComponent({

		name: 'InputEmail',

		props: {
			default_value: {
				type: String,
				default: '',
			},
			required: {
				type: Boolean,
				default: true,
			},
		},

		data() {
			return {
				input_value: '' as string,
				input_required: true as boolean,
			};
		},

		computed: {
			is_valid(): boolean {
			if (this.input_required === false) return true;
				const email = String(common.sanitize(this.input_value)).toLowerCase();
				const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return regex.test(email);
			},
		},

		methods: {
			emit_value(): void {
				this.$emit('email-input', this.input_value);
			},
		},

		mounted(){
			this.input_value = common.sanitize(this.default_value);
			this.input_required = this.required;
		},
	});

</script>