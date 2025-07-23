import common from "../helpers/common";
import { getAccessToken, getRefreshToken } from "../services/TokenService";

export default {
 mounted() {
	this.$nextTick(() => {
	  if (
		this.$el &&
		this.$el.nodeType === 1 &&
		document.body.contains(this.$el)
	  ) {
		redirectUsersToPanel.call(this);
	  }
	});
  }
};

function redirectUsersToPanel() {

	getAccessToken().then((value) => {
		if(common.isset(value)){
			if(value !== '' && value !== null){
				this.$router.push('/panel');
			}
		}
	});

	getRefreshToken().then((value) => {
		if(common.isset(value)){
			if(value !== '' && value !== null){
				this.$router.push('/panel');
			}
		}
	});
}