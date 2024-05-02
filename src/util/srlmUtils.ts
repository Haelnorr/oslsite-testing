import axios, { AxiosError } from "axios";

const api = {
    uri: import.meta.env.SRLM_API_URI,
    key: import.meta.env.SRLM_API_APP_KEY
};

// handles response errors from the SRLM API
// will log the error message from SRLM API to the console along with the headers of the failed request
// returns null
function handle_err(err: AxiosError) {
    if (err) {       
        if (err.code === 'ECONNREFUSED') {
            return '503'
        } else if (err.response) {
            console.log(err.response.status)
            if (err.response.status === 409) {
                // this will check if status code is 409 (only used for input errors on post/put requests)
                // and returns the response which contains error messages that can be displayed on the form
                return err.response;
            } else {
                if (err.response.data['messages']) {
                    console.error(JSON.stringify(err.response.data));
                } else {
                    console.error(err.response.data);
                }
                return null
            }
            
        }
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
 * Makes a DELETE request to the SRLM api.
 * Uses axios and environment variables to make a DELETE request to the SRLM api. If request fails, returns null and logs the API's error message and the request headers to console.
 * 
 * @param {string} endpoint       endpoint for the request - appends to env var SRLM_API_URI
 * @param {string} [user_token]   user auth token - appends to SRLM_API_APP_KEY
 * 
 * @returns response.data
 */
export async function srlm_delete(endpoint: string, user_token:string='') {
    const request_url = api['uri'] + endpoint;
    const api_token = api['key'] + user_token;

    return await axios.delete(request_url, {
        headers: {
            Authorization: `Bearer ${api_token}`
        }
    }).then((response) => response.data).catch((err) => handle_err(err));
}

/** 
 * Makes a PUT request to the SRLM api.
 * Uses axios and environment variables to make a PUT request to the SRLM api. If request fails, returns null and logs the API's error message and the request headers to console.
 * 
 * @param {string} endpoint       endpoint for the request - appends to env var SRLM_API_URI
 * @param {string} [user_token]   user auth toke   n - appends to SRLM_API_APP_KEY
 * 
 * @returns response.data
 */
export async function srlm_put(endpoint: string, user_token:string='', input: {}) {
    const request_url = api['uri'] + endpoint;
    const api_token = api['key'] + user_token;

    return await axios.put(request_url, input, {
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


function hexToRgb(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

function rgbLuminance(rgb: {b:number, g:number, r:number}) {
    return (rgb.r*0.2126 + rgb.g*0.7152 + rgb.b*0.0722);
}
  
export function color_calc(color: string) {
    const rgb = hexToRgb(`#${color}`);
    const bg_luminance = rgbLuminance(rgb);
    const fg_light = '#f0f0f0';
    const fg_dark = '#101010';
    const fg_light_luminance = rgbLuminance(hexToRgb(fg_light));
    const fg_dark_luminance = rgbLuminance(hexToRgb(fg_dark));
    const contrast_ratio_light = ((fg_light_luminance + 0.05)/(bg_luminance + 0.05));
    const contrast_ratio_dark = ((bg_luminance + 0.05)/(fg_dark_luminance + 0.05));

    if (contrast_ratio_dark > contrast_ratio_light) {
        return `background-color: #${color}; color: ${fg_dark}`;
    } else {
        return `background-color: #${color}; font-color: ${fg_light}`;
    }
}

export async function leave_team(player_id: number) {
    await srlm_delete(`/players/${player_id}/teams`);
}

export async function join_team(player_id: number, team_id:string) {
    return await srlm_post(`/players/${player_id}/teams`, '', {team:team_id});
}

export function checkbox_to_bool(form_data: FormData, field: string) {
    if (form_data.get(field) == 'on') {
        return true;
    } else {
        return false;
    }
}