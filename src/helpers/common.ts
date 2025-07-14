import { Preferences } from "@capacitor/preferences";
import { Capacitor } from '@capacitor/core';
import { env } from "../env";

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

	fetchBaseUrl(fun:any) : void{

		if(env.SAME_BASE_URL_FOR_PHONES === true){
			fun(env.BASEURL);
		}else{

			if(Capacitor.getPlatform() === 'web'){

				fun(env.BASEURL);

			}else if(Capacitor.getPlatform() === 'android'){

				Preferences.get({ key : 'base_url' }).then((base_url_value) => {
					fun(this.stripTags(this.sanitize(base_url_value.value)));
				});

			}

		}

		
		
	},

	setBaseUrl(base_url:string) : void{
		Preferences.set({
			key: 'base_url',
			value: base_url
		});
	},

	removeTrailingSlash(str:string) : string {
    	return str.replace(/\/+$/, '');
	}

}