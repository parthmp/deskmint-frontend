<template>
  <div :data-theme="theme">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">

	export default{
		name : 'App',
		components : {
			
		},
		data: function(){
			return {
				theme: 'light'
			}
		},
		methods : {

		},
		mounted : function(){

		}

	}

</script>