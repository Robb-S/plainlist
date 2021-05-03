

const getItemsByListID = (listID, allItems) => {
  const matchItems = allItems.filter(oneItem => {
    return oneItem.listID === listID
  })
  return matchItems;
}
 

export {getItemsByListID};
