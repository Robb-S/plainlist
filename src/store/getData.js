
const getListRec = (listID, allLists) => {
  const matchItems = allLists.filter(oneList => {
    return oneList.id === listID
  })
  return matchItems;
}

const getItemsByListID = (listID, allItems) => {
  const matchItems = allItems.filter(oneItem => {
    return oneItem.listID === listID
  })
  return matchItems;
}
 

export {getItemsByListID, getListRec};
