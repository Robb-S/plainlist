import {makeStringID, confirmQuest, makeHighestNumericAttribute} from '../util/helpers';
import {getItemRec} from './getData';

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
  await delay(500);
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

export {handleRemoveItem, handleAddItem};
