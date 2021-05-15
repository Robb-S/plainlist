/** 
 * All calls to the back-end REST API are made here.  
 * These functions also handle test runMode, just passing back the original object
 * and an OK status, to keep things simple in the calling functions. 
 */

import { makeStringID } from '../util/helpers';
import axios from 'axios';
import * as api from '../util/constants';
import {setAxiosAuthToken} from '../util/helpers';

/**
 * Handle API call to add an item.  Also, add a unique item ID if using test data.
 * 
 * @returns object with new item from API (w/ assigned ID), plus status flag
 */
 const addItemAPI = async (newItem, runMode) => {
  if (runMode===api.RUNMODE_TEST) {
    const dbItem = {...newItem};
    dbItem.id = makeStringID();  // just add a temporary unique ID if test data
    return {dbItem: dbItem, status: api.OK};
  } else {
    const newItemJSON = JSON.stringify(newItem);
    const config = {
      method: "post",
      url: api.API_ITEMS,
      data: newItemJSON,
      headers: api.JSON_HEADER,
    }; 
    try { 
      const responseAddItem = await axios(config);
      return {dbItem: responseAddItem.data, status: api.OK };
    } catch (error) {
      console.log(error);
      return {dbItem: newItem, status: api.FAILED};
    }
  }
}

/**
 * Handle API call for item deletion.
 * 
 * @returns status flag
 */
const deleteItemAPI = async (itemID, runMode) => {
  if (runMode===api.RUNMODE_TEST) {
    return (api.OK); // no API call, so no problem
  } else {
    const config = {
      method: "delete",
      url: api.API_ITEMS + itemID + '/',
    }; 
    try { 
      const responseDeleteItem = await axios(config);
      console.log(responseDeleteItem)
      return (api.OK);
    } catch (error) {
      console.log(error);
      return (api.FAILED);
    }
  }
}

/**
 * API call to update an item.
 * 
 * @returns object with updated item from API call, plus status flag
 */
const updateItemAPI = async (updateItem, runMode) => {
  if (runMode===api.RUNMODE_TEST) {
    const dbItem = {...updateItem};
    return {itemFromAPI: dbItem, status: api.OK};
  } else {
    const itemID = updateItem.id;
    const updateItemJSON = JSON.stringify(updateItem);
    const config = {
      method: "put",
      url: api.API_ITEMS + itemID + '/',
      data: updateItemJSON,
      headers: api.JSON_HEADER,
    }; 
    try { 
      const responseUpdateItem = await axios(config);
      return {itemFromAPI: responseUpdateItem.data, status: api.OK };
    } catch (error) {
      console.log(error);
      return {itemFromAPI: updateItem, status: api.FAILED};
    }
  }
}

/**
 * Get the token to use for the rest of this session.
 * TODO: get it from cookie or trigger login.  Add error handling.
 */
 const getTokenFromAPI = async () => {
  let token = '';
  const loginData = {'username':'admin', 'password':'zdj1superuser'};
  try {
    const responseToken = await axios.post(api.API_AUTH, loginData);
    token = responseToken.data.token;
    setAxiosAuthToken(token);
  } catch (error) {
    console.log(error);
  }
}

/**
 * get data from REST API.
 * TODO: error handling.
 */
const getInitDataByToken = async () => {
  let user = {};
  let uCats, uLists, uItems = [];
  try {
    const responseUsers = await axios.get(api.API_USER_BASIC);
    const userArray = responseUsers.data;
    user = userArray.length>0 ? userArray[0] : [];
    // console.log('fetched user: ');
    // console.log(user);
    const responseCats = await axios.get(api.API_CATS);
    uCats = responseCats.data;
    const responseLists = await axios.get(api.API_LISTS);
    uLists = responseLists.data;
    const responseItems = await axios.get(api.API_ITEMS);
    uItems = responseItems.data;
  } catch (error) {
    console.log(error);
  }
  return { user: user, categories: uCats, lists: uLists, items: uItems };
}


export {
  addItemAPI, updateItemAPI, deleteItemAPI, getTokenFromAPI, getInitDataByToken,
};
