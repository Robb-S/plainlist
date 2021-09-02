import { confirmQuest, makeHighestNumericAttribute, AreObjectsDifferent } from '../util/helpers';
import { getItemRec, getItemsByListID, getListsByCatID, getCatRec, getListRec, getRegularCats,
  getAllLists } from './getData';
import * as api from '../util/constants';
import { addRecAPI, deleteRecAPI, updateRecAPI } from './apiCalls';

/**
 * This is similar to version in handlersUser, but without load start and end dispatches.
 */
const handleUpdateLastListForItem = async (oneItem, state, dispatch) => {
  const remember = state.profile.rememberLastList;
  if (!remember) return api.OK; // don't bother if remember mode is false  
  const thisList = oneItem.listID;
  const lastList = state.profile.lastList;
  if (thisList===lastList) return api.OK; // no change in list #
  const newProfile = {
    ...state.profile,
    lastList: thisList,
  };
  const { dbRec, status } = await updateRecAPI(newProfile, 'profile');
  if (status===api.OK) {
    await dispatch({
      type: 'UPDATE_PROFILE',
      payload: dbRec,
    });
  } else {
    alert (api.MSG_FAILED);
  }
  return status;
};

/**
 * Take new itemName and itemNote from input, then  add a high sortOder attribute so it
 * sorts to the top of the list.  ID and other attributes will be taken care of by REST API.
 */
 const handleAddItem = async (newItem, state, dispatch) => {
  const items = state.items;
  dispatch({
    type: 'STARTED_LOADING',
  });
  // add high sortOrder to make it sort to beginning of list
  newItem.sortOrder = makeHighestNumericAttribute(items, 'sortOrder');
  const { dbRec, status } = await addRecAPI(newItem, 'item');
  if (status===api.OK) {
    dispatch({
      type: 'ADD_ITEM',
      payload: dbRec,
    });
    const status2 = await handleUpdateLastListForItem(dbRec, state, dispatch);
  } else {
    alert (api.MSG_FAILED);
  }
  dispatch({
    type: 'FINISHED_LOADING',
  });
};

/**
 * Create new list object with high sort order. 
 * @returns { status (string), listID (number) }
 */
const handleAddList = async (newList, state, dispatch) => {
  const lists = state.lists;
  let listID = null;
  dispatch({
    type: 'STARTED_LOADING',
  });
  // add high sortOrder to make it sort to beginning of list
  newList.sortOrder = makeHighestNumericAttribute(lists, 'sortOrder');
  newList.sortOrderFlat = makeHighestNumericAttribute(lists, 'sortOrderFlat');
  const { dbRec, status } = await addRecAPI(newList, 'list');
  if (status===api.OK) {
    dispatch({
      type: 'ADD_LIST',
      payload: dbRec,
    });
    listID = dbRec['id'];
  } else {
    alert (api.MSG_FAILED);
  }
  dispatch({
    type: 'FINISHED_LOADING',
  });
  return { status, listID };
};

/**
 * Take new rec with categoryName from input, then add a
 * high sortOder attribute so it sorts to the top of the list.
 * ID and other attributes will be taken care of by REST API.
 * @returns { status (string), catID (number) }
 */
const handleAddCategory = async (newCategory, state, dispatch) => {
  const categories = state.categories;
  let categoryID = null;
  dispatch({
    type: 'STARTED_LOADING',
  });
  // add high sortOrder to make it sort to beginning of list
  newCategory.sortOrder = makeHighestNumericAttribute(categories, 'sortOrder');
  const { dbRec, status } = await addRecAPI(newCategory, 'category');
  if (status===api.OK) {
    dispatch({
      type: 'ADD_CAT',
      payload: dbRec,
    });
    categoryID = dbRec['id'];
  } else {
    alert (api.MSG_FAILED);
  }
  dispatch({
    type: 'FINISHED_LOADING',
  });
  return { status, categoryID };
};

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
  const status = await deleteRecAPI(theItem.id, 'item');
  if (status===api.OK) {
    dispatch({
      type: 'DELETE_ITEM',
      payload: itemID,
    });
    const status2 = await handleUpdateLastListForItem(theItem, state, dispatch);
  } else {
    alert (api.MSG_FAILED);
  }
  dispatch({
    type: 'FINISHED_LOADING',
  });
};

/**
 * Remove list from API DB and local state, then remove all associated items
 * from local state.  They are removed from the API DB automatically by Django.
 * @returns status
 */
