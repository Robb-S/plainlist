import React, { Fragment, useState } from 'react';
import '../css/lists.css';
import '../css/settings.css';
import { useStore } from '../store/StoreContext';
import { handleFlatnessSetting } from '../store/handlers';
import { useHistory } from 'react-router-dom';
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
  const [flatValue, setFlatValue] = useState( flatBoolToText(state.flatMode) );

  let showLogin = state.loading && !state.loggedIn;
  let showLoading = state.loading && state.loggedIn;
  let showMain = !state.loading;

  const onLogout = async () => {
    await handleLogout(dispatch);
    history.push('/login/');
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
    const newFlatness = flatTextToBool(e.target.value);
    setFlatValue(e.target.value);
    await handleFlatnessSetting(newFlatness, dispatch);
    history.push('/');
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
    console.log('test button end. ');
  };

  const onTestButton2 = async () => {
    console.log('test button 2 pressed. ');
    console.log('test button 2 end. ');
  };

  
  const onTestButton3 = async () => {
    console.log('test button 3 pressed. ');
    const testURL = api.API_CATS_UN + state.loginName;
    let tempvar;
    try {
      axios.defaults.headers.get['Cache-Control'] = 'no-cache';
      const responseUserID = await axios.get(testURL);
      console.log(responseUserID.data);
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

          <div className='testArea hidden'>
            Test area:<br /><br />
              flatvalue: {flatValue}<br />
              flatness: { state.flatMode.toString() }<br />
              loginName: [{ state.loginName }]<br />
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
        </div>
      </Fragment>
      }
    </Fragment>
  );
};



export default Settings;
