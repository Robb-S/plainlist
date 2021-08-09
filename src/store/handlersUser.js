import * as api from '../util/constants';
import { getTokenFromAPI, makeNewUserAPI, makeNewProfileAPI, getInitDataByToken,
  addRecAPI, updateRecAPI } from './apiCalls';
import { handleGetUserAndData } from './fetchUserAndData';
import { sleepy } from '../util/helpers';
import { unsetAxiosAuthToken } from  '../util/helpers';
import { getFlatMode2, getLastList, getNickname, getRemember } from './getData';

/**
 * Take login info, get auth token from Django API call (if login info works).
 * (That API caller function will also set axios header and local storage.)
 * Then set login flag to true, get initial data from API, set loading flag to false.
 * If login fails, keep logged in flag false, loading flag true, and show error message.
 */
const handleLogin = async (userInfo, dispatch) => {
  const loginName = userInfo.userName;
  console.log('username:' + loginName);
  dispatch({
    type: 'STARTED_LOADING',
  });
  const status = await getTokenFromAPI(userInfo);
  if (status===api.OK) {
    localStorage.setItem('loginName', loginName); // name gets token, so it's working
    dispatch({
      type: 'USER_LOGIN',
      payload: { loginName: loginName },
    });
    await handleGetUserAndData(null, loginName, api.RUNMODE_API, dispatch);
    dispatch({
      type: 'FINISHED_LOADING',
    });
  } else {
    alert (api.MSG_LOGIN_FAILED);
  }
};

/**
 * Manual refresh in case items get out of sync when multiple devices are used.
 */
const handleRefresh = async (state, dispatch) => {
  const loginName = state.loginName;
  await dispatch({
    type: 'STARTED_LOADING',
  });
  await handleGetUserAndData(null, loginName, api.RUNMODE_API, dispatch);
  await dispatch({
    type: 'FINISHED_LOADING',
  });
};

/**
 * Reset state and localStorage for flat list hierarchy.
 */
const handleFlatnessSetting = async (newFlatness, dispatch) => {
  // console.log('* handleFlatnessSetting change to ' + newFlatness);
  await dispatch({
    type: 'STARTED_LOADING',
  });
  await dispatch({
    type: 'SET_FLAT',
    payload: newFlatness,
  });
  localStorage.setItem('flatMode', newFlatness.toString());
  await dispatch({
    type: 'FINISHED_LOADING',
  });
};

/**
 * Reset flatMode in Profile
 */
 const handleUpdateFlatness = async (newFlatness, state, dispatch) => {
  console.log('** handleFlatnessUpdate ** ' + newFlatness);
  const oldFlatness = getFlatMode2(state);
  if (oldFlatness===newFlatness) return api.OK;
  const newProfile = {
    ...state.profile,
    flatMode: newFlatness,
  };
  const status = await handleUpdateProfile(newProfile, state, dispatch);
  return status;
};

/**
 * Reset rememberLastList in Profile
 */
 const handleUpdateRemember = async (newRemember, state, dispatch) => {
  console.log('** handleUpdateRemember ** ' + newRemember);
  const oldRemember = getRemember(state);
  if (oldRemember===newRemember) return api.OK;
  const newProfile = {
    ...state.profile,
    rememberLastList: newRemember,
  };
  const status = await handleUpdateProfile(newProfile, state, dispatch);
  return status;
};

/**
 * Reset nickname in Profile
 */
const handleUpdateNickname = async (newNickname, state, dispatch) => {
  console.log('** handleUpdateNickname ** ' + newNickname);
  const oldNickname = getNickname(state);
  if (oldNickname===newNickname) {
    console.log('nickname is unchanged');
    return api.OK;
  }
  const newProfile = {
    ...state.profile,
    nickname: newNickname,
  };
  const status = await handleUpdateProfile(newProfile, state, dispatch);
  return status;
};

/**
 * Reset lastList in Profile
 */
const handleUpdateLastList = async (newLastList, state, dispatch) => {
  console.log('** handleLastListUpdate ** ' + newLastList);
  const oldLastList = getLastList(state);
  if (oldLastList===newLastList) return api.OK;
  const newProfile = {
    ...state.profile,
    lastList: newLastList,
  };
  const status = await handleUpdateProfile(newProfile, state, dispatch);
  return status;
};

/**
 * Handle any profile attr update.  Used internally by handleNicknameUpdate, etc.
 */
