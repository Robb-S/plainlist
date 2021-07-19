import React, { Fragment, useState, useEffect } from 'react';
import '../css/lists.css';
import { useStore } from '../store/StoreContext';
import { handleReg, handleFlatnessToggle, handleFlatnessSetting } from '../store/handlers';
import { useDebounce, sleepy } from '../util/helpers';
import { useHistory, Link } from 'react-router-dom';
import { userExistsAPI } from '../store/apiCalls';
import { handleLogout } from '../store/handlers';
import { getUncategorizedCategory } from '../store/getData';
import Loading from './Loading';
import Login from './Login';
import * as api from '../util/constants';
import { FormControl, FormLabel, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';

const flatBoolToText = (flatBool) => {
  const flatText = flatBool ? 'flat' : 'hier';
  return flatText;
};

const Settings = () => {
  const { state, dispatch } = useStore();
  const history = useHistory();
  // const isLoaded = !state.loading;  // maybe not needed, if handled by parent component
  // const userID = state.user.id;

  const [userName, setUserName] = useState('');
  const [flatValue, setFlatValue] = useState( flatBoolToText(state.flat) );
  const [userPwd, setUserPwd] = useState('');
  const [userPwd2, setUserPwd2] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [regMsg, setRegMsg] = useState('Please fill out the fields below.');
  const [uNameMsg, setUNameMsg] = useState('');
  const debouncedUserName = useDebounce(userName, 300);
  const isFlat = state.flat;

  const flatTextToBool = (flatText) => {
    const flatBool = flatText==='flat' ? true : false;
    return flatBool;
  };

  let flatTextButtonMsg = isFlat ? 'Hierarchical structure (show lists + categories)' :
    'Flat structure (show just lists, no categories)';

  let showLogin = state.loading && !state.loggedIn;
  let showLoading = state.loading && state.loggedIn;
  let showMain = !state.loading;

  const onLogout = async () => {
    await handleLogout(dispatch);
    history.push('/login/');
  };

  const onFlatToggle = async () => {
    setFlatValue(flatBoolToText(!state.flat));
    await handleFlatnessToggle(state, dispatch);
  };

  const onTestButton = async () => {
    const uncatCat = await getUncategorizedCategory(state);
    console.log('getUncategorizedCategory: ' + uncatCat.id);
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
    return (
      <Fragment>
        <div className='crumbsandsettings'>
          <div className='breadcrumbs'>
            <Link className='linky3 oneCrumb' to={`/`}>
              Back to top
            </Link>
          </div>
          <div className='settingsicon'>
          </div>
        </div>
      </Fragment>
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

  return (
    <Fragment>
      {showLoading && <Loading />}
      {showLogin && <Login />}

      {showMain &&
      <Fragment>
        <div className='mainContainer'>
          <div>{ crumbArea() }</div>
          <div className='headingNameDiv'><span className='headingName'>
            Settings
          </span></div>
          <br />
          <button
              className="btn default-btn"
              onClick={() => onLogout()}
            >
              Log out
          </button>
          <br /><br />
          <button
              className="btn default-btn"
              onClick={() => onFlatToggle()}
            >
              { flatTextButtonMsg }
          </button>
          <br /><br />
            flatvalue: {flatValue}<br />
            flatness: { state.flat.toString() }
          <br /><br />
          { flatForm() }
          <button
              className="btn default-btn"
              onClick={() => onTestButton()}
            >
              Test Button
          </button>
        </div>
      </Fragment>
      }
    </Fragment>
  );
};



export default Settings;
