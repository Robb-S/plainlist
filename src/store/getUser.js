import {allUsers, allCategories, allLists, allItems} from './testdata';

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
    return oneCategory.userid === userID;
  });
  const uLists = allLists.filter(oneList => {
    return oneList.userid === userID;
  });
  const uItems = allItems.filter(oneItem => {
    return oneItem.userid === userID;
  }); 
  return { categories: uCats, lists: uLists, items: uItems };
}

const handleGetUserAndData = async (userID, dispatch) =>  {
    // simulate loading of items from an API
    const user = await getUserByID(userID);
    const {categories, lists, items} = await getListsByUserID(userID);
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
