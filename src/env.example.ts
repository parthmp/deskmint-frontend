const BASEURL = "http://localhost:8080/"; /* make sure to have slash in the end, this is to connect to the backend */
const FRONTEND_BASEURL = "http://localhost:5173/"; /* make sure to have slash in the end, this is used for auto highlight menus on sidebar on refresh */

const APIURL_POSTFIX = "api/"; /* make sure to have slash in the end */

const API_URL = BASEURL+APIURL_POSTFIX;

const TURNSTILE_KEY = "";
const BUILD = 'v1.0';
const DEFAULT_TABLE_ROWS = 15;

export const env = Object.freeze({
	BASEURL:BASEURL,
	FRONTEND_BASEURL:FRONTEND_BASEURL,
	TURNSTILE_KEY:TURNSTILE_KEY,
	APIURL_POSTFIX:APIURL_POSTFIX,
	BUILD:BUILD,
	API_URL:API_URL,
	DEFAULT_TABLE_ROWS:DEFAULT_TABLE_ROWS
});