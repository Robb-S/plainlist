import React, { Fragment, useState, useEffect } from 'react';
import '../css/lists.css';
import '../css/settings.css';
import { useStore } from '../store/StoreContext';
import { handleReg, handleFlatnessToggle, handleFlatnessSetting } from '../store/handlers';
import { useDebounce, sleepy } from '../util/helpers';
import { useHistory, Link } from 'react-router-dom';
import { userExistsAPI } from '../store/apiCalls';
import { handleLogout } from '../store/handlers';
import Loading from './Loading';
import Login from './Login';
import * as api from '../util/constants';
import { IconButton, MakeHomeButton } from './IconButton';
import { FormControl, FormLabel, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import axios from 'axios';

const flatBoolToText = (flatBool) => {
  const flatText = flatBool ? 'flat' : 'hier';
  return flatText;
};

const flatTextToBool = (flatText) => {
  const flatBool = flatText==='flat' ? true : false;
  return flatBool;
};

const Settings = () => {
  const { state, dispatch } = useStore();
  const history = useHistory();

  const [userName, setUserName] = useState('');
  const [flatValue, setFlatValue] = useState( flatBoolToText(state.flatMode) );
  const [userPwd, setUserPwd] = useState('');
  const [userPwd2, setUserPwd2] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [regMsg, setRegMsg] = useState('Please fill out the fields below.');
  const [uNameMsg, setUNameMsg] = useState('');
  const [localUserID, setLocalUserID] = useState('444');
  const [oneItemOwner, setOneItemOwner] = useState('not yet');
  const debouncedUserName = useDebounce(userName, 300);
  const isFlat = state.flatMode;

  let flatTextButtonMsg = isFlat ? 'Hierarchical structure (show lists + categories)' :
    'Flat structure (show just lists, no categories)';

  let showLogin = state.loading && !state.loggedIn;
  let showLoading = state.loading && state.loggedIn;
  let showMain = !state.loading;

  const onLogout = async () => {
    await handleLogout(dispatch);
    history.push('/login/');
  };

  // Effect for API call
  useEffect(() => {
    checkUserName(debouncedUserName);
    },
    [debouncedUserName], // Only call effect if debounced search term changes
  );

  async function checkUserName(debouncedUserName) {
    if (debouncedUserName.length>2) {
      const { userExists, status } = await userExistsAPI(debouncedUserName);
      console.log( 'userExists called');
      console.log('status: ' + status);
      console.log('userExists: ' + userExists);
      if (status===api.OK && userExists) {
        setUNameMsg('* ' + api.WARN_USER_EXISTS + ' *');
      } else {
        setUNameMsg(api.MSG_USER_AVAILABLE);
      }
    } else {
      setUNameMsg(' ');
    }
  };

  const onSubmitReg = async (e) => {
    e.preventDefault();
    if ((userName.length===0) || (userPwd.length===0)) {return;}
    const userInfo = { userName: userName, userPwd: userPwd,
      userPwd2: userPwd2, userEmail: userEmail };
    const regResult = await handleReg(userInfo, state, dispatch);
    console.log(regResult);
    // handleReg(userInfo, state, dispatch);
    if (regResult==='success') { history.push('/'); }
    else setRegMsg(regResult);
  };

  // # BASE_URL/isuser/admin/ pattern
  const onChangeUserName = async (e) => {
    const uName = e.target.value;
    console.log('length: ' + uName.length);
    setUserName(uName);
  };

  const crumbArea = () => {
    const nickname = state.user.first_name;
    const dispName = nickname==null ? state.user.username : nickname;
    return (
      <Fragment>
        <div className='crumbsandsettings'>
          <div className='breadcrumbs'>
            <span className='oneCrumb'>
              Welcome { dispName }
            </span>
          </div>
          <div className='settingsicon'>
            { MakeHomeButton() }
          </div>
        </div>
      </Fragment>
    );
  };

  const headingArea = () => {
    const logoutConfig = {
      caption:'log out', title:'log out', iconType:'logout', callProc:onLogout,
    };
    return (
      <div className='headingZone topHeading'>
        <div className='headingNameArea'>
          Settings
        </div>
        <div className='headingIcons'>
          <IconButton config={ logoutConfig } />
        </div>
      </div>
    );
  };


  const handleFlatRadioChange = async (e) => {
    console.log('handleFlatRadioChange');
    console.log(e.target.value);
    const newFlatness = flatTextToBool(e.target.value);
    setFlatValue(e.target.value);
    await handleFlatnessSetting(newFlatness, state, dispatch);
  };

  const flatForm = () => {
    const flatText = 'Flat structure (show just lists, no categories)';
    const hierText = 'Hierarchical structure (show categories + lists)';
    const error = true;
    return (
      <Fragment>
        <form className='chooseFlatnessForm' >
          <FormLabel component="legend">Choose category structure</FormLabel>
          <FormControl component="fieldset" error={error} >
            <RadioGroup aria-label="choose flatness mode" name="chooseFlat"
              value={flatValue} onChange={handleFlatRadioChange}>
              <FormControlLabel value={'hier'}
                control={<Radio />} label={ hierText } />
              <FormControlLabel value={'flat'}
                control={<Radio />} label={ flatText } />
            </RadioGroup>
          </FormControl>
        </form>
      </Fragment>
    );
  };


  const onTestButton = async () => {
    console.log('test button pressed. ');
    let testuser = state.loginName;
    // testuser = 'user3';
    // testuser = 'admin';
    const testURL = api.API_GET_USER_ID + testuser;
    
    try {
      const responseUserID = await axios.get(testURL);
      console.log(responseUserID.data);
      setLocalUserID(responseUserID.data.userID);
    } catch (error) {
      console.log(error);
    }
    console.log('test button end. ');
  };

  const onTestButton2 = async () => {
    console.log('test button 2 pressed. ');
    let testuserid = '1';
    testuserid = '2';
    testuserid = '4';
    const testURL = api.API_ITEMS_ID + localUserID;
    let tempvar;
    try {
      const responseUserID = await axios.get(testURL);
      console.log(responseUserID.data);
      tempvar = responseUserID.data[0].owner;
      console.log(tempvar);
      setOneItemOwner(tempvar);
    } catch (error) {
      console.log(error);
    }
    console.log('test button 2 end. ');
  };

  
  const onTestButton3 = async () => {
    console.log('test button 3 pressed. ');
    const testURL = api.API_CATS_UN + state.loginName;
    let tempvar;
    try {
      axios.defaults.headers.get['Cache-Control'] = 'no-cache';
      const responseUserID = await axios.get(testURL);
      // axios.defaults.headers.get['Pragma'] = 'no-cache';
      // axios.defaults.headers.get['Expires'] = '0';
      console.log(responseUserID.data);
      // tempvar = responseUserID.data[0].owner;
      // console.log(tempvar);
      // setOneItemOwner(tempvar);
    } catch (error) {
      console.log(error);
    }
    console.log('test button 3 end. ');
  };

  return (
    <Fragment>
      {showLoading && <Loading />}
      {showLogin && <Login />}

      {showMain &&
      <Fragment>
        <div className='mainContainer'>
          <div className='topLogo'>- Cross It Off the List -</div>
          <div>{ crumbArea() }</div>
          { headingArea() }
          { flatForm() }

          <br /><br />
          <br /><br />
          Test area:<br /><br />
            flatvalue: {flatValue}<br />
            flatness: { state.flatMode.toString() }<br />
            loginName: [{ state.loginName }]<br />
            userID: [{ state.userID }]<br />
            localUserID: [{ localUserID }]<br />
            oneItemOwner: [{ oneItemOwner }]<br />
          <br /><br />

          <button
              className="btn default-btn"
              onClick={() => onTestButton()}
            >
              Test Button
          </button><br />
          <button
              className="btn default-btn"
              onClick={() => onTestButton2()}
            >
              Test Button 2
          </button><br />
          <button
              className="btn default-btn"
              onClick={() => onTestButton3()}
            >
              Test Button 3
          </button><br />
        </div>
      </Fragment>
      }
    </Fragment>
  );
};



export default Settings;
