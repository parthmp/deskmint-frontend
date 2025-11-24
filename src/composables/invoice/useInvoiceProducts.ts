import { useInvoiceStore } from "./useInvoiceStore";
import { useInvoiceMath } from "./useInvoiceMath";
import common from "../../helpers/common";
type rowType = {
	id: string,
	row_index: number,
	type?: string | undefined,
	tax?: boolean,
	line_subtotal?: number,
	tax_amount?: number,
	
	[key: `custom_tax_${string}`]: number | string,
	[key: `normal_${string}`]: number | string,
	[key: string]: number | string
	
};

export function useInvoiceProducts(){

	const data = useInvoiceStore();
	const { calculateGlobalTotals, calculateItemCost } = useInvoiceMath();

	const addNewProductRow = () : void => {

		/* create an object to push */

		let row_index = data.product_rows.length;

		const product_row:rowType = {
			id : Date.now() + '_' + Math.random().toString(36).slice(2),
			row_index: row_index
		};

		
		for(let row of data.product_columns){

			if(row.type == 'custom' && row?.tax === true){
				const key = 'custom_tax_' + common.replaceWithUnderscores(row?.text);
				product_row[key] = +row.tax_rate;

			}else if(row.type == 'custom' && row?.tax === false){

				product_row['normal_'+common.replaceWithUnderscores(row?.text)] = '';

			}else{

				let modified_row_value = row.value;
				if(row.value === 'unit_cost'){
					modified_row_value = 'unit_price';
				}

				if(row.value == 'tax' || row.value == 'line_total'){
					
					product_row[modified_row_value] = 0;
				}else{
					product_row[modified_row_value] = '';
				}

			}
			

		}

		product_row.product_id = '';
		product_row.line_subtotal = 0;
		product_row.tax_amount = 0;
		
		data.product_rows.push(product_row);

	}

	const removeProductRow = (row:object) : void => {

		// remove the object from the array
		const index = data.product_rows.indexOf(row);
		if (index !== -1) {
			data.product_rows.splice(index, 1);
		}

		// recalc totals
  		calculateGlobalTotals();

	}

	const handleProductSelect = (row:object, element:object) : void => {
		
		if(Object.keys(row).length > 0){
			
			for(const key in element){
				element.quantity = 1;
				if(key === 'description'){
					element.description = row.data.product.description;
				}
				if(key === 'unit_price'){
					element.unit_price = row.data.product.price;
				}
				if(key === 'item'){
					element.product_id = row.value+'';
					element.item = row.text+'';
				}
				
			}
			calculateItemCost(element);
			calculateGlobalTotals();
		}
		
	}

	return {
		addNewProductRow,
		removeProductRow,
		handleProductSelect
	};
}