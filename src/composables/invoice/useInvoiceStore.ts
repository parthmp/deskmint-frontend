import { reactive } from "vue";

interface InvoiceCreateEditInterface{
	clients : Array<object>,
	products : Array<object>,
	invoice_details : {
		client: {
			value: string,
			error: string,
			show_errors: boolean,
			client_id: string,
		};
		invoice_date: {
			value: Date,
			error: string,
		};
		due_date: {
			value: Date | null,
			error: string,
		};
		invoice_number: {
			value: string,
			error: string,
		};
		po_number: string,
		global_discount: number,
		global_discount_type: string,
		currency_id: number,
		currency_code: string
	},
	global_discount_amount : string,
	product_columns : Array<object>,
	product_columns_slices : Array<object>,
	product_rows : Array<object>,
	product_id : string,
	global_subtotal: string,
	global_total : string,
	global_tax_amount : string,
	invoice_terms: string,
	active_tab_index: number,
	custom_fields : Array<object>,
	payment_method : object,
	send_invoice_in_email : boolean,
	gateways : Array<{
		text : string,
		value : string
	}>
}

const data = reactive<InvoiceCreateEditInterface>({
	clients : [],
	products : [],
	invoice_details : {
		client : {
			value : '',
			error : 'Please select a client',
			show_errors : false,
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
		currency_id : 0,
		currency_code : '',
	},
	global_discount_amount: '0.00',
	product_columns : [],
	product_columns_slices : [],
	product_rows : [],
	product_id : '',
	
	global_subtotal : '0.00',
	global_total : '0.00',
	global_tax_amount : '0.00',
	invoice_terms: '',
	active_tab_index: 0,
	custom_fields : [],
	payment_method : {
		value : 'cash',
		error : ''
	},
	send_invoice_in_email : true,
	gateways : []
});

export function useInvoiceStore(){

	
	/* implement reset here */
	const reset = () : void => {

	}
	
	return data;

}