const handleRemoveList = async (listID, state, dispatch) =>  {
  console.log('** remove list ' + listID + ' before **');
  // console.log(state.items);
  const theList = getListRec(listID, state);
  if (!theList) { // check that it still exists in state
    alert("Sorry, that list can't be found.");
    return 'not found';
  }
  const delConfirmMsg = 'Are you sure you wnat to delete list ' + theList.listName + '?';
  const keepGoing = confirmQuest(delConfirmMsg);
  if (!keepGoing) return 'cancelled';
  dispatch({
    type: 'STARTED_LOADING',
  });
  const status = await deleteRecAPI(theList.id, 'list');
  console.log('status: ' + status);
  if (status===api.OK) {
    await dispatch({
      type: 'DELETE_LIST',
      payload: listID,
    });
  } else {
    alert (api.MSG_FAILED);
  }
  dispatch({
    type: 'FINISHED_LOADING',
  });
  // console.log('** remove list after **');
  // console.log(state.items);
  // console.log(state.lists);
  return status;
};

const handleRemoveCategory = async (categoryID, state, dispatch) =>  {
  const theCat = getCatRec(categoryID, state);
  if (!theCat) { // check that it still exists in state
    alert("Sorry, that category can't be found.");
    return;
  }
  const delConfirmMsg = 'Are you sure you wnat to delete category ' + theCat.categoryName + '?';
  const keepGoing = confirmQuest(delConfirmMsg);
  if (!keepGoing) return;
  dispatch({
    type: 'STARTED_LOADING',
  });
  const status = await deleteRecAPI(theCat.id, 'category');
  if (status===api.OK) {
    dispatch({
      type: 'DELETE_CAT',
      payload: categoryID,
    });
  } else {
    alert (api.MSG_FAILED);
  }
  dispatch({
    type: 'FINISHED_LOADING',
  });
};

/**
 * Takes two possibly updated fields and checks to see if at least one has been updated.
 * If so, then calls API and replaces updated item in state
 */
const handleUpdateItem = async (itemID, newItemName, newItemNote, state, dispatch) => {
  const oldItem = getItemRec(itemID, state);
  const newItem = { ...oldItem };
  newItem.itemName = newItemName;
  newItem.itemNote = newItemNote;
  const noChange = !AreObjectsDifferent(oldItem, newItem);
  if (noChange) return;
  dispatch({
    type: 'STARTED_LOADING',
  });
  const { dbRec, status } = await updateRecAPI(newItem, 'item');
  // console.log('handleUpdateItem API call returns ' + status)
  // console.log(dbRec);
  if (status===api.OK) {
    dispatch({
      type: 'UPDATE_ITEM',
      payload: dbRec,
    });
    const status2 = await handleUpdateLastListForItem(dbRec, state, dispatch);
  } else {
    alert (api.MSG_FAILED);
  }
  dispatch({
    type: 'FINISHED_LOADING',
  });
};

/**
 * Takes possibly updated name and checks to see if it has been updated.
 * If so, then calls API and replaces updated list in state
 */
 const handleUpdateList = async (listID, newListName, state, dispatch) => {
  const oldList = getListRec(listID, state);
  const newList = { ...oldList };
  newList.listName = newListName;
  const noChange = !AreObjectsDifferent(oldList, newList);
  if (noChange) return;
  dispatch({
    type: 'STARTED_LOADING',
  });
  const { dbRec, status } = await updateRecAPI(newList, 'list');
  // console.log('handleUpdateList API call returns ' + status)
  // console.log(dbRec);
  if (status===api.OK) {
    dispatch({
      type: 'UPDATE_LIST',
      payload: dbRec,
    });
  } else {
    alert (api.MSG_FAILED);
  }
  dispatch({
    type: 'FINISHED_LOADING',
  });
  return status;
};


/**
 * Takes possibly updated categoryID and checks to see if it has been updated.
 * If so, then calls API and replaces updated list in state
 */
 const handleMoveList = async (listID, newCategoryID, state, dispatch) => {
  const oldList = getListRec(listID, state);
  const newList = { ...oldList };
  newList.categoryID = newCategoryID;
  const noChange = !AreObjectsDifferent(oldList, newList);
  if (noChange) return;
  dispatch({
    type: 'STARTED_LOADING',
  });
  const { dbRec, status } = await updateRecAPI(newList, 'list');
  // console.log('handleMoveList API call returns ' + status)
  // console.log(dbRec);
  if (status===api.OK) {
    dispatch({
      type: 'UPDATE_LIST',
      payload: dbRec,
    });
  } else {
    alert (api.MSG_FAILED);
  }
  dispatch({
    type: 'FINISHED_LOADING',
  });
  return status;
};


