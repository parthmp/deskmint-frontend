import { useInvoiceStore } from "./useInvoiceStore";
import { useInvoiceMath } from "./useInvoiceMath";
import common from "../../helpers/common";

export function useInvoiceProducts(){

	const data = useInvoiceStore();
	const { calculateGlobalTotals, calculateItemCost } = useInvoiceMath();

	const addNewProductRow = () : void => {

		/* create an object to push */

		let row_index = data.product_rows.length;

		const product_row = {
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

				if(row.value == 'tax' || row.value == 'line_total'){
					
					product_row[row.value] = 0;
				}else{
					product_row[row.value] = '';
				}

			}
			

		}

		product_row.item_id = '';
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
				if(key === 'unit_cost'){
					element.unit_cost = row.data.product.price;
				}
				if(key === 'item'){
					element.item_id = row.value+'';
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