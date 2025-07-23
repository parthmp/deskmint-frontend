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
        redirectUsersToLogin.call(this);
      }
    });
  }
};

function redirectUsersToLogin() {

	getAccessToken().then((value) => {
		if(!common.isset(value) || value === null || value === ''){
			this.$router.push('/');
		}
	});

	getRefreshToken().then((value) => {
		if(!common.isset(value) || value === null || value === ''){
			this.$router.push('/');
		}
	});
}