<template>
	<input-button class="lg:float-start" btn_text="Back" @click="goBack" icon="IconCaretLeft"></input-button>
	<div class="clear-both"></div>
	
	<br>
</template>
<script lang="ts" setup>

import { useRouter } from 'vue-router';

import InputButton from '../inputs/InputButton.vue';

const router = useRouter();

const goBack = () => {
  router.go(-1)
}

</script>