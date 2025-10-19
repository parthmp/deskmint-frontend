<template>
	<section class="main-content">
    	<div class="card">
			 <h1 class="text-2xl!">Create an invoice</h1>
			 <br>
			 <tabs :options="tab_options" :horizontal="true">
				<template v-slot:tab-0>
					<div>
						<form>
							
							<div class="lg:grid lg:grid-cols-12 lg:gap-5">
								<div class="lg:col-span-4">
									<div class="grid grid-cols-12 gap-2">
										<div class="col-span-9">
											<input-auto-complete label="Client" v-model="data.client.value" @selected="handleClientSelect" :error="data.client.error" endpoint="manage-invoices/fetch-clients" :required="true" placeholder="Type to select a client" :options="data.clients"></input-auto-complete>
										</div>
										<div class="col-span-3">
											<input-button url="/clients/create" label="New" class="mt-[23.5px]"></input-button>
											
										</div>
										
										
									</div>
								</div>
								<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
									<input-date-time mode="date" label="Invoice date" v-model="data.invoice_date.value" :error="data.invoice_date.error" :required="true" placeholder="Select invoice date"></input-date-time>
								</div>
								<div class="lg:col-span-4 mt-[20px] lg:mt-[0px]">
									<input-date-time mode="date" label="Due date" v-model="data.due_date.value" :error="data.due_date.error" :required="true" placeholder="Select due date"></input-date-time>
								</div>
							</div>
						
							<div class="lg:grid lg:grid-cols-12 lg:gap-5">
								<div class="lg:col-span-4 mt-[20px]">
									<input-text label="Invoice number" v-model="data.invoice_number.value" :error="data.invoice_number.error" :required="true" placeholder="Invoice number"></input-text>
								</div>
								<div class="lg:col-span-4 mt-[20px]">
									<input-text label="PO number" v-model="data.po_number" :required="true" placeholder="PO number"></input-text>
								</div>
								<div class="lg:col-span-4 mt-[20px]">
									<div class="lg:grid lg:grid-cols-12 lg:gap-2">
										<div class="lg:col-span-6">
											<input-number label="Discount" v-model="data.global_discount" :required="false" placeholder="Discount" :step="0.01"></input-number>
										</div>
										<div class="lg:col-span-6 mt-[20px] lg:mt-[0px]">
											<input-select label="Discount type" v-model="data.global_discount_type" placeholder="Select" :options="discount_options"></input-select>
										</div>
										
									</div>
									
								</div>
							</div>
							<!-- <div class="flex gap-5 mt-[40px]">
								<span v-for="(product_column, key) in data.product_columns" :key="key" class="grow text-left w-[150px]">
									{{ product_column.text }}
									
								</span>
								
							</div> -->
							<!-- <div class="flex gap-5">
								<span v-for="(product_column, key) in data.product_columns" :key="key" class="grow w-[150px]">
									<span v-if="product_column.value == 'item'">
										<input-auto-complete v-model="data.client.value" :error="data.client.error" endpoint="manage-invoices/fetch-clients" :required="true" placeholder="Product/Item" :options="data.clients"></input-auto-complete>
									</span>
									<span v-if="product_column.value == 'description'">
										<input-textarea></input-textarea>
									</span>
									<span v-if="product_column.value == 'unit_cost'">
										<input-number :step="0.01"></input-number>
									</span>
									<span v-if="product_column.value == 'quantity'">
										<input-number :step="1"></input-number>
									</span>
									<span v-if="product_column.value == 'discount'">
										<input-number :step="0.01"></input-number>
									</span>
								</span>
							</div> -->
							<br>
							<br>
							<!-- Replace your table structure with this -->
