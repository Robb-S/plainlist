/* eslint-disable */
const API_BASE = process.env.REACT_APP_API_BASE;
export const API_AUTH = API_BASE + '/api-token-auth/';        // Django authentication
export const API_ITEMS = API_BASE + '/itembyuser/';           // for editing
export const API_LISTS = API_BASE + '/listbyuser/';           // for editing
export const API_CATS = API_BASE + '/categorybyuser/';        // for editing
export const API_LISTS_UN = API_BASE + '/listbyusername/';    // initial fetch
export const API_CATS_UN = API_BASE + '/categorybyusername/'; // initial fetch
export const API_ITEMS_UN = API_BASE + '/itembyusername/';    // initial fetch
export const API_USER_UN = API_BASE + '/userbyusername/';     // initial fetch
export const API_IS_USER = API_BASE + '/isuser/';
export const RUNMODE_DEMO = 'DEMO';
export const RUNMODE_API = 'API';
export const OK = 'OK';
export const FAILED = 'FAILED';
export const MSG_FAILED = 'Sorry, database item operation failed. Please check your internet connection or try again.';
export const MSG_LOGIN_FAILED = 'Sorry, user login failed.';
export const WARN_USER_EXISTS = 'Username not available.';
export const MSG_USER_AVAILABLE = 'Username is available';
export const JSON_HEADER = { "Content-Type": "application/json" };

export const API_ITEMS_ID = API_BASE + '/itembyuserid/';    // ** testing only - REMOVE
// export const API_USER_BASIC = API_BASE + '/thisuser/';
export const API_GET_USER_ID = API_BASE + '/getuserid/';