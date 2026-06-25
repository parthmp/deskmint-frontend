import { nextTick, toRaw, watch } from "vue";
import { useInvoiceStore } from "./useInvoiceStore";
import Decimal from "decimal.js";
import common from "../../helpers/common";

type rowType = {
    id: string,
    row_index: number,

    product_id?: string,
    quantity?: number | string,
    unit_price?: number | string,
    line_total?: number | string | Decimal,
    line_subtotal?: number | string | Decimal,
    tax_amount?: number | string | Decimal,
    discount_amount?: number | string | Decimal,

    type?: string,
    tax?: boolean,

    [key: `custom_tax_${string}`]: number | string | Decimal | undefined,
    [key: `normal_${string}`]: number | string | Decimal | undefined,
    [key: string]: number | string | Decimal | undefined
};



export function useInvoiceMath(){

	const data = useInvoiceStore();

	watch(() => [data.invoice_details.global_discount_type, data.invoice_details.global_discount], () : void => {
		calculateGlobalTotals();
	});

	watch(() => data.product_rows, (rows) : void => {
		
		rows.forEach((row) => {
			
			nextTick(() => {
				for (const key in row) {
					if(key.startsWith("custom_tax_") || key === 'tax'){
						const tax_percent = +row[key];
						if(tax_percent > 100){
							row[key] = 100;
						}
					}
				}
			});
			

			calculateItemCost(row);
			
		});

		calculateGlobalTotals();

	}, { deep:true });

	const calculateGlobalTotals = () : void => {
		
		let global_subtotal = new Decimal(0);
		let global_tax = new Decimal(0);
		let global_total = new Decimal(0);
		let global_discount_amount = new Decimal(0);
		let discount_amount_pre_tax = new Decimal(0);
		let taxable_amount = new Decimal(0);
		let global_subtotal_whole = new Decimal(0);

		for(const row of data.product_rows){
			
			const subtotal = new Decimal(+row.line_subtotal || 0);
			const tax = new Decimal(+row.tax_amount || 0);
			const line_total = subtotal.add(+tax);
			const discount_amount = new Decimal(+row.discount_amount || 0);
			
			global_subtotal = global_subtotal.add(subtotal);
			global_subtotal_whole = global_subtotal.add(subtotal);
			global_tax = global_tax.add(tax);
			global_total = global_total.add(line_total);
			taxable_amount = taxable_amount.add(subtotal);

			discount_amount_pre_tax = discount_amount_pre_tax.add(discount_amount);
			global_subtotal_whole = global_subtotal.add(discount_amount);
			
		}

		data.global_subtotal = global_subtotal.toFixed(2);
		data.global_tax_amount = global_tax.toFixed(2);

		data.global_total = global_total.toFixed(2);

		if(data.invoice_details.global_discount_type !== ''){
			if(data.invoice_details.global_discount_type === 'percentage'){
				let global_discount_perc = new Decimal(+data.invoice_details.global_discount);
				global_discount_amount = global_discount_amount.add(global_total.mul(global_discount_perc.div(100)));
			}else{
				global_discount_amount = new Decimal(+data.invoice_details.global_discount);
				if(global_discount_amount.greaterThan(new Decimal(+data.global_total))){
					global_discount_amount = new Decimal(data.global_total);
					data.global_discount_amount = global_discount_amount.toFixed();
					data.invoice_details.global_discount = +data.global_total;
					//data.invoice_details.global_discount = global_discount_amount.toNumber();
				}
			}
		}else{
			data.invoice_details.global_discount = 0;
		}

		data.global_discount_amount = global_discount_amount.toFixed(2);
		data.global_total = global_total.sub(data.global_discount_amount).toFixed(2);
		
		data.discount_amount_pre_tax = discount_amount_pre_tax.toFixed(2);
		data.taxable_amount = taxable_amount.toFixed(2);
		data.global_subtotal_whole = global_subtotal_whole.toFixed(2);
		
	}

	const calculateItemCost = (row:rowType) : void => {
		const raw_row = toRaw(row);
		
		if(common.isset(raw_row?.product_id)){

			raw_row.tax_amount = new Decimal(0);
			raw_row.line_subtotal = new Decimal(0);
			
			raw_row.line_total = new Decimal(0);

			if (raw_row.product_id !== '') {
				
				const quantity = new Decimal(raw_row.quantity || 0);
				const unit_price = new Decimal(raw_row.unit_price || 0);
				const discount = new Decimal(raw_row.discount || 0);
				let discount_amount = new Decimal(0);

				
				
				// line_subtotal = quantity × unit_cost
				let line_subtotal = quantity.mul(unit_price);
				
				if(discount.greaterThan(0)){
					discount_amount = discount_amount.add(line_subtotal.mul(discount.div(100)));
					line_subtotal = line_subtotal.sub(discount_amount);
				}
				raw_row.line_subtotal = line_subtotal.toNumber();
				

				raw_row.discount_amount = discount_amount.toNumber();

				// calculate total tax for the line
				let tax_amount = new Decimal(0);
				
				for (const key in raw_row) {
					if(key.startsWith("custom_tax_") || key === 'tax'){
						const tax_percent = new Decimal(raw_row[key] || 0);
						tax_amount = tax_amount.add(line_subtotal.mul(tax_percent.div(100)));
					}
				}

				raw_row.tax_amount = tax_amount.toNumber();

				// line_total = subtotal + tax
				const lineTotal = line_subtotal.add(tax_amount);
				raw_row.line_total = lineTotal.toFixed(2);

			}
			Object.assign(row, raw_row);
			
		}
		
	}



	return {
		calculateGlobalTotals,
		calculateItemCost
	};

}