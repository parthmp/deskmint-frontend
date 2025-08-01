import { defineStore } from 'pinia';

export const useThemeOptions = defineStore('themeoptions', {
		state: () => ({
			theme : localStorage.getItem('theme')
		}),
	
		getters: {
			get_theme: function(state){
				return state.theme;
			}
		},
	
		actions: {
			set_theme(t_theme:string) {
				this.theme = t_theme;
				localStorage.setItem('theme', t_theme);
			}
		}
})