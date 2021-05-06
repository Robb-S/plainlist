import { v4 as uuidv4 } from 'uuid';

/**
 * Make unique string ID.  Currently using uuid.  Probably only temporary, as IDs will
 * be supplied by the backend REST API.
 */
const makeStringID = () => {
  return uuidv4();
}

/**
 * SImple helper to return array position at which attribute is found.
 */
const findPosWithAttr = (array, attr, value) => {
  for(let i = 0; i < array.length; i += 1) {
      if(array[i][attr] === value) {
          return i;
      }
  }
  return -1;
}


export {makeStringID, findPosWithAttr};
