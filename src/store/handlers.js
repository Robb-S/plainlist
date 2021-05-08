import {makeStringID, confirmQuest, makeHighestNumericAttribute, 
  AreObjectsDifferent} from '../util/helpers';
import {getItemRec, getItemsByListID} from './getData';

/**
 * Take new itemName and itemNote from input, then  add a
 * high sortOder attribute so it sorts to the top of the list.
 * ID and other attributes will be taken care of by REST API.
 */
 const handleAddItem = async (newItem, items, dispatch) => {
  console.log('* handleAddItem');
  dispatch({
    type: 'STARTED_LOADING',
  });
  const delay = ms => new Promise(res => setTimeout(res, ms));
  await delay(200);
  // simulate deletion of items from an API
  // TODO: write to API, then handle result
  newItem.id = makeStringID(); // add a random ID (temporary measure)
  newItem.sortOrder = makeHighestNumericAttribute(items, 'sortOrder');
  const dbItem = {...newItem}; // this will be replaced by API return
  console.log(dbItem);
  dispatch({
    type: 'ADD_ITEM',
    payload: dbItem,
  });
  dispatch({
    type: 'FINISHED_LOADING',
  });
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
  const delay = ms => new Promise(res => setTimeout(res, ms));
  await delay(200);
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
  const delay = ms => new Promise(res => setTimeout(res, ms));
  await delay(200);
  // simulate deletion of items from an API
  // TODO: check for success with API, else show error message
  const itemFromAPI = {...newItem}; // TODO: use API return
  dispatch({
    type: 'UPDATE_ITEM',
    payload: itemFromAPI,
  });
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
  if (newOneListItems.length<1) return; // this should never happen
  const listID = newOneListItems[0].listID;
  console.log('listID found: ' + listID);
  const expectedListSize = getItemsByListID(listID, state).length;
  if (expectedListSize!==newOneListItems.length) return; // something out of sync
  const newItemsReversed = [...newOneListItems];
  newItemsReversed.reverse();
  const itemsToUpdate = [];  // collect altered items first, then update them
  // console.log(newItemsReversed);
  for (const [index, oneItem] of newItemsReversed.entries()) {
    // console.log(index, oneItem);
    if ((index+1)!==oneItem.sortOrder) {
      // console.log('sort order different: ');
      // console.log('index+1: ' + (index + 1));
      // console.log('current sortOrder: ' + oneItem.sortOrder);
      oneItem.sortOrder = index+1;
      itemsToUpdate.push(oneItem);
    }
  }
  console.log( itemsToUpdate.length + ' items to update....');
  console.log( itemsToUpdate);
}


export {
  handleRemoveItem, 
  handleAddItem, 
  handleUpdateItem, 
  handleUpdateItemsList,
};
