const BASEURL = "http://192.168.29.5:8000/"; /* make sure to have slash in the end */
const SAME_BASE_URL_FOR_PHONES = false; /* change it to true only if you are compiling android app yourself. */

const CSRF_URL = BASEURL+"sanctum/csrf-cookie/"; /* make sure to have slash in the end */
const APIURL_POSTFIX = "api/"; /* make sure to have slash in the end */

const TURNSTILE_KEY = "0x4AAAAAABkh4UG4YNHW-Z84";
const BUILD = 'v1.0';


export const constants = Object.freeze({
	CSRF_URL:CSRF_URL,
	BASEURL:BASEURL,
	TURNSTILE_KEY:TURNSTILE_KEY,
	APIURL_POSTFIX:APIURL_POSTFIX,
	BUILD:BUILD,
	SAME_BASE_URL_FOR_PHONES:SAME_BASE_URL_FOR_PHONES
});