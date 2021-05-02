import {allUsers, allCategories} from './testdata';

const getUserByID = async (userID) => {
  const matchingID = allUsers.filter(oneUser => {
    return oneUser.id === userID
  })
  setTimeout(() => {
  }, 500);
  return matchingID.length>0 ? matchingID[0] : null;
}

const getListsByUserID = async (userID) => {
  const uCats = allCategories.filter(oneCategory => {
    return oneCategory.userid === userID
  })
  setTimeout(() => {
  }, 500);
  return { categories: uCats };
}

const handleGetUser = async (userID, dispatch) =>  {
    // simulate loading of items from an API
    const user = await getUserByID(userID);
    const {categories} = getListsByUserID(userID);

    await dispatch({
      type: 'SET_USER',
      payload: {user},
    });

    setTimeout(() => {
      dispatch({
        type: 'FINISHED_LOADING',
      })
    }, 500);

    await dispatch({
      type: 'GET_LISTS',
      payload: {        
        categories: categories,
        lists: {},
        items: {},
      },
    });

  }  

export {getUserByID, handleGetUser};
