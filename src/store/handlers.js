import {makeStringID} from '../util/helpers';

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

const handleAddItem = async (newItem, dispatch) => {
  console.log('* handleAddItem');
  dispatch({
    type: 'STARTED_LOADING',
  });
  const delay = ms => new Promise(res => setTimeout(res, ms));
  await delay(500);
  // simulate deletion of items from an API
  // TODO: write to API, then handle result
  newItem.id = makeStringID(); // add a random ID (temporary measure)
  const dbItem = {...newItem};
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
