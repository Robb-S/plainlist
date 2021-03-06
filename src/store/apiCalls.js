/** 
 * All calls to the back-end REST API are gathered here.  
 */
// TODO: remove checks for thirdVar

// import { makeStringID, sleepy } from '../util/helpers';
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
 * in localStorage for future use.  Called during login or user registration.
 */
 const getTokenFromAPI = async (userInfo) => {
  axios.defaults.headers['Cache-Control'] = 'no-cache';
  let token = '';
  const loginData = { 'username':userInfo.userName, 'password':userInfo.userPwd };
  console.log('trying response token');
  try {
    const responseToken = await axios.post(api.API_AUTH, loginData);
    token = responseToken.data.token;
    setAxiosAuthToken(token);
    localStorage.setItem('token', token);
    return api.OK;
  } catch (error) {
    return api.FAILED;
  }
};

// /**
//  * Get user id based on userName. (No longer used, now we fetch by username.)
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
  let uProf = {};
  try {
    // await sleepy(500);
    axios.defaults.headers.get['Cache-Control'] = 'no-cache';
    const responseUsers = await axios.get(api.API_USER_UN+un);
    const userArray = responseUsers.data;
    // console.log('*** users found: ' + userArray.length);
    user = userArray.length>0 ? userArray[0] : []; // or throw an error
    // console.log('name: ' + user.username);
    // await sleepy(500);
    const responseProf = await axios.get(api.API_PROF_UN+un);
    if (responseProf.data[0]!=null) {
      uProf = responseProf.data[0];
    }
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
  return { user: user, profile: uProf, categories: uCats, lists: uLists, items: uItems };
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
    case 'profile': { return api.API_PROF; }
    default: {
      throw new Error(`Unhandled record type: ${recType}`);
    }
  }
};

/**
 * Handle API call to add a record.
 * @returns object with new record from API (w/ assigned ID), plus status flag
 */
 const addRecAPI = async (newRec, recType, thirdVar=null) => {
  if (thirdVar!==null) {
    alert ('fix addRecAPI');
    return null;
  }
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
};

/**
 * Handle API call for record deletion. * 
 * @returns status flag
 */
 const deleteRecAPI = async (recID, recType, thirdVar=null) => {
  if (thirdVar!==null) {
    alert ('fix deleteRecAPI');
    return null;
  }
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
};

/**
 * API call to update a record. 
 * @returns object with updated record from API call, plus status flag
 */
const updateRecAPI = async (updateRec, recType, thirdVar=null) => {
  if (thirdVar!==null) {
    alert ('fix updateRecAPI');
    return null;
  }
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
    // console.log(error.toString());
    // console.log('error 1');
    if (error.response.data.username && error.response.data.username[0]) {
      return error.response.data.username[0];
    }
    if (error.response.data.email && error.response.data.email[0]) {
      return error.response.data.email[0];
    }
    // following is not tested
    // if (error.response.data.password && error.response.data.password[0]) {
    //   return error.response.data.password[0];
    // }
    return error.toString();
  }
};

/**
 * API call for new profile record.  
 */
const makeNewProfileAPI = async (newProfileRec) => {
  console.log('makeNewProfileAPI');
  console.log(newProfileRec);
  const config = {
    method: 'post',
    url: api.API_PROF,
    data: JSON.stringify(newProfileRec),
    headers: api.JSON_HEADER,
  };
  try {
    const response = await axios(config);
    console.log(response);
    return api.OK;
  } catch (error) {
    console.log(error);
    return api.FAILED;
  }
};


export {
  getTokenFromAPI, userExistsAPI, getInitDataByToken,
  addRecAPI, deleteRecAPI, updateRecAPI, makeNewUserAPI, makeNewProfileAPI,
};
