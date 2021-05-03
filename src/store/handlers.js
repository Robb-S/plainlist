// import {allUsers, allCategories, allLists, allItems} from './testdata';

const handleRemoveItem = async (itemID, dispatch) =>  {
  dispatch({
    type: 'STARTED_LOADING',
  });
  const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(500);
    // simulate deletion of items from an API
    // check for success with API, else show error message
    dispatch({
      type: 'DELETE_ITEM',
      payload: itemID,
    });
    dispatch({
      type: 'FINISHED_LOADING',
    });
  }  

export {handleRemoveItem};
