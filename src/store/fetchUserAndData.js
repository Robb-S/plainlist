import {allUsers, allCategories, allLists, allItems} from './testdata';
import axios from 'axios';
import {API_AUTH, API_ITEMS, API_LISTS, API_CATS, API_USER_BASIC} from '../util/constants';
import {setAxiosAuthToken} from '../util/helpers';

const getToken = async () => {
  let token = '';
  const loginData = {'username':'admin', 'password':'zdj1superuser'};
  try {
    const responseToken = await axios.post(API_AUTH, loginData);
    token = responseToken.data.token;
    setAxiosAuthToken(token);
  } catch (error) {
    console.log(error);
  }
}

/**
 * get data from API.
 * 
 */
const getListsByToken = async () => {
  // let user = {};
  let user, uCats, uLists, uItems = [];
  try {
    const responseUsers = await axios.get(API_USER_BASIC);
    const userArray = responseUsers.data;
    user = userArray.length>0 ? userArray[0] : [];
    console.log('fetched user: ');
    console.log(user);
    const responseCats = await axios.get(API_CATS);
    uCats = responseCats.data;
    const responseLists = await axios.get(API_LISTS);
    uLists = responseLists.data;
    const responseItems = await axios.get(API_ITEMS);
    uItems = responseItems.data;
  } catch (error) {
    console.log(error);
  }
  return { user: user, categories: uCats, lists: uLists, items: uItems };
}

const fetchListsByUserID = async (userID, testMode) => {
  if (testMode==='testData') {
    const {user, categories, lists, items} = await getListsByUserIDTestData(userID);
    return {user, categories, lists, items};
  }
  if (testMode==='API') {
    // const user = await getUserByID(userID);
    // console.log('user: ');
    // console.log(user);
    const {user, categories, lists, items} = await getListsByToken();
    return {user, categories, lists, items};
  }
}

/**
 * 
 * @param {*} testMode 'testData' or 'API'
 */

const handleGetUserAndData = async (userID, testMode, dispatch) =>  {
    // simulate loading of items from an API
    await getToken();
    const {user, categories, lists, items} = await fetchListsByUserID(userID, testMode);
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
   * Test mode, with dummy data supplied.  Simulated delay.
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