const handleUpdateProfile = async (newProfile, state, dispatch) => {
  await dispatch({
    type: 'STARTED_LOADING',
  });
  const { dbRec, status } = await updateRecAPI(newProfile, state.runMode, 'profile');
  if (status===api.OK) {
    await dispatch({
      type: 'UPDATE_PROFILE',
      payload: dbRec,
    });
  } else {
    alert (api.MSG_FAILED);
  }
  await dispatch({
    type: 'FINISHED_LOADING',
  });
  return status;
};

/**
 * Reset state and delete from localStorage.
 */
const handleLogout = async (dispatch) => {
  // console.log('* handleLogout');
  await dispatch({
    type: 'STARTED_LOADING',
  });
  await dispatch({
    type: 'USER_LOGOUT',
  });
  localStorage.removeItem('token');
  unsetAxiosAuthToken();
  await dispatch({
    type: 'FINISHED_LOADING',
  });
};

/**
 * Post new user record data, log in, create profile and starter category and list records,
 * then read them back from API.
 * newUserInfo: username, password, email, first_name, last_name, nickname
 * 0. validation if necessary.
 * 1. write new user object to db.
 * 2. get token from API based on username and password.
 * 3. write profile object to db.
 * 4. write empty categories for todo and shopping.
 * 5. write empty lists for todo and shopping (based on parent category IDs).
 * 6. write empty uncategorized category to db.
 * 7. read it all back from the API and populate state as usual.
 * 8. return status===OK so user is sent to top page.
 */
const handleReg = async (newUserInfo, dispatch) => {
  console.log('** handleReg called');
  console.log(newUserInfo);
  const { username, password, password2, email, nickname } = newUserInfo;
  const loginName = username;
  await dispatch({
    type: 'STARTED_LOADING',
  });
  const userObj = {           // to write to API
    username: username,
    password: password,
    email: email,
    first_name: '',
    last_name: '',
  };
  const profileObj = { nickname: nickname, flatMode: false, rememberLastList: true,
    lastList: 0 }; // write to API
  const userInfo = { userName: username, userPwd: password };     // to get initial token
  if (password!==password2) return 'Password 1 and password 2 must match.';
  let status = await makeNewUserAPI(userObj);
  console.log('make new user: ' + status);
  if (status!==api.OK) { return status; }
  status = await getTokenFromAPI(userInfo);
  if (status!==api.OK) { return status; }
  localStorage.setItem('loginName', loginName); // name gets token, so it's working
  await dispatch({
    type: 'USER_LOGIN',
    payload: { loginName: loginName },
  });
  status = await makeNewProfileAPI(profileObj);
  if (status!==api.OK) { return status; }
  const todoCat = { categoryName: 'To do', sortOrder: 1, uncategorized: false };
  const shoppingCat = { categoryName: 'Shopping', sortOrder: 2, uncategorized: false };
  const uncatCat = { categoryName: 'Uncategorized', sortOrder: 0, uncategorized: true };
  const resp1 = await addRecAPI(todoCat, api.RUNMODE_API, 'category');
  const resp2 = await addRecAPI(shoppingCat, api.RUNMODE_API, 'category');
  const resp3 = await addRecAPI(uncatCat, api.RUNMODE_API, 'category');
  if (!(resp1.status===api.OK || resp2.status===api.OK || resp3.status===api.OK)) { return 'Problem writing initial records.';}
  const todoCatID = resp1.dbRec.id;
  const todoList = { listName: 'things to do', sortOrder: 1, sortOrderFlat: 1,
    categoryID: todoCatID };
  const shoppingCatID = resp2.dbRec.id;
  const shoppingList = { listName: 'main shopping', sortOrder: 1, sortOrderFlat: 2,
    categoryID: shoppingCatID };
  const resp4 = await addRecAPI(todoList, api.RUNMODE_API, 'list');
  const resp5 = await addRecAPI(shoppingList, api.RUNMODE_API, 'list');
  if (!(resp4.status===api.OK || resp5.status===api.OK)) { return 'Problem writing initial records.';}
  // now read them back from the API
  const { user, profile, categories, lists, items } = await getInitDataByToken(loginName);
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
  return api.OK;
};

export {
  handleLogin,
  handleLogout,
  handleReg,
  handleFlatnessSetting,
  handleUpdateFlatness,
  handleUpdateNickname,
  handleUpdateLastList,
  handleUpdateRemember,
  handleRefresh,
};
