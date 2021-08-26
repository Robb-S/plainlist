import { allUsers, allCategories, allLists, allItems } from './testdata';
import * as api from '../util/constants';
import { getInitDataByToken } from './apiCalls';
import { isMobile } from 'react-device-detect';
import { setAxiosAuthToken, sleepy } from '../util/helpers';

/**
 * Fetch data objects and return them.
 */
const fetchListsByUserID = async (loginName) => {
    const { user, profile, categories, lists, items } = await getInitDataByToken(loginName);
    return { user, profile, categories, lists, items };
};

/**
 * Get user and list data from test data or real API, handle dispatch to store.
 * This is called either at startup time (if user is logged in), or from login handler.
 * loginName is used, and matched at the API endpoint with the token.
 */
const handleGetUserAndData = async (loginName, dispatch) =>  {
  const { user, profile, categories, lists, items } = await
    fetchListsByUserID(loginName);
  await dispatch({
    type: 'SET_USER',
    payload: { user:user, profile:profile },
  });
  await dispatch({
    type: 'SET_LISTS',
    payload: {
      categories: categories,
      lists: lists,
      items: items,
    },
  });
  await dispatch({
    type: 'FINISHED_LOADING',
  });
};

// /**
//  * Test mode, with dummy data supplied and simulated delay.
//  */
// const getListsByUserIDTestData = async (userID) => {
//   // simulate data fetch delay from API.
//   const delay = ms => new Promise(res => setTimeout(res, ms));
//   await delay(500);
//   const matchingID = allUsers.filter(oneUser => {
//     return oneUser.id === userID;
//   });
//   const user = matchingID.length>0 ? matchingID[0] : null;
//   const uCats = allCategories.filter(oneCategory => {
//     return oneCategory.userID === userID;
//   });
//   const uLists = allLists.filter(oneList => {
//     return oneList.userID === userID;
//   });
//   const uItems = allItems.filter(oneItem => {
//     return oneItem.userID === userID;
//   });
//   return { user: user, categories: uCats, lists: uLists, items: uItems };
// };

/**
 * Get token from local storage (only available when logged in), then handle login and
 * make call to fetch data from API.  This is called from App startup.  If user is not
 * logged in, then handleGetUserAndData fetch is called from the login handler instead.
 */
const handleInitLoad = async (dispatch) => {
  let token = localStorage.getItem('token');
  let loginName = localStorage.getItem('loginName');
  if (token!==null) { // if found, then set logged in = true
    setAxiosAuthToken(token);
    await dispatch({
      type: 'USER_LOGIN',
      payload: { loginName: loginName },
    });
    await handleGetUserAndData(loginName, dispatch);
    await dispatch({
      type: 'FINISHED_LOADING',
    });
  }
  await dispatch({
    type: 'SET_IS_MOBILE',
    payload: isMobile,
  });
};

export { handleInitLoad, handleGetUserAndData };