<div class="space-y-4">
  <!-- Each product row as a card -->
  <div class="border rounded-lg p-4">
    
    <!-- Wrapper with horizontal scroll for small screens -->
    <div class="overflow-x-auto -mx-4 px-4">
      <!-- Grid that wraps: 7 columns per row on large screens -->
      <div class="grid grid-cols-9 gap-4 min-w-[900px]">
      
      <div v-for="(product_column, key) in data.product_columns" 
           :key="key"
           class="min-w-0">
        
        <!-- Column Label -->
        <label class="block text-xs font-medium mb-1.5">
          {{ product_column.text }}
        </label>
        
        <!-- Item Field -->
        <div v-if="product_column.value == 'item'">
          <input-auto-complete 
            v-model="data.client.value" 
            :error="data.client.error" 
            endpoint="manage-invoices/fetch-clients" 
            :required="true" 
            placeholder="Product/Item" 
            :options="data.clients" 
            class="w-full">
          </input-auto-complete>
        </div>
        
        <!-- Description Field -->
        <div v-if="product_column.value == 'description'">
          <input-textarea class="w-full"></input-textarea>
        </div>
        
        <!-- Unit Cost Field -->
        <div v-if="product_column.value == 'unit_cost'">
          <input-number :step="0.01" class="w-full"></input-number>
        </div>
        
        <!-- Quantity Field -->
        <div v-if="product_column.value == 'quantity'">
          <input-number :step="1" class="w-full"></input-number>
        </div>
        
        <!-- Discount Field -->
        <div v-if="product_column.value == 'discount'">
          <input-number :step="0.01" class="w-full"></input-number>
        </div>
        
        <!-- Custom Field -->
        <div v-if="product_column.type == 'custom'">
          <input-number :step="0.01" class="w-full"></input-number>
        </div>
        
        <!-- Gross Line Total Field -->
        <div v-if="product_column.value == 'gross_line_total'">
          <input-number :step="0.01" class="w-full"></input-number>
        </div>
        
        <!-- Tax Field -->
        <div v-if="product_column.value == 'tax'">
          <input-number :step="0.01" class="w-full"></input-number>
        </div>
        
        <!-- Line Total Display -->
        <div v-if="product_column.value == 'line_total'" 
             class="font-semibold text-lg text-gray-900 pt-1">
          TOTAL
        </div>
        
      </div>
      </div>
    </div>
    
    <!-- Optional: Remove button for each product -->
    <!-- <button class="mt-3 text-red-500 text-sm hover:text-red-700">
      Remove Item
    </button> -->
    
  </div>
  
  <!-- If you have multiple products, use v-for on the card div above -->
  
</div>

<!-- 
USAGE NOTES:
1. Wraps at 7 columns per row automatically
2. For 10 columns: First 7 on row 1, next 3 on row 2
3. For 14 columns: 7 on row 1, 7 on row 2
4. min-w-[900px] ensures 7 columns fit properly on desktop (1366px+)
5. Small screens (<900px): horizontal scrolling enabled
6. No horizontal scrolling on screens 1366px and larger

SCREEN BEHAVIOR:
- Desktop (1366px+): Shows 7 fields per row, wraps to next row if more. No scroll ✅
- Tablet (768-1365px): Horizontal scroll if needed ↔️
- Mobile (<768px): Horizontal scroll ↔️

ADJUST MIN-WIDTH:
- Change min-w-[900px] to adjust when scrolling kicks in
- min-w-[1100px] = tighter fit, scrolls earlier
- min-w-[800px] = looser fit, scrolls later
-->

						</form>
					</div>
				</template>
				<template v-slot:tab-1>
					<div>
						invoice settings here
					</div>
				</template>
			 </tabs>
		</div>
	</section>
</template>
<script lang="ts" setup>

	import { onMounted, reactive } from 'vue';
	import Tabs from '../UI/Tabs.vue';
	import InputAutoComplete from '../inputs/InputAutoComplete.vue';
	import InputDateTime from '../inputs/InputDateTime.vue';
	import InputText from '../inputs/InputText.vue';
	import InputNumber from '../inputs/InputNumber.vue';
	import InputSelect from '../inputs/InputSelect.vue';
	import InputTextarea from '../inputs/InputTextarea.vue';

	import InputButton from '../inputs/InputButton.vue';
	import api from '../../helpers/api';

	const tab_options = ['Invoice Details', 'Custom Fields', 'Settings'];
	const discount_options = [
		{
			text: 'Percentage',
			value: 'percentage'
		},
		{
			text: 'Amount',
			value: 'amount'
		}
	];

	const data = reactive({
		clients : [],
		client : {
			value : '',
			error : 'Please select a client',
			client_id : ''
		},
		invoice_date : {
			value : new Date(),
			error : 'Please select invoice date'
		},
		due_date : {
			value : null,
			error : 'Please select due date'
		},
		invoice_number : {
			value : '',
			error : 'Please enter invoice number'
		},
		po_number : '',
		global_discount : 0,
		global_discount_type: 'percentage',
		product_columns : []
	});

	const fetchInitialData = () : void =>  {

		const d = new Date();
		const timezone_offset_minutes = d.getTimezoneOffset();

		api.get('manage-invoices/fetch-initial-data', {
			params : {
				timezone_offset_minutes : timezone_offset_minutes
			}
		}).then(response => {
			data.invoice_number.value = response.data.invoice_number;
			data.product_columns = response.data.product_columns;
		}).catch(error => {

		});

	}

	const handleClientSelect = (ev:object) : void => {
		data.client.client_id = ev.value+'';
	}

	onMounted(() => {
		fetchInitialData();
	})

</script>