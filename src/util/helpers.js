import { v4 as uuidv4 } from 'uuid';

/**
 * Make unique string ID.  Currently using uuid.  Probably only temporary, as IDs will
 * be supplied by the backend REST API.
 */
const makeStringID = () => {
  return uuidv4();
}

/**
 * Simple helper to return array position at which attribute is found.
 */
const findPosWithAttr = (array, attr, value) => {
  for(let i = 0; i < array.length; i += 1) {
      if(array[i][attr] === value) {
          return i;
      }
  }
  return -1;
}

/**
 * Find element with highest value of numericAttr (e.g. sortOrder) 
 * in objects in array, and add 1.
 */
 const makeHighestNumericAttribute = (theArray, numericAttr) => {
  return Math.max(...theArray.map(o => o.sortOrder), 0) + 1;
}

/**
 * Confirmation dialog - displays question, returns true or false. 
 * Ready for visual upgrade.
 */
const confirmQuest = (cQuestion) => {
  return window.confirm(cQuestion);
}

/**
 * Compares two objects to see if they have same value via JSON.stringify.
 * May cause occasional unnecessary rewrites if somehow the attributes are 
 * in different order, but it doesn't matter.
 */
const AreObjectsDifferent = (a, b) => {
  return JSON.stringify(a) !== JSON.stringify(b);
}

export {
  makeStringID, 
  findPosWithAttr, 
  makeHighestNumericAttribute, 
  confirmQuest,
  AreObjectsDifferent,
};
