import React, { Fragment, useState } from 'react';
import '../css/lists.css';
import '../css/settings.css';
import { useStore } from '../store/StoreContext';
import { handleLogout, handleUpdateLastList, handleUpdateRemember,
  handleUpdateNickname, handleUpdateFlatness, handleRefresh } from '../store/handlersUser';
import { useHistory } from 'react-router-dom';
import Loading from './Loading';
import Login2 from './Login2';
import { IconButton, MakeHomeButton, MakeHelpButton, MakeSpinButton } from './IconButton';
import { FormControl, FormLabel, FormControlLabel, Radio, TextField,
  RadioGroup } from '@material-ui/core';
import { getGreeting, getFlatMode2, getNickname, getRemember } from '../store/getData';
import { validateLength } from '../util/helpers';
import * as api from '../util/constants';

const flatBoolToText = (flatBool) => {
  const flatText = flatBool ? 'flat' : 'hier';
  return flatText;
};
const flatTextToBool = (flatText) => {
  const flatBool = flatText==='flat' ? true : false;
  return flatBool;
};
const rememberBoolToText = (rememberBool) => {
  const rememberText = rememberBool ? 'remember' : 'forget';
  return rememberText;
};
const rememberTextToBool = (rememberText) => {
  const rememberBool = rememberText==='remember' ? true : false;
  return rememberBool;
};

