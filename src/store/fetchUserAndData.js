import { allUsers, allCategories, allLists, allItems } from './testdata';
import * as api from '../util/constants';
import { getInitDataByToken } from './apiCalls';
import { isMobile } from 'react-device-detect';
import { setAxiosAuthToken, sleepy } from '../util/helpers';

/**
 * Fetch data objects and return them.
 */
const fetchListsByUserID = async (userID, loginName, runMode) => {
  if (runMode===api.RUNMODE_API) {
    const { user, profile, categories, lists, items } = await getInitDataByToken(loginName);
    return { user, profile, categories, lists, items };
  }
  if (runMode===api.RUNMODE_DEMO) {
    const { user, categories, lists, items } = await getListsByUserIDTestData(userID);
    return { user, categories, lists, items };
  }
};

/**
 * Get user and list data from test data or real API, handle dispatch to store
 * 
 * @param {*} runMode 'testData' or 'API'
 */
const handleGetUserAndData = async (userID, loginName, runMode, dispatch) =>  {
  console.log('** handleGetUserAndData userID ' + userID);
  const { user, profile, categories, lists, items } = await fetchListsByUserID(userID, loginName, runMode);
  // await sleepy(500);
  dispatch({
    type: 'SET_USER',
    payload: { user:user, profile:profile },
  });
  dispatch({
    type: 'SET_LISTS',
    payload: {
      categories: categories,
      lists: lists,
      items: items,
    },
  });
  dispatch({
    type: 'FINISHED_LOADING',
  });
};

/**
 * Test mode, with dummy data supplied and simulated delay.
 */
const getListsByUserIDTestData = async (userID) => {
  // simulate data fetch delay from API.
  const delay = ms => new Promise(res => setTimeout(res, ms));
  await delay(500);
  const matchingID = allUsers.filter(oneUser => {
    return oneUser.id === userID;
  });
  const user = matchingID.length>0 ? matchingID[0] : null;
  const uCats = allCategories.filter(oneCategory => {
    return oneCategory.userID === userID;
  });
  const uLists = allLists.filter(oneList => {
    return oneList.userID === userID;
  });
  const uItems = allItems.filter(oneItem => {
    return oneItem.userID === userID;
  });
  return { user: user, categories: uCats, lists: uLists, items: uItems };
};

/**
 * Set the runMode flag in store. Flag is used to skip API steps when using test data.
 * 
 * @param runMode - api.RUNMODE_API or api.RUNMODE_DEMO from constants file
 */
 const handleSetRunModeAndInitLoad = async (testUserId, runMode, dispatch) => {
  await dispatch({
    type: 'SET_RUNMODE',
    payload: runMode,
  });
  if (runMode===api.RUNMODE_API) {
    // console.log('*** handleSetRunMode for API');
    let token = localStorage.getItem('token');
    let loginName = localStorage.getItem('loginName');
    console.log('token: ' + token);
    console.log('loginName: ' + loginName);
    if (token!==null) { // if found, then set logged in = true
      setAxiosAuthToken(token);
      await dispatch({
        type: 'USER_LOGIN',
        payload: { loginName: loginName },
      });
      await handleGetUserAndData(testUserId, loginName, runMode, dispatch);
      // console.log('***** loading init data with handleSetRunMode in handlers *****');
      const flatCookie = localStorage.getItem('flat');
      if (flatCookie!==null) { // now set it in state (TEMP)
        const flatBool = flatCookie==='true';
        await dispatch({
          type: 'SET_FLAT',
          payload: flatBool,
        });
      }
      await dispatch({
        type: 'FINISHED_LOADING',
      });
    }
    await dispatch({
      type: 'SET_IS_MOBILE',
      payload: isMobile,
    });
  }
  if (runMode===api.RUNMODE_DEMO) {
    const loginName = '';
    await dispatch({
      type: 'USER_LOGIN',
      payload: { loginName: '' },
    });
    await dispatch({
      type: 'SET_IS_MOBILE',
      payload: isMobile,
    });
    await handleGetUserAndData(testUserId, loginName, runMode, dispatch); // load from data file
    // console.log('***** loading init data with handleSetRunMode in handlers *****');
    await dispatch({
      type: 'FINISHED_LOADING',
    });
  }
};

export { handleSetRunModeAndInitLoad, handleGetUserAndData };
