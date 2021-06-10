/* eslint-disable */
const API_BASE = 'http://127.0.0.1:8000';
// const API_BASE = 'http://192.168.1.7:8000'; // access from LAN!
export const API_AUTH = API_BASE + '/api-token-auth/';
export const API_ITEMS = API_BASE + '/itembyuser/';
export const API_LISTS = API_BASE + '/listbyuser/';
export const API_CATS = API_BASE + '/categorybyuser/';
export const API_USER_BASIC = API_BASE + '/thisuser/';
export const API_IS_USER = API_BASE + '/isuser/';
export const RUNMODE_DEMO = 'testData';
export const RUNMODE_API = 'API';
export const OK = 'OK';
export const FAILED = 'FAILED';
export const MSG_FAILED = 'Sorry, database item operation failed. Please check your internet connection or try again.';
export const MSG_LOGIN_FAILED = 'Sorry, user login failed.';
export const WARN_USER_EXISTS = 'Username not available.';
export const MSG_USER_AVAILABLE = 'Username is available';
export const JSON_HEADER = { "Content-Type": "application/json" };
