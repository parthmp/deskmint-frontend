<template>
	
	<div class="form-group">
		<label for="email">Email Address</label>
		<input type="email" @keyup="emit_value" v-model="input_value" class="form-control" id="email">
	</div>
	
</template>

<style scoped>
	
</style>

<script lang="ts">

	
	export default{
		name : 'InputEmail',
		components : {
			
		},
		props: ['default_value'],
		data: function(){
			return {
				input_value: ''
			}
		},
		computed :{
			
		},
		methods : {
			emit_value : function(){
				this.$emit('email-input', this.input_value);
			}
		},
		mounted : function(){
			this.input_value = this.default_value;
		}

	}

</script>