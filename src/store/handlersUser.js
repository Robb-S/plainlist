import * as api from '../util/constants';
import { getTokenFromAPI, makeNewUserAPI } from './apiCalls';
import { handleGetUserAndData } from './fetchUserAndData';
import { sleepy } from '../util/helpers';

/**
 * Take login info, get auth token from Django API call (if login info works).
 * (That API caller function will also set axios header and local storage.)
 * Then set login flag to true, get initial data from API, set loading flag to false.
 * If login fails, keep logged in flag false, loading flag true, and show error message.
 */
const handleLogin = async (userInfo, state, dispatch) => {
  const loginName = userInfo.userName;
  console.log('username:' + loginName);
  dispatch({
    type: 'STARTED_LOADING',
  });
  const status = await getTokenFromAPI(userInfo);
  if (status===api.OK) {
    localStorage.setItem('loginName', loginName); // name gets token, so it's working
    // const userID = await getUserID(loginName);
    // console.log('type of userID: ' + typeof(userID));
    dispatch({
      type: 'USER_LOGIN',
      payload: { loginName: loginName },
    });
    // console.log('***** loading init data with handleLogin in handlers *****');
    await handleGetUserAndData(null, loginName, api.RUNMODE_API, dispatch);
    dispatch({
      type: 'FINISHED_LOADING',
    });
  } else {
    alert (api.MSG_LOGIN_FAILED);
  }
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
  await dispatch({
    type: 'FINISHED_LOADING',
  });
};

/**
 * Post new user record data, log in, create profile and starter category and list records,
 * then read them back from API.
 * newUserInfo: username, password, email, firstName, lastName, nickname
 */
const handleReg = async (newUserInfo, dispatch) => {
  console.log('** handleReg called');
  console.log(newUserInfo);
  const { username, password, email, firstName, lastName, nickname } = newUserInfo;
  await dispatch({
    type: 'STARTED_LOADING',
  });
  await sleepy(2500);
  const userObj = {
    username: username,
    password: password,
    email: email,
    first_name: firstName,
    last_name: lastName,
  };
  const userInfo = { userName: username, userPwd: password };
  const profileObj = { nickname: nickname, flatMode: false, lastList: 0 };
  let status = await makeNewUserAPI(userObj);
  console.log('make new user: ' + status);
  // alert('status: ' + status);
  if (status===api.OK) {
    const loginStatus = await getTokenFromAPI(userInfo);
    console.log('getTokenFromAPI' + loginStatus);
    if (loginStatus===api.OK) {
      localStorage.setItem('loginName', username); // name gets token, so it's working
      await dispatch({
        type: 'USER_LOGIN',
        payload: { loginName: username },
      });
    }
  }
  // TODO: make 5 records, make profile object, write them all via API.
  await dispatch({
    type: 'FINISHED_LOADING',
  });
};

export {
  handleLogin,
  handleLogout,
  handleReg,
  handleFlatnessSetting,
};
