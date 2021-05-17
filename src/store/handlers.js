import {confirmQuest, makeHighestNumericAttribute, AreObjectsDifferent } from '../util/helpers';
import {getItemRec, getItemsByListID} from './getData';
// import axios from 'axios';
import * as api from '../util/constants';
import {addRecAPI, deleteRecAPI, updateRecAPI, getTokenFromAPI} from './apiCalls';
import {handleGetUserAndData} from './fetchUserAndData';
import {setAxiosAuthToken} from '../util/helpers';

/**
 * Take new itemName and itemNote from input, then  add a
 * high sortOder attribute so it sorts to the top of the list.
 * ID and other attributes will be taken care of by REST API.
 */
const handleAddItem = async (newItem, state, dispatch) => {
  const items = state.items;
  dispatch({
    type: 'STARTED_LOADING',
  });
  // add high sortOrder to make it sort to beginning of list
  newItem.sortOrder = makeHighestNumericAttribute(items, 'sortOrder');
  const {dbRec, status} = await addRecAPI(newItem, state.runMode, 'item');
  if (status===api.OK) {
    dispatch({
      type: 'ADD_ITEM',
      payload: dbRec,
    });
  } else {
    alert (api.MSG_FAILED);
  }
  dispatch({
    type: 'FINISHED_LOADING',
  });
}

/**
 * Take login info, get auth token from Django API call (if login info works).
 * (That API caller function will also set axios header and local storage.)
 * Then set login flag to true, get initial data from API, set loading flag to false.
 * If login fails, keep logged in flag false, loading flag true, and show error message.
 */
 const handleLogin = async (userInfo, state, dispatch) => {
  dispatch({
    type: 'STARTED_LOADING',
  });
  const status = await getTokenFromAPI(userInfo);
  if (status===api.OK) {
    dispatch({
      type: 'USER_LOGIN',
    });
    await handleGetUserAndData(null, api.RUNMODE_API, dispatch);
    // console.log('***** loading init data with handleLogin in handlers *****');
    dispatch({
      type: 'FINISHED_LOADING',
    });
  } else {
    alert (api.MSG_LOGIN_FAILED);
  }
}

/**
 * Reset state and delete from localStorage.
 */
const handleLogout = async (dispatch) => {
  // console.log('* handleLogout');
  await dispatch({
    type: 'STARTED_LOADING',
  });
  await dispatch({
    type: 'USER_LOGOUT',
  });
  localStorage.removeItem('token');
  await dispatch({
    type: 'FINISHED_LOADING',
  });
}

/**
 * Take new itemName and itemNote from input, then  add a
 * high sortOder attribute so it sorts to the top of the list.
 * ID and other attributes will be taken care of by REST API.
 */
 const handleReg = async (userInfo, state, dispatch) => {
   console.log('**handleReg called');
   console.log(userInfo);
   return ('success2');
  // dispatch({
  //   type: 'STARTED_LOADING',
  // });
  // const status = await getToken2(userInfo);
  // if (status===api.OK) {
  //   dispatch({
  //     type: 'USER_LOGIN',
  //   });
  //   await handleGetUserAndData(null, api.RUNMODE_API, dispatch);
  //   dispatch({
  //     type: 'FINISHED_LOADING',
  //   });
  // } else {
  //   alert (api.MSG_LOGIN_FAILED);
  // }
}

const handleRemoveItem = async (itemID, state, dispatch) =>  {
  const theItem = getItemRec(itemID, state);
  if (!theItem) { // check that it still exists in state
    alert("Sorry, that item can't be found.");
    return;
  }
  const delConfirmMsg = 'Are you sure you wnat to delete item ' + theItem.itemName + '?';
  const keepGoing = confirmQuest(delConfirmMsg);
  if (!keepGoing) return;
  dispatch({
    type: 'STARTED_LOADING',
  });
  const status = await deleteRecAPI(theItem.id, state.runMode, 'item');
  if (status===api.OK) {
    dispatch({
      type: 'DELETE_ITEM',
      payload: itemID,
    });
  } else {
    alert (api.MSG_FAILED);
  }
  dispatch({
    type: 'FINISHED_LOADING',
  });
}

/**
 * Takes two possibly updated fields and checks to see if at least one has been updated.
 * If so, then calls API and replaces updated item in state
 */
