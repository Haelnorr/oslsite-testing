import axios from "axios";

const api = {
    uri: import.meta.env.SRLM_API_URI,
    key: import.meta.env.SRLM_API_APP_KEY
};

// handles response errors from the SRLM API
// will log the error message from SRLM API to the console along with the headers of the failed request
// returns null
function handle_err(err) {
    if (err) {
        if (err.response) {
            console.log(JSON.stringify(err.response.data));
        } else {
            // console.log(err.data)
        }
        console.log(err.request._header);
        return null;
    }
}

/** 
 * Makes a GET request to the SRLM api.
 * Uses axios and environment variables to make a GET request to the SRLM api. If request fails, returns null and logs the API's error message and the request headers to console.
 * 
 * @param {string} endpoint       endpoint for the request - appends to env var SRLM_API_URI
 * @param {string} [user_token]   user auth token - appends to SRLM_API_APP_KEY
 * 
 * @returns response.data
 */
export async function srlm_get(endpoint:string, user_token:string='') {
    const request_url = api['uri'] + endpoint;
    const api_token = api['key'] + user_token;

    return await axios.get(request_url, {
        headers: {
            Authorization: `Bearer ${api_token}`
        }
    }).then((response) => response.data).catch((err) => handle_err(err));
};

// strip a link from the SRLM API of its /api prefix, allowing it to be used for url routing
export function convert_link(link: string) {
    return link.replace('/api', '')
}

/** 
 * Makes a POST request to the SRLM api.
 * Uses axios and environment variables to make a POST request to the SRLM api. If request fails, returns null and logs the API's error message and the request headers to console.
 * 
 * @param {string} endpoint       endpoint for the request - appends to env var SRLM_API_URI
 * @param {string} [user_token]   user auth token - appends to SRLM_API_APP_KEY
 * @param {dict}   [input]        body of the post request
 * 
 * @returns response.data
 */
export async function srlm_post(endpoint: string, user_token:string='', input:{}={}) {
    const request_url = api['uri'] + endpoint;
    const api_token = api['key'] + user_token;

    return await axios.post(request_url, input, {
        headers: {
            Authorization: `Bearer ${api_token}`
        }
    }).then((response) => response.data).catch((err) => handle_err(err));
}

/** 
 * Makes a Basic Auth POST request to the SRLM api.
 * Uses axios and environment variables to make a basic auth request to the SRLM api. If request fails, returns null and logs the API's error message and the request headers to console.
 * 
 * @param {string} username   username of the user
 * @param {string} password   password of the user
 * 
 * @returns response.data
 */
export async function srlm_basic_auth(username: string, password: string) {
    const request_url = api['uri'] + '/auth/user';
    
    return await axios.post(request_url, {}, {
        auth: {
            username: username,
            password: password
        }
    }).then((response) => response.data).catch((err) => handle_err(err));
}


function display_date(date_str: string) {
    var date = new Date(date_str)
    return date.toDateString();
}

export function date_is_none(date_field: any) {
    if (date_field) {
        return display_date(date_field);
    } else {
        return '';
    }
}
