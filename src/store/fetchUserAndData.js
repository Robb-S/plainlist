// import * as api from '../util/constants';
import { getInitDataByToken } from './apiCalls';
import { isMobile } from 'react-device-detect';
import { setAxiosAuthToken } from '../util/helpers';
import { handleLogout } from './handlersUser';

/**
 * Get token from local storage (only available when logged in), then handle login and
 * make call to fetch data from API.  This is called from App startup.  If user is not
 * logged in, then handleGetUserAndData fetch is called from the login handler instead.
 */
 const handleInitLoad = async (dispatch) => {
  let token = localStorage.getItem('token');
  let loginName = localStorage.getItem('loginName');
  if (token!==null) { // if found, then set logged in = true
    setAxiosAuthToken(token);
    await dispatch({
      type: 'USER_LOGIN',
      payload: { loginName: loginName },
    });
    await handleGetUserAndData(loginName, dispatch);
    await dispatch({
      type: 'FINISHED_LOADING',
    });
  }
  await dispatch({ // this will enable display of login component if not already logged in
    type: 'DO_LAUNCH',
  });
  await dispatch({
    type: 'SET_IS_MOBILE',
    payload: isMobile,
  });
};


/**
 * Get user and list data from API, handle dispatch to store.
 * This is called either at startup time (if user is logged in), or from login handler.
 * loginName is used, and matched at the API endpoint with the token.
 */
const handleGetUserAndData = async (loginName, dispatch) =>  {
  await dispatch({
    type: 'STARTED_LOADING',
  });
  const { user, profile, categories, lists, items } = await getInitDataByToken(loginName);
  if ( Object.keys(user).length === 0 ) { // token-based retrieval failed, so log out
    console.log('Logging out');
    await handleLogout(dispatch);
    return;
  }
  await dispatch({
    type: 'SET_USER',
    payload: { user:user, profile:profile },
  });
  await dispatch({
    type: 'SET_LISTS',
    payload: {
      categories: categories,
      lists: lists,
      items: items,
    },
  });
  await dispatch({
    type: 'FINISHED_LOADING',
  });
};

export { handleInitLoad, handleGetUserAndData };
