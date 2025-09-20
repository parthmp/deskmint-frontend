import { Preferences } from "@capacitor/preferences";
import { Capacitor } from '@capacitor/core';
import { env } from "../env";

import { Device } from '@capacitor/device';

export default {
	sanitize(value: any): string {
		if (typeof value === 'undefined') {
			return '';
		}

		if (value === null) {
			return '';
		}

		return value.trim();
	},

	stripTags(sample:string) : string{
		return sample;
		return sample.replace(/<[^>]*>/g, '');
	},

	isset(...args: any[]): boolean {
		return args.every(arg => arg !== undefined && arg !== null);
	},

	is_email(email_address:string):boolean{
		const email = String(email_address).toLowerCase();
		const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return regex.test(email);
	},

	// Add form validation utilities
	setupFormValidation(component: any): void {
		const form = component.$el.closest('form');
		if (form) {
			// Store reference to form for cleanup
			component.parentForm = form;
			// Bind the component context to the handler
			form.addEventListener('submit', (event: Event) => {
				this.handleFormSubmit(event, component);
			}, true);
		}
	},

	handleFormSubmit(event: Event, component: any): boolean {
		if (!component.valid_status) {
			event.preventDefault();
			event.stopPropagation();
			return false;
		}
		return true;
	},

	cleanupFormValidation(component: any): void {
		if (component.parentForm) {
			component.parentForm.removeEventListener('submit', component.parentForm.submitHandler, true);
		}
	},

	isValidURL(url:string, allow_http:boolean) : boolean {

		if (allow_http === true) {
			if (!url.startsWith('http://') && !url.startsWith('https://')) {
				return false;
			}
		} else {
			if (!url.startsWith('https://')) {
				return false;
			}
		}
		
		
		var res = url.match(/^https?:\/\/(www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:[0-9]{1,5})?\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/);
		return (res !== null);

	},

	removeTrailingSlash(str:string) : string {
    	return str.replace(/\/+$/, '');
	},

	getDeviceId(fun:any): void{
		Device.getId().then(fun);
	},

	random_number() : number{
		return Math.floor((Math.random() * 900000) + 1);
	},

	getFirstSection(url:string) : any {
		try {
			const urlObj = new URL(url);
			const pathSegments = urlObj.pathname.split('/').filter(segment => segment !== '');
			return pathSegments[0] || null;
		} catch (error) {
			return null;
		}
	},

	updateMenuActiveState(menuItems:any, currentUrl:string){

		//const currentSection = this.getFirstSection(currentUrl);
		
		return menuItems.map(item => {
			// Reset all active states first
			let updatedItem = { ...item, is_active: false };
			
			// Check if main menu item matches
			//if (item.path && this.getFirstSection(`http://dummy.com${item.path}`) === currentSection) {
				//updatedItem.is_active = true;
			//}
			
			// Check submenu items if they exist
			if (item.has_submenu && item.submenu.length > 0) {
				
				let hasActiveSubmenu = false;
					
				updatedItem.submenu = item.submenu.map(subItem => {

					let updatedSubItem = { ...subItem, is_active: false };
					let temp_url = subItem.path;
					if(temp_url.startsWith('/')){
						temp_url = temp_url.slice(1);
					}

					if (subItem.path && currentUrl.includes(env.FRONTEND_BASEURL+temp_url)) {
						updatedSubItem.is_active = true;
						hasActiveSubmenu = true;
					}
					
					return updatedSubItem;
				});
				
				// If any submenu item is active, make parent active too
				if(hasActiveSubmenu) {
					updatedItem.show_submenu = true;
				}

			}else{
				let temp_url = updatedItem.path;
				if(temp_url.startsWith('/')){
					temp_url = temp_url.slice(1);
				}
				if(updatedItem.path && currentUrl.includes(env.FRONTEND_BASEURL+temp_url)) {
					updatedItem.is_active = true;
				}
			}
			
			return updatedItem;
		});
	},
	
	isObjectEmpty(obj:object) : boolean{
		for (const prop in obj) {
			if (Object.hasOwn(obj, prop)) {
			return false;
			}
		}

		return true;
	},

	formatDate(dateString:string, dateonly = false) : string{

		const date = new Date(dateString); // converts UTC → local automatically

		const day = String(date.getDate()).padStart(2, '0');
		const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
							"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		const month = monthNames[date.getMonth()];
		const year = date.getFullYear();

		let hours = date.getHours();
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours ? hours : 12; // 0 → 12
		
		if(isNaN(day)){
			return '';
		}

		if(dateonly === false){
			return `${day}-${month}-${year} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
		}else{
			return `${day}-${month}-${year}`;
		}
		
		
	},

	getBrowserTimezone() :string {
		return Intl.DateTimeFormat().resolvedOptions().timeZone;
	},

	formatKey(str:string) : string {
		return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
	},

	isValidISODate(date_str: string): boolean {
		if(typeof date_str !== 'string'){
			return false;
		}

		const date = new Date(date_str);
		
		if(isNaN(date.getTime())){
			return false;
		}

		const normalized = date_str.replace(/(\.\d{3})\d*Z?$/, '$1Z');
		
		return date.toISOString() === normalized;
		
	},

	parseTimeString(time: string): any{
				
		if(typeof time === 'object'){
			return time;
		}
		
		const match = time.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s?(AM|PM)?$/i);
		
		if(!match){
			return null;
		}

		let hours = parseInt(match[1], 10);
		const minutes = parseInt(match[2], 10);
		const seconds = match[3] ? parseInt(match[3], 10) : 0; // Default to 0 if no seconds
		const ampm = match[4] ? match[4].toUpperCase() : null;

		// Validate minutes and seconds
		if(minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59){
			return null;
		}

		// Handle 12-hour format
		if(ampm){
			// Validate 12-hour format hours
			if(hours < 1 || hours > 12){
				return null;
			}
			
			// Convert to 24-hour format
			if(ampm === 'AM' && hours === 12){
				hours = 0; // 12:xx AM = 00:xx
			}else if (ampm === 'PM' && hours !== 12){
				hours += 12; // 1:xx PM = 13:xx, but 12:xx PM stays 12:xx
			}
		}else{
			// Validate 24-hour format hours
			if(hours < 0 || hours > 23){
				return null;
			}
		}

		return { hours, minutes, seconds };
	}


}