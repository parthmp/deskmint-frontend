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
		return Math.floor((Math.random() * 100) + 1);
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

		const currentSection = this.getFirstSection(currentUrl);
		
		return menuItems.map(item => {
			// Reset all active states first
			let updatedItem = { ...item, is_active: false };
			
			// Check if main menu item matches
			if (item.path && this.getFirstSection(`http://dummy.com${item.path}`) === currentSection) {
				updatedItem.is_active = true;
			}
			
			// Check submenu items if they exist
			if (item.has_submenu && item.submenu.length > 0) {
			let hasActiveSubmenu = false;
			
			updatedItem.submenu = item.submenu.map(subItem => {

				let updatedSubItem = { ...subItem, is_active: false };
				
				if (subItem.path && this.getFirstSection(`http://dummy.com${subItem.path}`) === currentSection) {
					updatedSubItem.is_active = true;
					hasActiveSubmenu = true;
				}
				
				return updatedSubItem;
			});
			
			// If any submenu item is active, make parent active too
			if (hasActiveSubmenu) {
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
	}


}