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
	}
}