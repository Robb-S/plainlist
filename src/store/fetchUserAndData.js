import {allUsers, allCategories, allLists, allItems} from './testdata';
import axios from 'axios';

const getUserByID = async (userID) => {
  const delay = ms => new Promise(res => setTimeout(res, ms));
  await delay(500);
  const matchingID = allUsers.filter(oneUser => {
    return oneUser.id === userID
  })
  return matchingID.length>0 ? matchingID[0] : null;
}

const getListsByUserID = async (userID) => {
  const delay = ms => new Promise(res => setTimeout(res, ms));
  await delay(500);
  const uCats = allCategories.filter(oneCategory => {
    return oneCategory.userID === userID;
  });
  const uLists = allLists.filter(oneList => {
    return oneList.userID === userID;
  });
  const uItems = allItems.filter(oneItem => {
    return oneItem.userID === userID;
  }); 
  return { categories: uCats, lists: uLists, items: uItems };
}


const getListsByUserIDTestAPI = async (userID) => {
  const delay = ms => new Promise(res => setTimeout(res, ms));
  await delay(500);
  let uCats = allCategories.filter(oneCategory => {
    return oneCategory.userID === userID;
  });
  let uLists = allLists.filter(oneList => {
    return oneList.userID === userID;
  });
  let uItems = allItems.filter(oneItem => {
    return oneItem.userID === userID;
  }); 

  //console.log(uCats);
  const api1 = 'http://127.0.0.1:8000/itembyusertest/?userid=1';
  const api2 = 'http://127.0.0.1:8000/listbyusertest/?userid=1';
  const api3 = 'http://127.0.0.1:8000/categorybyusertest/?userid=1';
  try {
    const response3 = await axios.get(api3);
    // Success 🎉
    uCats = response3.data;
    //console.log(uCats);
  } catch (error) {
    console.log(error);
  }
  try {
    const response2 = await axios.get(api2);
    // Success 🎉
    uLists = response2.data;
    //console.log(uLists);
  } catch (error) {
    console.log(error);
  }
  try {
    const response1 = await axios.get(api1);
    // Success 🎉
    uItems = response1.data;
    //console.log(uItems);
  } catch (error) {
    console.log(error);
  }  

  return { categories: uCats, lists: uLists, items: uItems };
}

const fetchListsByUserID = async (userID, mode) => {
  if (mode==='simulated') {
    const {categories, lists, items} = await getListsByUserID(userID);
    return {categories, lists, items};
  }
  if (mode==='testAPI') {
    const {categories, lists, items} = await getListsByUserIDTestAPI(userID);
    return {categories, lists, items};
  }
}

const handleGetUserAndData = async (userID, mode, dispatch) =>  {
    // simulate loading of items from an API
    const user = await getUserByID(userID);
    const {categories, lists, items} = await fetchListsByUserID(userID, mode);
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

export {getUserByID, handleGetUserAndData};