const Settings = () => {
  const { state, dispatch } = useStore();
  const history = useHistory();
  const [flatValue, setFlatValue] = useState( flatBoolToText(getFlatMode2(state)) );
  const [rememberValue, setRememberValue] = useState( rememberBoolToText(getRemember(state)) );
  const [nickname, setNickname] = useState(getNickname(state));

  let showLogin = !state.loading && !state.loggedIn;
  let showLoading = state.loading && state.loggedIn;
  let showMain = !state.loading;
  const nicknameChangeDisabled = ((nickname===getNickname(state)) || (nickname.length===0));

  const onLogout = async () => {
    await handleLogout(dispatch);
    history.push('/login/');
  };
  const handleFlatRadioChange = async (e) => {
    const newFlatness = flatTextToBool(e.target.value);
    setFlatValue(e.target.value);
    const status = await handleUpdateFlatness(newFlatness, state, dispatch);
    history.push('/');
  };
  const handleRememberRadioChange = async (e) => {
    const newRemember = rememberTextToBool(e.target.value);
    setRememberValue(e.target.value);
    await handleUpdateRemember(newRemember, state, dispatch);
  };
  const onSubmitEditNickname = (e) => {
    e.preventDefault();
    onRequestEditNickname();
  };

  const onRequestEditNickname = async () => {
    if (!validateLength(nickname, 1, 60, 'nickname')) return;
    const status = await handleUpdateNickname(nickname, state, dispatch);
    if (status===api.OK) { // TODO: add toast
      console.log('*nickname edit succeeded');
    }
    // TODO: maybe add additional message if API operation failed?
  };

  const cancelEditNickname = async () => {
    setNickname(getNickname(state));
  };

  const doNothing = async () => {
    console.log('do nothing here.');
  };

  const doRefresh = async () => {
    console.log('do refresh.');
    await handleRefresh(state, dispatch);
    // console.log('refresh status: ' + status);
  };

  const crumbArea = () => {
    return (
      <Fragment>
        <div className='crumbsplusthree'>
          <div className='breadcrumbs'>
            <span className='oneCrumb'>
              Welcome { getGreeting(state) }
            </span>
          </div>
          <div className='helpicon'>
            { MakeSpinButton() }
          </div>
          <div className='settingsicon'>
            { MakeHomeButton() }
          </div>
          <div className='helpicon'>
            { MakeHelpButton() }
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
  const flatForm = () => {
    const flatText = 'Flat structure (show just lists, no categories)';
    const hierText = 'Hierarchical structure (show categories + lists)';
    const error = true;
    return (
      <Fragment>
        <form className='chooseFlatnessForm' >
          <FormLabel component="legend"><div className='formlabel2'>
            Choose category structure
          </div></FormLabel>
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
  const rememberForm = () => {
    const forgetText = 'Top page (all categories/lists)';
    const rememberText = 'Most recently changed list';
    const error = true;
    return (
      <Fragment>
        <form className='chooseRememberForm' >
          <FormLabel component="legend"><div className='formlabel2'>
            Display on startup
          </div></FormLabel>
          <FormControl component="fieldset" error={error} >
            <RadioGroup aria-label="choose startup display mode" name="chooseStartDisplay"
              value={rememberValue} onChange={handleRememberRadioChange}>
              <FormControlLabel value={'forget'}
                control={<Radio />} label={ forgetText } />
              <FormControlLabel value={'remember'}
                control={<Radio />} label={ rememberText } />
            </RadioGroup>
          </FormControl>
        </form>
      </Fragment>
    );
  };
  const nicknameForm = () => {
    return (
      <Fragment>
        <form className='chooseNicknameForm' onSubmit={onSubmitEditNickname}>
          <FormLabel component="legend"><div className='formlabel2'>
            Edit information
          </div></FormLabel>
          <div className='nickFormRow'>
            <div className='addAreaInput'>
              <TextField
                required
                label="Nickname" value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                variant='outlined'
                margin='dense'
                inputProps={{ autoCapitalize: 'off' }}
              />
            </div>
            <div className='nickEditButtonArea'>
              <IconButton config={ { title:'accept nickname edit',
                disabled: nicknameChangeDisabled,
                iconType:'confirm', callProc:onRequestEditNickname }} />
              <IconButton config={ { title:'cancel nickname edit',
                iconType:'cancel', callProc:cancelEditNickname }} />
            </div>
          </div>
        </form>
      </Fragment>
    );
  };

  const moreSettings = () => {
    return (
      <Fragment>
        <div className='chooseNicknameForm xhidden'>
          <FormLabel component="legend"><div className='formlabel2'>
            More
          </div></FormLabel>
          <div className='iconRow'>
            <div className='oneIconInRow'>
              <IconButton config={ { title:'manual refresh from database', width: 'wide',
                caption: 'manually refresh items from database',
                iconType:'refresh', callProc:doRefresh }} />
            </div>
            <div className='oneIconInRow hidden'>
              <IconButton config={ { title:'do something', width: 'wide',
                caption: 'temporarily forget most recent list',
                iconType:'genSet', callProc:doNothing }} />
            </div>
            <div className='oneIconInRow hidden'>
              <IconButton config={ { title:'do something', width: 'wide',
                caption: 'extra long explanation something',
                iconType:'genSet', callProc:doNothing }} />
            </div>
            <div className='oneIconInRow hidden'>
              <IconButton config={ { title:'do something', width: 'wide',
                caption: 'extra long explanation of something',
                iconType:'more', callProc:doNothing }} />
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  const onTestButton1 = async () => {
    console.log('test button 1 pressed. ');
    await handleUpdateNickname('snowman2', state, dispatch);
    console.log('test button 1 end. ');
  };

  const onTestButton2 = async () => {
    console.log('test button 2 pressed. ');
    await handleUpdateLastList(8, state, dispatch);
    console.log('test button 2 end. ');
  };

  
  const onTestButton3 = async () => {
    console.log('test button 3 pressed. ');
    await handleUpdateFlatness(false, state, dispatch);
    console.log('test button 3 end. ');
  };

  return (
    <Fragment>
      {showLoading && <Loading />}
      {showLogin && <Login2 />}

      {showMain &&
      <Fragment>
        <div className='mainContainer'>
          <div>{ crumbArea() }</div>
          { headingArea() }
          { flatForm() }
          { rememberForm() }
          { nicknameForm() }
          { moreSettings() }

          <div className='testArea hidden'>
            Test area:<br /><br />
              flatvalue: {flatValue}<br />
              flatness: { state.profile.flatMode.toString() }<br />
              loginName: [{ state.loginName }]<br />
            <br /><br />

            <button
                className="btn default-btn"
                onClick={() => onTestButton1()}
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