/**
 * Takes possibly updated name and checks to see if it has been updated.
 * If so, then calls API and replaces updated category in state
 */
const handleUpdateCategory = async (categoryID, newCatName, state, dispatch) => {
  const oldCat = getCatRec(categoryID, state);
  const newCat = { ...oldCat };
  newCat.categoryName = newCatName;
  const noChange = !AreObjectsDifferent(oldCat, newCat);
  if (noChange) return;
  dispatch({
    type: 'STARTED_LOADING',
  });
  const { dbRec, status } = await updateRecAPI(newCat, 'category');
  // console.log('handleUpdateList API call returns ' + status)
  // console.log(dbRec);
  if (status===api.OK) {
    dispatch({
      type: 'UPDATE_CAT',
      payload: dbRec,
    });
  } else {
    alert (api.MSG_FAILED);
  }
  dispatch({
    type: 'FINISHED_LOADING',
  });
  return status;
};


/**
 * handleUpdateItemsGroup - receives array of items from one list, with new sort order
 * to be determined by each item's position within the array.  
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
const handleUpdateItemsGroup = async (newOneListItems, state, dispatch) => {
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
    const { status } = await updateRecAPI(updateItem, 'item');
    if (status!==api.OK) {updateErrors += 1;}
  });
  /** We'll update state even if there were errors, as they may be corrected on the next 
  round of reordering, and the worst that can happen is the items will be slightly out
  of order.  Future enhancement: maybe show a message? */
  if (updateErrors>0) { console.log('# of updateErrors: '+ updateErrors); }
  itemsToUpdate.forEach( async function(updateItem) {
    await dispatch({
      type: 'UPDATE_ITEM',
      payload: updateItem,
    });
  });
  dispatch({
    type: 'FINISHED_LOADING',
  });
};

/**
 * handleUpdateListsGroup - receives array of lists from one category, with new sort order
 * to be determined by each list's position within the array.  
 * NOTE: Sort order starts with 1.
 * 1) find size of original array of lists for this categoryID from store.
 *   compare array sizes.  if different, then abort.  (maybe data is out of sync)
 * 2) loop through new array in reverse
 * 3) for each list, see if it needs a new sortOrder number. 
 * 4) if so, then update API and dispatch 'UPDATE_LIST' 
 * Future enhancement - if any of the API operations fails, then abort and try to roll
 * back.  Although the worst that will happen without this enhancement is that the sort
 * order displayed may be slightly different from expectation in the event of multiple 
 * API call failures.  
 */
 const handleUpdateListsGroup = async (newOneCatLists, state, dispatch) => {
  if (newOneCatLists.length<1) return; // this should never happen
  const categoryID = newOneCatLists[0].categoryID;  // same for all, so just check first one.
  const expectedCatSize = getListsByCatID(categoryID, state).length;
  if (expectedCatSize!==newOneCatLists.length) return; // something is out of sync
  const newListsReversed = [...newOneCatLists]; // otherwise will affect current display.
  newListsReversed.reverse();
  const listsToUpdate = [];  // collect altered lists first, then update them
  for (const [index, oneList] of newListsReversed.entries()) {
    if ((index+1)!==oneList.sortOrder) {
      oneList.sortOrder = index+1;
      listsToUpdate.push(oneList);
    }
  }
  // console.log( listsToUpdate.length + ' lists to update....');
  if (listsToUpdate.length===0) return;
  dispatch({
    type: 'STARTED_LOADING',
  });
  let updateErrors = 0;
  listsToUpdate.forEach(async function(updateList) {
    const { status } = await updateRecAPI(updateList, 'list');
    if (status!==api.OK) {updateErrors += 1;}
  });
  /** We'll update state even if there were errors, as they may be corrected on the next 
  round of reordering, and the worst that can happen is the items will be slightly out
  of order.  Future enhancement: maybe show a message? */
  if (updateErrors>0) { console.log('# of updateErrors: '+ updateErrors); }
  listsToUpdate.forEach( async function(updateList) {
    await dispatch({
      type: 'UPDATE_LIST',
      payload: updateList,
    });
  });
  dispatch({
    type: 'FINISHED_LOADING',
  });
};

