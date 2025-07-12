const BASEURL = "http://localhost:8000/"; /* make sure to have slash in the end */
const CSRF_URL = BASEURL+"sanctum/csrf-cookie/"; /* make sure to have slash in the end */
const APIURL = BASEURL+"api/"; /* make sure to have slash in the end */

const TURNSTILE_KEY = "0x4AAAAAABkh4UG4YNHW-Z84";

export const constants = Object.freeze({
    APIURL: APIURL,
	CSRF_URL:CSRF_URL,
	BASEURL:BASEURL,
	TURNSTILE_KEY:TURNSTILE_KEY
});