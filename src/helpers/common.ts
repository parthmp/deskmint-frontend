export default{

	sanitize(value) : string {

		if(typeof value === 'undefined'){
			return '';
		}

		if(value === null){
			return '';
		}

		return value.trim();
		
	}

}