/**
 * handleUpdateFlatListsGroup - receives array of all lists from flat display, 
 * with new sort order  * to be determined by each list's position within the array.  
 * NOTE: Sort order starts with 1.
 * 1) find size of original array of all lists from store.
 *   compare array sizes.  if different, then abort.  (maybe data is out of sync)
 * 2) loop through new array in reverse
 * 3) for each list, see if it needs a new sortOrderFlat number. 
 * 4) if so, then update API and dispatch 'UPDATE_LIST'
 */
 const handleUpdateFlatListsGroup = async (newAllLists, state, dispatch) => {
  // console.log('*** handleUpdateListsGroupFlat called, returning now!'); // TODO: REMOVE THIS
  // if (newAllLists.length>0) return; // TODO: REMOVE THIS
  if (newAllLists.length<1) return; // this should never happen
  const expectedGroupSize = getAllLists(state).length;
  if (expectedGroupSize!==newAllLists.length) return; // something is out of sync
  const newListsReversed = [...newAllLists]; // otherwise will affect current display.
  newListsReversed.reverse();
  const listsToUpdate = [];  // collect altered lists first, then update them
  for (const [index, oneList] of newListsReversed.entries()) {
    if ((index+1)!==oneList.sortOrderFlat) {
      oneList.sortOrderFlat = index+1;
      listsToUpdate.push(oneList);
    }
  }
  // console.log( listsToUpdate.length + ' lists to update....');
  if (listsToUpdate.length===0) return;
  dispatch({
    type: 'STARTED_LOADING',
  });
  let updateErrors = 0;
  listsToUpdate.forEach(async function(updateList) {
    const { status } = await updateRecAPI(updateList, 'list');
    if (status!==api.OK) {updateErrors += 1;}
  });
  /** We'll update state even if there were errors, as they may be corrected on the next 
  round of reordering, and the worst that can happen is the items will be slightly out
  of order.  Future enhancement: maybe show a message? */
  if (updateErrors>0) { console.log('# of updateErrors: '+ updateErrors); }
  listsToUpdate.forEach( async function(updateList) {
    await dispatch({
      type: 'UPDATE_LIST',
      payload: updateList,
    });
  });
  dispatch({
    type: 'FINISHED_LOADING',
  });
};


/**
 * handleUpdateCategoriesGroup - receives array of categories, with new sort order
 * to be determined by each category's position within the array.  
 * NOTE: Sort order starts with 1.
 * 1) find size of original array of categories from store.
 *   compare array sizes.  if different, then abort.  (maybe data is out of sync)
 * 2) loop through new array in reverse
 * 3) for each category, see if it needs a new sortOrder number. 
 * 4) if so, then update API and dispatch 'UPDATE_CAT' 
 * Future enhancement - if any of the API operations fails, then abort and try to roll
 * back.  Although the worst that will happen without this enhancement is that the sort
 * order displayed may be slightly different from expectation in the event of multiple 
 * API call failures.  
 */
const handleUpdateCategoriesGroup = async (newCategories, state, dispatch) => {
  if (newCategories.length<1) return; // this should never happen
  const expectedAllCatSize = getRegularCats(state).length; // don't count "Uncategorized"
  if (expectedAllCatSize!==newCategories.length) return; // something is out of sync
  const newCatsReversed = [...newCategories]; // otherwise will affect current display.
  newCatsReversed.reverse();
  const catsToUpdate = [];  // collect altered lists first, then update them
  for (const [index, oneCat] of newCatsReversed.entries()) {
    if ((index+1)!==oneCat.sortOrder) {
      oneCat.sortOrder = index+1;
      catsToUpdate.push(oneCat);
    }
  }
  // console.log( catsToUpdate.length + ' categories to update....');
  if (catsToUpdate.length===0) return;
  dispatch({
    type: 'STARTED_LOADING',
  });
  let updateErrors = 0;
  catsToUpdate.forEach(async function(updateCat) {
    const { status } = await updateRecAPI(updateCat, 'category');
    if (status!==api.OK) {updateErrors += 1;}
  });
  /** We'll update state even if there were errors, as they may be corrected on the next 
  round of reordering, and the worst that can happen is the categories will be slightly out
  of order.  Future enhancement: maybe show a message? */
  if (updateErrors>0) { console.log('# of updateErrors: '+ updateErrors); }
  catsToUpdate.forEach( async function(updateCat) {
    await dispatch({
      type: 'UPDATE_CAT',
      payload: updateCat,
    });
  });
  dispatch({
    type: 'FINISHED_LOADING',
  });
};

export {
  handleAddItem,
  handleAddList,
  handleAddCategory,
  handleRemoveItem,
  handleRemoveList,
  handleRemoveCategory,
  handleUpdateItem,
  handleUpdateList,
  handleMoveList,
  handleUpdateCategory,
  handleUpdateItemsGroup,
  handleUpdateListsGroup,
  handleUpdateFlatListsGroup,
  handleUpdateCategoriesGroup,
};
