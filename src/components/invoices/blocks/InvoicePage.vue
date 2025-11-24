<template>
	<div>
		<form @submit.prevent="validateInvoiceDetails">
			
			<invoice-details v-model="data.invoice_details" ref="invoice_details_ref"></invoice-details>
			
			<br>
			<br>
				<div class="overflow-x-auto overflow-y-visible! styled-scrollbar min-h-[0px]">
					<draggable class="min-w-[1000px] mt-[25px]" group="fields" @start="true" @end="printRows" v-model="data.product_rows" item-key="id" :animation="200" handle=".drag-handle">
						<template #item="{element, index}">
							<transition-group name="fade" tag="div">
								
								<div class="rounded-lg p-5 shadow-sm bg-deskmint-sage-green mt-5 relative" :key="index">
									<IconGrain class="absolute left-0 top-0 drag-handle block"></IconGrain>
									<IconTrash class="float-end text-red-500! cursor-pointer" @click.prevent="removeProductRow(element)"></IconTrash>
									<div class="clear-both"></div>
									<div class="">
										
										<div v-for="(product_column_slice, index2) in data.product_columns_slices" :key="index" class="min-w-0">
											
											
											<div class="grid gap-4 mt-2" :class="{'grid-cols-6' : index2 === 0, 'grid-cols-3' : index2 === 1}">
												
												<div v-for="(product_column, column_index) in product_column_slice" :key="column_index">
													
													
													<div v-if="product_column.value == 'item'">
														<input-auto-complete label="Item" v-model="element.item" @selected="selected_item => handleProductSelect(selected_item, element)" :error="data.invoice_details.client.error" endpoint="manage-invoices/fetch-products" :required="true" placeholder="Item" :options="data.clients"></input-auto-complete>
													</div>
													
													
													<!-- Description Field -->
													<div v-if="product_column.value == 'description'">
														<input-textarea :rows="1" label="Description" v-model="element.description" placeholder="Description" class="w-full"></input-textarea>
													</div>
													
													<!-- Unit Cost Field -->
													<div v-if="product_column.value == 'unit_cost'">
														<input-number :step="0.01" label="Unit cost" v-model="element.unit_price" placeholder="Unit cost" class="w-full"></input-number>
													</div>
													
													<!-- Quantity Field -->
													<div v-if="product_column.value == 'quantity'">
														<input-number :step="1" label="Quantity" v-model="element.quantity" placeholder="Quantity" class="w-full"></input-number>
													</div>
													
													
													
													<!-- Custom Field -->
													<div v-if="product_column.type == 'custom' && product_column?.tax === true">
														<input-number :step="0.01" :label="product_column?.text" v-model="element['custom_tax_'+common.replaceWithUnderscores(product_column?.text)]" :placeholder="product_column?.text" class="w-full"></input-number>
													</div>
													<div v-if="product_column.type == 'custom' && product_column?.tax === false">
														<input-text class="w-full" :label="product_column?.text" v-model="element['normal_'+common.replaceWithUnderscores(product_column?.text)]" :placeholder="product_column?.text"></input-text>
													</div>
													
													
													<!-- Tax Field -->
													<div v-if="product_column.value == 'tax'">
														<input-number :step="0.01" label="Tax %" v-model="element.tax" placeholder="Tax %" class="w-full"></input-number>
													</div>
													
													<!-- Line Total Display -->
													<div v-if="product_column.value == 'line_total'" class="font-semibold text-lg text-gray-900 pt-1">
														TOTAL<br>
														{{ element.line_total }} {{ data.invoice_details.currency_code }}
													</div>
												
												</div>
											</div>
										</div>
									
									</div>
								</div>
							</transition-group>
						</template>
					</draggable>
				</div>
				<div class="clear-both"></div>
				<input-button @click.prevent="addNewProductRow" type="button" label="Add" icon="IconPlus" class="lg:float-start"></input-button>
				<div class="clear-both"></div>
				<br>
				<div class="lg:grid lg:grid-cols-12 lg:gap-5">
					<div class="lg:col-span-9">
						<input-textarea label="Invoice terms" placeholder="Invoice terms" v-model="data.invoice_terms" :rows="4"></input-textarea>
					</div>
					<div class="lg:col-span-3">
						<p class="text-xl! mb-[5px]">Subtotal : {{ data.global_subtotal }} {{ data.invoice_details.currency_code }}</p>
						<p class="text-xl! mb-[5px]">Tax : {{ data.global_tax_amount }} {{ data.invoice_details.currency_code }}</p>
						<p class="text-xl! mb-[5px]">Discount amount: {{ data.global_discount_amount }} {{ data.invoice_details.currency_code }}</p>
						<p class="text-xl! mb-[5px]">Total : {{ data.global_total }} {{ data.invoice_details.currency_code }}</p>
						<p class="text-xl! mb-[5px]">Balance due : {{ data.global_total }} {{ data.invoice_details.currency_code }}</p>
					</div>
				</div>
				<input-button btn_text="Next" icon="IconCaretRight" class="lg:float-end"></input-button>
				<div class="clear-both"></div>

		</form>
	</div>
</template>

<script lang="ts" setup>

	import { ref } from 'vue';
	import { useInvoiceProducts } from '../../../composables/invoice/useInvoiceProducts';
	import { useInvoiceStore } from '../../../composables/invoice/useInvoiceStore';
	import { toastEvents } from '../../../events/toastEvents';

	import InputAutoComplete from '../../inputs/InputAutoComplete.vue';
	import InputText from '../../inputs/InputText.vue';
	import InputNumber from '../../inputs/InputNumber.vue';
	import InputTextarea from '../../inputs/InputTextarea.vue';
	import InvoiceDetails from './InvoiceDetails.vue';

	import { IconTrash } from '@tabler/icons-vue';

	import InputButton from '../../inputs/InputButton.vue';
	import common from '../../../helpers/common';

	import draggable from 'vuedraggable';

	import { IconGrain } from '@tabler/icons-vue';


	const data = useInvoiceStore();

	const { addNewProductRow, removeProductRow, handleProductSelect } = useInvoiceProducts();

	const invoice_details_ref = ref(null);

	const emit = defineEmits(['validated']);

	const isValid = () : boolean => {

		let validated = true;

		validated = invoice_details_ref.value.validateInvoiceDetails();

		if(!validated){
			toastEvents.emit('toast', {
				type : 'error',
				message : 'Please fill in highlighted fields'
			});
		}else{

			if(data.product_rows.length === 0){
				validated = false;
				toastEvents.emit('toast', {
					type : 'error',
					message : 'Please add at at least one product row for invoice'
				});
			}else{
				for(const row of data.product_rows){
					if(row.item_id === ''){
						validated = false;
						toastEvents.emit('toast', {
							type : 'error',
							message : 'Please select an item for each product row for invoice'
						});
						break;
					}
				}

				
			}

			

		}

		return validated;

	}
	

	const validateInvoiceDetails = () : void => {
		
		const is_valid = isValid();

		emit('validated', is_valid);
		
	}

	const printRows = () : void => {
		// console.log(data.product_rows);
	}

	defineExpose({isValid});

</script>