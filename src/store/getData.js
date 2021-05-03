
const getParentListName = (itemID, state) => {
  const itemParentListID = getItemRec(itemID, state).listID;
  return getListName(itemParentListID, state);
}

const getParentCatName = (listID, state) => {
  const listParentCatID = getListRec(listID, state).categoryID;
  return getCatName(listParentCatID, state);
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

const getListsByCatID = (categoryID, state) => {
  const matchItems = state.lists.filter(oneList => {
    return oneList.categoryID === categoryID
  })
  return matchItems;
}

const getItemsByListID = (listID, state) => {
  const matchItems = state.items.filter(oneItem => {
    return oneItem.listID === listID
  })
  return matchItems;
}

export {getItemsByListID, getListsByCatID, getListRec, getCatRec, getItemRec, getListName, getCatName,
  getParentListName, getParentCatName };
