import type { TextFieldType } from "./InputTypes"

export interface ClientPersonalInfo{
	client_company_name : string,
	first_name : TextFieldType,
	last_name : TextFieldType,
	tax_id :TextFieldType,
	website : TextFieldType,
	email : TextFieldType,
	phone : TextFieldType
}

export interface ClientContactInfo{
	id: number,
	first_name: TextFieldType,
	last_name: TextFieldType,
	email: TextFieldType,
	phone: TextFieldType
}

export interface ClientBillingInfo{
	street: TextFieldType,
	apt: TextFieldType,
	city: TextFieldType,
	state: TextFieldType,
	postal_code: TextFieldType,
	country: TextFieldType
}

export interface ClientShippngInfo extends ClientBillingInfo{
}

export interface ClientSettings{
	currency : TextFieldType,
	payment_terms: TextFieldType,
	quote_valid: TextFieldType,
	send_reminder: TextFieldType,
	size: TextFieldType,
	industry: TextFieldType,
	e_invoice_value:boolean
}