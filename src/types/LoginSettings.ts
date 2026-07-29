export interface LoginSettings {
	login_limits_flag : boolean,
	two_factor_auth_flag : boolean,
	login_email_flag : boolean,
	login_limits_attempts : number,
	login_limits_minutes : number,
	btn_disabled : boolean,
	loading: boolean
}

export interface LoginBlockSettings extends LoginSettings {
	local_type: string
}