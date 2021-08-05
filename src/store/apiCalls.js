/** 
 * All calls to the back-end REST API are gathered here.  
 * These functions also handle test runMode, just passing back the original object
 * and an OK status, to keep things simple in the calling functions. 
 */

import { makeStringID, sleepy } from '../util/helpers';
import axios from 'axios';
import * as api from '../util/constants';
import { setAxiosAuthToken } from '../util/helpers';

/**
 * See if username is already used in Django database, to ensure uniqueness.
 * Used in registration form on each keystroke (debounced) as username is typed in. 
 */
const userExistsAPI = async (userName) => {
  const config = {
    method: 'get',
    url: api.API_IS_USER + userName + '/',
  };
  try {
    const responseUserExists = await axios(config);
    // console.log(responseUserExists.data.userExists);
    return { userExists: responseUserExists.data.userExists, status: api.OK };
  } catch (error) {
    // console.log(error);
    return { userExists: null, status: api.FAILED };
  }
};

/**
 * Get the token to use for this user, use it to set axios header, and store it
 * in localStorage for future use.
 */
 const getTokenFromAPI = async (userInfo) => {
  axios.defaults.headers['Cache-Control'] = 'no-cache';
  let token = '';
  const loginData = { 'username':userInfo.userName, 'password':userInfo.userPwd };
  console.log('** getting token **');
  console.log(loginData);
  console.log('trying response token');
  try {
    const responseToken = await axios.post(api.API_AUTH, loginData);
    console.log('response token received');
    token = responseToken.data.token;
    console.log(token);
    setAxiosAuthToken(token);
    localStorage.setItem('token', token);
    return api.OK;
  } catch (error) {
    return api.FAILED;
  }
};

// /**
//  * get user id based on userName, because fetching data via token was sometimes 
//  * returning wrong user's data.
//  */
// const getUserID = async (loginName) => {
//   console.log('** getUserID');
//   const getURL = api.API_GET_USER_ID + loginName;
//   try {
//     const responseUserID = await axios.get(getURL);
//     const userID = responseUserID.data.userID;
//     console.log('** fetched userid: ' + userID);
//     localStorage.setItem('userID', userID);
//     return userID;
//   } catch (error) {
//     console.log(error);
//     return api.FAILED;
//   }
// };

/**
 * Get data from REST API for initial setup when app is started (or upon login).
 * TODO: error handling.
 */
const getInitDataByToken = async (loginName) => {
  console.log('** getInitDataByToken');
  const un = loginName;
  let user = {};
  let uCats, uLists, uItems = [];
  try {
    // await sleepy(500);
    axios.defaults.headers.get['Cache-Control'] = 'no-cache';
    const responseUsers = await axios.get(api.API_USER_UN+un);
    const userArray = responseUsers.data;
    // console.log('*** users found: ' + userArray.length);
    user = userArray.length>0 ? userArray[0] : []; // or throw an error
    // console.log('name: ' + user.username);
    // await sleepy(500);
    const responseCats = await axios.get(api.API_CATS_UN+un);
    uCats = responseCats.data;
    const responseLists = await axios.get(api.API_LISTS_UN+un);
    uLists = responseLists.data;
    console.log('Lists: ' + uLists.length);
    const responseItems = await axios.get(api.API_ITEMS_UN+un);
    uItems = responseItems.data;
  } catch (error) {
    console.log(error);
  }
  return { user: user, categories: uCats, lists: uLists, items: uItems };
};

// Next come generic API calls to add, delete or update records.

/**
 * Return URL for API call depending on record type.
 * 
 * @param {*} recType = 'item', 'category' or 'list'
 * @returns API URL (from constants file).
 */
const recTypeToAPIUrl = (recType) => {
  switch (recType) {
    case 'item': { return api.API_ITEMS; }
    case 'list': { return api.API_LISTS; }
    case 'category': { return api.API_CATS; }
    default: {
      throw new Error(`Unhandled record type: ${recType}`);
    }
  }
};

/**
 * Handle API call to add a record.  Also, add a unique ID if using test data. 
 * @returns object with new record from API (w/ assigned ID), plus status flag
 */
 const addRecAPI = async (newRec, runMode, recType) => {
  if (runMode===api.RUNMODE_DEMO) {
    const dbRec = { ...newRec };
    dbRec.id = makeStringID();  // just add a temporary unique ID if test data
    return { dbRec: dbRec, status: api.OK };
  } else {
    const newRecJSON = JSON.stringify(newRec);
    const config = {
      method: 'post',
      url: recTypeToAPIUrl(recType),
      data: newRecJSON,
      headers: api.JSON_HEADER,
    };
    try {
      const response = await axios(config);
      return { dbRec: response.data, status: api.OK };
    } catch (error) {
      console.log(error);
      return { dbRec: newRec, status: api.FAILED };
    }
  }
};

/**
 * Handle API call for record deletion. * 
 * @returns status flag
 */
 const deleteRecAPI = async (recID, runMode, recType) => {
  if (runMode===api.RUNMODE_DEMO) {
    return (api.OK); // no API call, so no problem
  } else {
    const config = {
      method: 'delete',
      url: recTypeToAPIUrl(recType) + recID + '/',
    };
    try {
      const response = await axios(config);
      // console.log(response);
      return (api.OK);
    } catch (error) {
      console.log(error);
      return (api.FAILED);
    }
  }
};


/**
 * API call to update a record. 
 * @returns object with updated record from API call, plus status flag
 */
const updateRecAPI = async (updateRec, runMode, recType) => {
  if (runMode===api.RUNMODE_DEMO) {
    const dbRec = { ...updateRec };
    return { dbRec: dbRec, status: api.OK };
  } else {
    const recID = updateRec.id;
    const updateRecJSON = JSON.stringify(updateRec);
    const config = {
      method: 'put',
      url: recTypeToAPIUrl(recType) + recID + '/',
      data: updateRecJSON,
      headers: api.JSON_HEADER,
    };
    try {
      const response = await axios(config);
      return { dbRec: response.data, status: api.OK };
    } catch (error) {
      console.log(error);
      return { dbRec: updateRec, status: api.FAILED };
    }
  }
};

/**
 * API call to set up new record.
 */
const makeNewUserAPI = async (newUserRec) => {
  console.log('makeNewUserAPI');
  console.log(newUserRec);
  const config = {
    method: 'post',
    url: api.API_REG,
    data: JSON.stringify(newUserRec),
    headers: api.JSON_HEADER,
  };
  try {
    const response = await axios(config);
    // console.log(responseUserExists.data.userExists);
    console.log(response);
    return api.OK;
  } catch (error) {
    console.log(error);
    return api.FAILED;
  }
};

export {
  getTokenFromAPI, userExistsAPI, getInitDataByToken,
  addRecAPI, deleteRecAPI, updateRecAPI, makeNewUserAPI,
};
