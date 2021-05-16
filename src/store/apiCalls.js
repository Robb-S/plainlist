/** 
 * All calls to the back-end REST API are gathered here.  
 * These functions also handle test runMode, just passing back the original object
 * and an OK status, to keep things simple in the calling functions. 
 */

import { makeStringID } from '../util/helpers';
import axios from 'axios';
import * as api from '../util/constants';
import {setAxiosAuthToken} from '../util/helpers';

/**
 * See if username is already used in Django database, to ensure uniqueness.
 * Used in registration form on each keystroke (debounced) as username is typed in. 
 */
const userExistsAPI = async (userName) => {
  const config = {
    method: "get",
    url: api.API_IS_USER + userName + '/',
  }
  try { 
    const responseUserExists = await axios(config);
    // console.log(responseUserExists.data.userExists);
    return {userExists: responseUserExists.data.userExists, status: api.OK };
  } catch (error) {
    // console.log(error);
    return {userExists: null, status: api.FAILED};
  }  
}

/**
 * Get the token to use for this user, use it to set axios header, and store it
 * in localStorage for future use.
 */
 const getTokenFromAPI = async (userInfo) => {
  let token = '';
  const loginData = {'username':userInfo.userName, 'password':userInfo.userPwd};
  try {
    const responseToken = await axios.post(api.API_AUTH, loginData);
    token = responseToken.data.token;
    setAxiosAuthToken(token);
    localStorage.setItem('token', token);
    return api.OK;
  } catch (error) {
    return api.FAILED;
  }
}

/**
 * Get data from REST API for initial setup when app is started (or upon login).
 * TODO: error handling.
 */
 const getInitDataByToken = async () => {
  let user = {};
  let uCats, uLists, uItems = [];
  try {
    const responseUsers = await axios.get(api.API_USER_BASIC);
    const userArray = responseUsers.data;
    user = userArray.length>0 ? userArray[0] : []; // or throw an error
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

/**
 * Handle API call to add an item.  Also, add a unique item ID if using test data.
 * 
 * @returns object with new item from API (w/ assigned ID), plus status flag
 */
 const addItemAPI = async (newItem, runMode) => {
  if (runMode===api.RUNMODE_DEMO) {
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
      const response = await axios(config);
      return {dbItem: response.data, status: api.OK };
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
  if (runMode===api.RUNMODE_DEMO) {
    return (api.OK); // no API call, so no problem
  } else {
    const config = {
      method: "delete",
      url: api.API_ITEMS + itemID + '/',
    }; 
    try { 
      const response = await axios(config);
      console.log(response)
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
  if (runMode===api.RUNMODE_DEMO) {
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
      const response = await axios(config);
      return {itemFromAPI: response.data, status: api.OK };
    } catch (error) {
      console.log(error);
      return {itemFromAPI: updateItem, status: api.FAILED};
    }
  }
}


/**
 * Handle API call to add a category.  Also, add a unique item ID if using test data.
 * 
 * @returns object with new category from API (w/ assigned ID), plus status flag
 */
 const addCatAPI = async (newCategory, runMode) => {
  if (runMode===api.RUNMODE_DEMO) {
    const dbCategory = {...newCategory};
    dbCategory.id = makeStringID();  // just add a temporary unique ID if test data
    return {dbCategory: dbCategory, status: api.OK};
  } else {
    const newCategoryJSON = JSON.stringify(newCategory);
    const config = {
      method: "post",
      url: api.API_CATS,
      data: newCategoryJSON,
      headers: api.JSON_HEADER,
    }; 
    try { 
      const response = await axios(config);
      return {dbCategory: response.data, status: api.OK };
    } catch (error) {
      console.log(error);
      return {dbCategory: newCategory, status: api.FAILED};
    }
  }
}

/**
 * Handle API call for category deletion.
 * 
 * @returns status flag
 */
const deleteCatAPI = async (categoryID, runMode) => {
  if (runMode===api.RUNMODE_DEMO) {
    return (api.OK); // no API call, so no problem
  } else {
    const config = {
      method: "delete",
      url: api.API_CATS + categoryID + '/',
    }; 
    try { 
      const response = await axios(config);
      console.log(response)
      return (api.OK);
    } catch (error) {
      console.log(error);
      return (api.FAILED);
    }
  }
}

/**
 * API call to update a category.
 * 
 * @returns object with updated category from API call, plus status flag
 */
const updateCatAPI = async (updateCategory, runMode) => {
  if (runMode===api.RUNMODE_DEMO) {
    const dbCategory = {...updateCategory};
    return {categoryFromAPI: dbCategory, status: api.OK};
  } else {
    const categoryID = updateCategory.id;
    const updateCategoryJSON = JSON.stringify(updateCategory);
    const config = {
      method: "put",
      url: api.API_CATS + categoryID + '/',
      data: updateCategoryJSON,
      headers: api.JSON_HEADER,
    }; 
    try { 
      const response = await axios(config);
      return {categoryFromAPI: response.data, status: api.OK };
    } catch (error) {
      console.log(error);
      return {categoryFromAPI: updateCategory, status: api.FAILED};
    }
  }
}

/**
 * Handle API call to add a list.  Also, add a unique list ID if using test data.
 * 
 * @returns object with new list from API (w/ assigned ID), plus status flag
 */
 const addListAPI = async (newList, runMode) => {
  if (runMode===api.RUNMODE_DEMO) {
    const dbList = {...newList};
    dbList.id = makeStringID();  // just add a temporary unique ID if test data
    return {dbList: dbList, status: api.OK};
  } else {
    const newListJSON = JSON.stringify(newList);
    const config = {
      method: "post",
      url: api.API_LISTS,
      data: newListJSON,
      headers: api.JSON_HEADER,
    }; 
    try { 
      const response = await axios(config);
      return {dbList: response.data, status: api.OK };
    } catch (error) {
      console.log(error);
      return {dbList: newList, status: api.FAILED};
    }
  }
}

/**
 * Handle API call for list deletion.
 * 
 * @returns status flag
 */
const deleteListAPI = async (listID, runMode) => {
  if (runMode===api.RUNMODE_DEMO) {
    return (api.OK); // no API call, so no problem
  } else {
    const config = {
      method: "delete",
      url: api.API_LISTS + listID + '/',
    }; 
    try { 
      const response = await axios(config);
      console.log(response)
      return (api.OK);
    } catch (error) {
      console.log(error);
      return (api.FAILED);
    }
  }
}

/**
 * API call to update a list.
 * 
 * @returns object with updated list from API call, plus status flag
 */
const updateListAPI = async (updateList, runMode) => {
  if (runMode===api.RUNMODE_DEMO) {
    const dbList = {...updateList};
    return {listFromAPI: dbList, status: api.OK};
  } else {
    const listID = updateList.id;
    const updateListJSON = JSON.stringify(updateList);
    const config = {
      method: "put",
      url: api.API_LISTS + listID + '/',
      data: updateListJSON,
      headers: api.JSON_HEADER,
    }; 
    try { 
      const response = await axios(config);
      return {listFromAPI: response.data, status: api.OK };
    } catch (error) {
      console.log(error);
      return {listFromAPI: updateList, status: api.FAILED};
    }
  }
}

export {
  addItemAPI, updateItemAPI, deleteItemAPI, addCatAPI, updateCatAPI, deleteCatAPI, 
  addListAPI, updateListAPI, deleteListAPI, 
  getTokenFromAPI, userExistsAPI, getInitDataByToken,
};
