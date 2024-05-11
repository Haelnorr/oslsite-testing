import { executionAsyncResource } from "async_hooks";
import axios, { AxiosError } from "axios";
import type { Discord, Player, Token } from "./srlmTypes";

const api = {
    uri: import.meta.env.SRLM_API_URI,
    key: import.meta.env.SRLM_API_APP_KEY
};

export class SRLMAPIError extends Error {
    constructor(message: string, public code: string, public data: {[key: string]:any}) {
        super(message);
        this.name = 'SRLMAPIError';
    }
}

// handles response errors from the SRLM API
function handleError(err: AxiosError): void {
    if (err) {
        var errorMsg: string;
        var errorCode: string;
        var errorData: any = {};
        if (err.code === 'ECONNREFUSED') {
            errorMsg = 'Connection Refused';
            errorCode = '503';
        } else if (err.response) {
            errorCode = err.response.status.toString();
            errorData = err.response.data;
            switch (err.response.status) {
                case 400:
                    errorMsg = 'Bad Request';
                    if ((err.response.data as any).messages) {
                        errorData = (err.response.data as any).messages.json;
                    }
                    break;
                case 401:
                    errorMsg = 'Unauthorized';
                    break;
                case 404:
                    errorMsg = 'Not Found';
                    break;
                case 409:
                    errorMsg = 'Request body data has errors';
                    break;
                case 500:
                    errorMsg = 'Internal Server Error';
                    break;
                default:
                    errorMsg = "Unknown error occured";
            }

        } else {
            errorMsg = "Unknown error occured";
            errorCode = '520';
        }
        throw new SRLMAPIError(errorMsg, errorCode, errorData)
    }
}

/** 
 * Makes a GET request to the SRLM api.
 * Uses axios and environment variables to make a GET request to the SRLM api. If request fails, returns null and logs the API's error message and the request headers to console.
 * 
 * @param {string} endpoint       endpoint for the request - appends to env var SRLM_API_URI
 * @param {string} [userToken]   user auth token - appends to SRLM_API_APP_KEY
 * 
 * @returns response.data
 */
export async function srlmGet(endpoint:string, userToken:string=''): Promise<any> {
    const request_url = api['uri'] + endpoint;
    const api_token = api['key'] + userToken;

    return await axios.get(request_url, {
        headers: {
            Authorization: `Bearer ${api_token}`
        }
    }).then((response) => response.data).catch((err) => handleError(err));
};

// strip a link from the SRLM API of its /api prefix, allowing it to be used for url routing
export function convertLink(link: string): string {
    return link.replace('/api', '')
}

/** 
 * Makes a POST request to the SRLM api.
 * Uses axios and environment variables to make a POST request to the SRLM api. If request fails, returns null and logs the API's error message and the request headers to console.
 * 
 * @param {string} endpoint       endpoint for the request - appends to env var SRLM_API_URI
 * @param {string} [userToken]   user auth token - appends to SRLM_API_APP_KEY
 * @param {dict}   [input]        body of the post request
 * 
 * @returns response.data
 */
export async function srlmPost(endpoint: string, userToken:string='', input:{}={}): Promise<any> {
    const request_url = api['uri'] + endpoint;
    const api_token = api['key'] + userToken;

    return await axios.post(request_url, input, {
        headers: {
            Authorization: `Bearer ${api_token}`
        }
    }).then((response) => response.data).catch((err) => handleError(err));
}

/** 
 * Makes a DELETE request to the SRLM api.
 * Uses axios and environment variables to make a DELETE request to the SRLM api. If request fails, returns null and logs the API's error message and the request headers to console.
 * 
 * @param {string} endpoint       endpoint for the request - appends to env var SRLM_API_URI
 * @param {string} [userToken]   user auth token - appends to SRLM_API_APP_KEY
 * 
 * @returns response.data
 */
export async function srlmDelete(endpoint: string, userToken:string=''): Promise<any> {
    const request_url = api['uri'] + endpoint;
    const api_token = api['key'] + userToken;

    return await axios.delete(request_url, {
        headers: {
            Authorization: `Bearer ${api_token}`
        }
    }).then((response) => response.data).catch((err) => handleError(err));
}

/** 
 * Makes a PUT request to the SRLM api.
 * Uses axios and environment variables to make a PUT request to the SRLM api. If request fails, returns null and logs the API's error message and the request headers to console.
 * 
 * @param {string} endpoint       endpoint for the request - appends to env var SRLM_API_URI
 * @param {string} [userToken]   user auth toke   n - appends to SRLM_API_APP_KEY
 * 
 * @returns response.data
 */
export async function srlmPut(endpoint: string, userToken:string='', input: {}): Promise<any> {
    const request_url = api['uri'] + endpoint;
    const api_token = api['key'] + userToken;

    return await axios.put(request_url, input, {
        headers: {
            Authorization: `Bearer ${api_token}`
        }
    }).then((response) => response.data).catch((err) => handleError(err));
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
export async function srlmBasicAuth(username: string, password: string): Promise<Token> {
    const request_url = api['uri'] + '/auth/user';
    
    return await axios.post(request_url, {}, {
        auth: {
            username: username,
            password: password
        }
    }).then((response) => response.data).catch((err) => handleError(err));
}


function displayDate(date_str: string): string {
    var date = new Date(date_str)
    return date.toDateString();
}

export function dateIsNone(date_field: any): string {
    if (date_field) {
        return displayDate(date_field);
    } else {
        return '';
    }
}

type RGB = {
    r: number,
    g: number,
    b: number
}

function hexToRgb(hex: string): RGB|null {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

function rgbLuminance(rgb: RGB|null): number {
    if (!rgb) {
        return 0.00000000000001
    }
    return (rgb.r*0.2126 + rgb.g*0.7152 + rgb.b*0.0722);
}
  
export function colorCalc(color: string): string {
    const rgb = hexToRgb(`#${color}`);
    const fg_light = '#f0f0f0';
    const fg_dark = '#101010';
    if (rgb) {
        const bg_luminance = rgbLuminance(rgb);
        const fg_light_luminance = rgbLuminance(hexToRgb(fg_light));
        const fg_dark_luminance = rgbLuminance(hexToRgb(fg_dark));
        const contrast_ratio_light = ((fg_light_luminance + 0.05)/(bg_luminance + 0.05));
        const contrast_ratio_dark = ((bg_luminance + 0.05)/(fg_dark_luminance + 0.05));

        if (contrast_ratio_dark > contrast_ratio_light) {
            return `background-color: #${color}; color: ${fg_dark}`;
        } else {
            return `background-color: #${color}; font-color: ${fg_light}`;
        }
    } else {
        return `background-color: #${color}; color: ${fg_dark}`;
    }
}

export async function leaveTeam(player_id: number): Promise<any> {
    return await srlmDelete(`/players/${player_id}/teams`);
}

export async function joinTeam(player_id: number, team_id:string): Promise<any> {
    return await srlmPost(`/players/${player_id}/teams`, '', {team:team_id});
}

export function checkboxToBool(form_data: FormData, field: string): boolean {
    if (form_data.get(field) == 'on') {
        return true;
    } else {
        return false;
    }
}