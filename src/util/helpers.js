import { v4 as uuidv4 } from 'uuid';

/**
 * Make unique string ID.  Currently using uuid.  Probably only temporary, as IDs will
 * be supplied by the backend REST API.
 */
const makeStringID = () => {
  return uuidv4();
}

export {makeStringID};
