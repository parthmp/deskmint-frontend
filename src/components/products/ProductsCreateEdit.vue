<template>
	<section class="main-content">
		<div class="card">
			<h1 class="text-2xl!" v-if="data.mode === 'create'">Create a product</h1>
			<h1 class="text-2xl!" v-if="data.mode === 'edit'">Edit product</h1>
			
			<input-button class="lg:float-start" btn_text="Back" url="/products" icon="IconCaretLeft"></input-button>
			<div class="clear-both"></div>
			
			<br>
			<product-edit-skeleton v-if="data.data_loading"></product-edit-skeleton>

			<form v-if="!data.data_loading" @submit.prevent="createClientCustomField" class="form">
				<div class="lg:grid lg:grid-cols-12 gap-5">
					<div class="lg:col-span-4">
						<input-text label="Product name" prop_placeholder="Enter product name" :required="true" v-model="data.product_name.value" :error="data.product_name.error" ref="product_name_ref"></input-text>
					</div>
					<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
						<input-number field_name="Price" :required="false" prop_placeholder="Enter price" v-model="data.price" ref="price_ref"></input-number>
					</div>
					<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
						<input-text label="SKU" prop_placeholder="Enter SKU" :required="false" v-model="data.sku" ref="sku_ref"></input-text>
					</div>
				</div>
				
				<div class="mt-[20px]">
					<input-textarea label="Description" :required="false" v-model="data.description" ref="description_ref"></input-textarea>
				</div>
				<input-button btn_text="Save" :disabled="data.btn_disabled" icon="IconCheck" class="lg:float-end"></input-button>
				<div class="clear-both"></div>
			</form>
			
		</div>
	</section>
</template>

<script lang="ts" setup>

	import { onMounted, reactive, ref, watch } from 'vue';
	import InputButton from '../inputs/InputButton.vue';
	import InputText from '../inputs/InputText.vue';
	import InputTextarea from '../inputs/InputTextarea.vue';
	import InputNumber from '../inputs/InputNumber.vue';
	import { toastEvents } from '../../events/toastEvents';
	import api from '../../helpers/api';
	import { useRoute, useRouter } from 'vue-router';
	import common from '../../helpers/common';

	import ProductEditSkeleton from '../skeletons/ProductEditSkeleton.vue';
	
	const route = useRoute();
	const router = useRouter();

	/* interfaces */
	interface ProductData{
		data_loading: boolean,
		product_name: {
			value: string,
			error: string,
		};
		price: string,
		sku: string,
		description: string,
		btn_disabled: boolean,
		mode: string,
		id : string
	}

	interface InputComponent{
  		validate: () => boolean
	}
	

	/* refs */
	const product_name_ref = ref<InputComponent | null>(null);
	const price_ref = ref<InputComponent | null>(null);
	const sku_ref = ref<InputComponent | null>(null);
	const description_ref = ref<InputComponent | null>(null);

	/* data */
	const data = reactive<ProductData>({
		data_loading : false,
		product_name: {
			value : '',
			error: 'Please enter product name'
		},
		price: '0',
		sku : '',
		description : '',
		btn_disabled : false,
		mode : 'create',
		id: ''
	});

	/* watchers */
	watch(() => data.product_name.value, () => {
		if(!data.data_loading){
			let product_name_v = product_name_ref.value?.validate() ?? false;
			data.product_name.error = '';
			if(!product_name_v){
				data.product_name.error = 'Please enter product name';
			}
		}
	});

	/* methods */
	const createClientCustomField = () : void => {

		data.btn_disabled = true;
		let product_name_v = product_name_ref.value?.validate() ?? false;

		if(product_name_v){

			let post_url = 'manage-products';
			if(data.mode === 'edit'){
				post_url += '/'+data.id
			}

			common.sendRequest(data.mode === 'edit' ? 'patch' : 'post', post_url, {
				product_name: data.product_name.value,
				price: data.price,
				sku: data.sku,
				description: data.description
			}).then(response => {
				router.push('/products');
			}).catch(error => {
				
			}).finally(() => {
				data.btn_disabled = false;
			});

		}else{
			data.btn_disabled = false;
			toastEvents.emit('toast', {
				type: 'error',
				message: 'Please fill in highlighted fields'
			});

		}
	}

	const fetchProduct = (id:number) : void => {
		
		data.data_loading = true;

		api.get('manage-products/'+id).then(response => {

			data.product_name.value = response.data.product_name;
			data.price = response.data.price;
			data.sku = response.data.sku;
			data.description = response.data.description;

			
		}).catch(error => {

		}).finally(() => {
			data.data_loading = false;
		});

	}

	

	/* lifecycle hooks */
	onMounted(() :void => {
		let temp_id = route.params.id;
		if(common.isset(temp_id)){
			if(temp_id !== ''){
				data.id = Array.isArray(temp_id) ? temp_id[0] : temp_id ?? '';
				data.mode = 'edit';
				fetchProduct(temp_id);
			}
		}
	});

</script>