const handleUpdateItem = async (itemID, newItemName, newItemNote, state, dispatch) => {
  const oldItem = getItemRec(itemID, state);
  const newItem = {...oldItem};
  newItem.itemName = newItemName;
  newItem.itemNote = newItemNote;
  const noChange = !AreObjectsDifferent(oldItem, newItem);
  if (noChange) return;
  dispatch({
    type: 'STARTED_LOADING',
  });
  const {dbRec, status} = await updateRecAPI(newItem, state.runMode, 'item');
  // console.log('handleUpdateItem API call returns ' + status)
  // console.log(dbRec);
  if (status===api.OK) {
    dispatch({
      type: 'UPDATE_ITEM',
      payload: dbRec,
    });
  } else {
    alert (api.MSG_FAILED);
  }
  dispatch({
    type: 'FINISHED_LOADING',
  });
}

/**
 * handleUpdateItemsList - receives array of items from one list, with new sort order
 * to be determined by each item's position with the array.  
 * NOTE: Sort order starts with 1.
 * 1) find size of original array of items for this listID from store.
 *   compare array sizes.  if different, then abort.  (maybe items out of sync)
 * 2) loop through new array in reverse
 * 3) for each item, see if it needs a new sortOrder number. 
 * 4) if so, then update API and dispatch 'UPDATE_ITEM' 
 * Future enhancement - if any of the API operations fails, then abort and try to roll
 * back.  Although the worst that will happen without this enhancement is that the sort
 * order displayed may be slightly different from expectation in the event of multiple 
 * API call failures.  
 */
const handleUpdateItemsList = async (newOneListItems, state, dispatch) => {
  const runMode = state.runMode;
  if (newOneListItems.length<1) return; // this should never happen
  const listID = newOneListItems[0].listID;  // same for all, so just check first one.
  const expectedListSize = getItemsByListID(listID, state).length;
  if (expectedListSize!==newOneListItems.length) return; // something is out of sync
  const newItemsReversed = [...newOneListItems]; // otherwise will affect current display.
  newItemsReversed.reverse();
  const itemsToUpdate = [];  // collect altered items first, then update them
  for (const [index, oneItem] of newItemsReversed.entries()) {
    if ((index+1)!==oneItem.sortOrder) {
      oneItem.sortOrder = index+1;
      itemsToUpdate.push(oneItem);
    }
  }
  // console.log( itemsToUpdate.length + ' items to update....');
  if (itemsToUpdate.length===0) return;
  dispatch({
    type: 'STARTED_LOADING',
  });
  let updateErrors = 0;
  itemsToUpdate.forEach(async function(updateItem) {
    const {status} = await updateRecAPI(updateItem, runMode, 'item');
    if (status!==api.OK) {updateErrors += 1;} 
  })
  /** We'll update state even if there were errors, as they may be corrected on the next 
  round of reordering, and the worst that can happen is the items will be slightly out
  of order.  Future enhancement: maybe show a message? */
  console.log('# of updateErrors: '+ updateErrors);
  itemsToUpdate.forEach( async function(updateItem) {
    await dispatch({
      type: 'UPDATE_ITEM',
      payload: updateItem,
    }); 
  })
  dispatch({
    type: 'FINISHED_LOADING',
  });
}

/**
 * Set the runMode flag in store. Flag is used to skip API steps when using test data.
 * 
 * @param runMode - api.RUNMODE_API or api.RUNMODE_DEMO from constants file
 */
 const handleSetRunModeAndInitLoad = async (testUserId, runMode, dispatch) => {
  await dispatch({
    type: 'SET_RUNMODE',
    payload: runMode,
  }) 
  if (runMode===api.RUNMODE_API) {
    // console.log('*** handleSetRunMode for API');
    let token = localStorage.getItem('token');
    console.log('token: ' + token);
    // token = '7e206beb2140d19d8745fed18a5e0e5326e83c0e';
    if (token!==null) { // if found, then set logged in = true
      setAxiosAuthToken(token);
      await dispatch({
        type: 'USER_LOGIN',
      });
      await handleGetUserAndData(testUserId, runMode, dispatch);
      // console.log('***** loading init data with handleSetRunMode in handlers *****');
      await dispatch({
        type: 'FINISHED_LOADING',
      }); 
    }
  }
  if (runMode===api.RUNMODE_DEMO) {
    await dispatch({
      type: 'USER_LOGIN',
    });
    await handleGetUserAndData(testUserId, runMode, dispatch); // load from data file
    // console.log('***** loading init data with handleSetRunMode in handlers *****');
    await dispatch({
      type: 'FINISHED_LOADING',
    }); 
  }
}

export {
  handleRemoveItem, 
  handleAddItem, 
  handleUpdateItem, 
  handleUpdateItemsList,
  handleSetRunModeAndInitLoad,
  handleLogin,
  handleLogout,
  handleReg,
};
