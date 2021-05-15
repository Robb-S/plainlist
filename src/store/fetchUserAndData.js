import {allUsers, allCategories, allLists, allItems} from './testdata';
import * as api from '../util/constants';
import {getTokenFromAPI, getInitDataByToken} from './apiCalls';

/**
 * Fetch data objects and return them.
 */
const fetchListsByUserID = async (userID, runMode) => {
  if (runMode===api.RUNMODE_API) {
    await getTokenFromAPI();
    const {user, categories, lists, items} = await getInitDataByToken();
    return {user, categories, lists, items};
  }
  if (runMode===api.RUNMODE_TEST) {
    const {user, categories, lists, items} = await getListsByUserIDTestData(userID);
    return {user, categories, lists, items};
  }
}

/**
 * Get user and list data from test data or real API, handle dispatch to store
 * 
 * @param {*} runMode 'testData' or 'API'
 */
const handleGetUserAndData = async (userID, runMode, dispatch) =>  {
    const {user, categories, lists, items} = await fetchListsByUserID(userID, runMode);
    dispatch({
      type: 'SET_USER',
      payload: {user},
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
  }  

  /**
   * Test mode, with dummy data supplied and simulated delay.
   */
  const getListsByUserIDTestData = async (userID) => {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(500);
    const matchingID = allUsers.filter(oneUser => {
      return oneUser.id === userID
    })
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
  }

export {handleGetUserAndData};
