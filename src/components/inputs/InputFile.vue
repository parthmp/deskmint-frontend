<template>
	<div>
		<input type="file" ref="fileinput" @change="fileSelected" class="hidden" :multiple="props.multiple">
		<img v-if="props.type === 'image'" :src="data.preview_image" class="max-h-[160px]" :class="{'mb-[20px]!': data.preview_image !== ''}" alt="">
		<div class="clear-both"></div>
		<input-button :label="props.label" :icon="props.icon" class="lg:float-start mt-[0px]!" @click.prevent="launchFileSelector"></input-button>
		<div class="clear-both"></div>
	</div>
</template>

<script lang="ts" setup>

	import { onMounted, reactive, ref, watch } from 'vue';
	import InputButton from './InputButton.vue';
	import common from '../../helpers/common';

	interface InputFileInterface{
		files : Array<object>,
		preview_image:string
	}

	interface InputFileElementInterface{
		fileinput: object
	}


	const props = defineProps<{
		multiple?: boolean,
		type?:string,
		mb_limit?:number,
		required?: boolean,
		label?:string,
		icon?:string
		modelValue?:string
	}>();

	const emit = defineEmits<{
		(e :'invalid_file', value: object) : void,
		(e :'invalid_size', value: object) : void,
		(e :'get_files', value: Array<object>) : void,
	}>();


	
	/* non reactive */
	const allowed_mimes : Record<string, string[]> = {
		image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
		document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
	};

	const max_size = ((props.mb_limit || 5) * 1024 * 1024);

	/* reactive */
	const fileinput = ref<InputFileElementInterface | null>(null);

	const data = reactive<InputFileInterface>({
		files: [],
		preview_image : ''
	});

	/* watchers */
	watch(() => props.modelValue, () => {
		fillImage();
	})

	/* methods */
	const launchFileSelector = () : void => {
		fileinput.value?.click();
	}

	const fileSelected = (event:Event) : void => {

		data.preview_image = '';
		data.files = [];
		
		const files = event?.target.files;
		if(files && files.length > 0){

			for(let z = 0; z < files.length; z++){

				const file = files[z];
				
				if(props.type && allowed_mimes[props.type]){
					if(!allowed_mimes[props.type].includes(file.type)){
						data.files = [];
						emit('invalid_file', file);
						break;
					}
				}
				
				if(file.size > max_size){
					data.files = [];
					emit('invalid_size', file);
					break;
				}

				if(props.type === 'image'){
					data.preview_image = URL.createObjectURL(file);
				}
				
				data.files.push(file);

			}

		}

		emit('get_files', data.files);

	}

	const getFiles = () : Array<object> => {
		return data.files;
	}

	const fillImage = () : void => {
		if(common.isset(props.modelValue)){
			if(props.modelValue?.trim() !== ''){
				data.preview_image =  props.modelValue ?? '';
			}
		}
	}

	onMounted(() => {
		fillImage();
	})

	/* exposed */
	defineExpose({
		getFiles
	});


</script>