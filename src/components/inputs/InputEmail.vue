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

	
	export default{
		name : 'InputEmail',
		components : {
			
		},
		props: ['default_value', 'required'],
		data: function(){
			return {
				input_value: '',
				input_required: true
			}
		},
		computed :{
			
			is_valid : function(){
				console.log('IV == '+this.input_value);
				/*if(this.input_required == false){
					return true;
				}else{
					let temp = String(this.input_value).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
					console.log('temp == '+temp);
				}*/
			}

		},
		methods : {
			emit_value : function(){
				this.$emit('email-input', this.input_value);
			}
		},
		mounted : function(){
			this.input_value = this.default_value;
			this.input_required = this.required;
		}

	}

</script>