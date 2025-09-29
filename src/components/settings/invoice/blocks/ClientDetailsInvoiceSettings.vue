<template>
	<p class="pl-1">this is sample test</p>
	<draggable-list v-model="data.rows"></draggable-list>
	<input-button @click="displayList" btn_text="test"></input-button>
</template>
<script lang="ts" setup>

	import { reactive } from 'vue';
	import DraggableList from '../../../UI/DraggableList.vue';
	import InputButton from '../../../inputs/InputButton.vue';

	const data = reactive({
		rows : [
			{
				id : 1,
				text: 'one'
			},
			{
				id : 2,
				text: 'two'
			},
			{
				id : 3,
				text: 'three'
			}
		]
	});

	const displayList = () : void => {
		for(let z = 0 ; z < data.rows.length ; z++){
			console.log(data.rows[z].text);
		}
	}

</script>