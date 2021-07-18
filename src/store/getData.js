
const getParentListName = (itemID, state) => {
  if (!state.loading) {
    const itemParentListID = getItemRec(itemID, state).listID;
    return getListName(itemParentListID, state);
  }
  return null;
};

const getParentCatName = (listID, state) => {
  if (!state.loading) {
    const listParentCatID = getListRec(listID, state).categoryID;
    return getCatName(listParentCatID, state);
  }
  return null;
};

const getParentCatID = (listID, state) => {
  if (!state.loading) {
    return getListRec(listID, state).categoryID;
  }
  return null;
};

const getListName = (listID, state) => {
  return getListRec(listID, state).listName;
};

const getCatName = (categoryID, state) => {
  return getCatRec(categoryID, state).categoryName;
};

const getItemRec = (itemID, state) => {
  const matchItems = state.items.filter(oneItem => {
    return oneItem.id === itemID;
  });
  return matchItems.length>0 ? matchItems[0] : null ;
};

const getCatRec = (categoryID, state) => {
  const matchItems = state.categories.filter(oneCat => {
    return oneCat.id === categoryID;
  });
  return matchItems.length>0 ? matchItems[0] : null ;
};

const getListRec = (listID, state) => {
  const matchItems = state.lists.filter(oneList => {
    return oneList.id === listID;
  });
  return matchItems.length>0 ? matchItems[0] : null ;
};

const getAllCats = (state) => {
  const matchItems = state.categories;
  matchItems.forEach(cat => {
    cat.childCount = getListsByCatID(cat.id, state).length;
  });
  return matchItems.sort(sortOrderRevSort);
};

/**
 * Return an array of categories other than the one with categoryID, to be
 * used when moving a list to a different category.
 */
const getOtherCats = (categoryID, state) => {
  const matchItems = state.categories.filter(oneCat => {
    return oneCat.id !== categoryID;
  });
  return matchItems.sort(sortOrderFlatRevSort);
};

/**
 * Return the uncategorized category for this user.  We assume there is only one.
 */
const getUncategorizedCategory = (state) => {
  const matchItems = state.categories.filter(oneCat => {
    return oneCat.uncategorized === true;
  });
  if (matchItems.length>0) { return matchItems[0]; }
  return null;
};

/**
 * Return array of all lists (in all categories), in reverse order of sortOrderFlat field
 */
const getAllLists = (state) => {
  const matchItems = state.lists;
  matchItems.forEach(list => {
    list.childCount = getItemsByListID(list.id, state).length;
  });
  return matchItems.sort(sortOrderFlatRevSort);
};

const getListsByCatID = (categoryID, state) => {
  const matchItems = state.lists.filter(oneList => {
    return oneList.categoryID === categoryID;
  });
  matchItems.forEach(list => {
    list.childCount = getItemsByListID(list.id, state).length;
  });
  return matchItems.sort(sortOrderRevSort);
};
/**
 * Find items for a particular list, then reverse sort them by itemPos.
 */
const getItemsByListID = (listID, state) => {
  const matchItems = state.items.filter(oneItem => {
    return oneItem.listID === listID;
  });
  return matchItems.sort(sortOrderRevSort);
};

/**
 * Return state of flatness.
 */
const getFlatMode = (state) => {
  console.log('getflatmode');
  console.log(state);
  return state.flat;
};

/**
 * Comparison function for ordering arrays by reverse sortOrder.
 * Used by getItemsByListID, getListsByCatID, getAllCats.
 */
const sortOrderRevSort = (a, b) => {
  return (a.sortOrder > b.sortOrder) ? -1 : 1;
};

/**
 * Comparison function for ordering arrays by reverse sortOrder.
 * Used by getItemsByListID, getListsByCatID, getAllCats.
 */
const sortOrderFlatRevSort = (a, b) => {
  return (a.sortOrderFlat > b.sortOrderFlat) ? -1 : 1;
};

export { getItemsByListID, getListsByCatID, getListRec, getCatRec, getItemRec, getListName,
  getCatName, getParentListName, getParentCatName, getParentCatID, getAllCats, getAllLists,
  getUncategorizedCategory, getOtherCats, getFlatMode };
