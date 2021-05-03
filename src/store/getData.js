
const getParentListName = (itemID, state) => {
  if (!state.loading) {
    const itemParentListID = getItemRec(itemID, state).listID;
    return getListName(itemParentListID, state);
  }
  return null;
}

const getParentCatName = (listID, state) => {
  if (!state.loading) {
    const listParentCatID = getListRec(listID, state).categoryID;
    return getCatName(listParentCatID, state);
  }
  return null;
}

const getParentCatID = (listID, state) => {
  if (!state.loading) {
    return getListRec(listID, state).categoryID;  
  }
  return null;
}

const getListName = (listID, state) => {
  return getListRec(listID, state).listName;
}

const getCatName = (categoryID, state) => {
  return getCatRec(categoryID, state).categoryName;
}

const getItemRec = (itemID, state) => {
  const matchItems = state.items.filter(oneItem => {
    return oneItem.id === itemID
  })
  return matchItems.length>0 ? matchItems[0] : null ;
}

const getCatRec = (categoryID, state) => {
  const matchItems = state.categories.filter(oneCat => {
    return oneCat.id === categoryID
  })
  return matchItems.length>0 ? matchItems[0] : null ;
}

const getListRec = (listID, state) => {
  const matchItems = state.lists.filter(oneList => {
    return oneList.id === listID
  })
  return matchItems.length>0 ? matchItems[0] : null ;
}

const getAllCats = (state) => {
  const matchItems = state.categories;
  matchItems.forEach(cat => { 
    cat.childCount = getListsByCatID(cat.id, state).length;
  });
  return matchItems;
}

const getListsByCatID = (categoryID, state) => {
  const matchItems = state.lists.filter(oneList => {
    return oneList.categoryID === categoryID
  })
  matchItems.forEach(list => { 
    list.childCount = getItemsByListID(list.id, state).length;
  });
  return matchItems;
}

const getItemsByListID = (listID, state) => {
  const matchItems = state.items.filter(oneItem => {
    return oneItem.listID === listID
  })
  return matchItems;
}

export {getItemsByListID, getListsByCatID, getListRec, getCatRec, getItemRec, getListName, getCatName,
  getParentListName, getParentCatName, getParentCatID, getAllCats };
