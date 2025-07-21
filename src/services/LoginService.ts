import api from "../helpers/api";

export default{

	checkAndManageTokens() : void{

	},

	ifUserHasCompanyAdded(fun:any) : void{

		api.post('check-company-exists', {
			something: 'value'
		}).then(response => {
			fun(response);
		});

	}

}