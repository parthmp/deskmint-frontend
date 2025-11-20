import { useInvoiceStore } from "./useInvoiceStore";

export function useInvoiceReset(){
	
	let data = useInvoiceStore();

	const reset = () : void => {
		Object.assign(data, {
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
	}

	return {
		reset
	};
}