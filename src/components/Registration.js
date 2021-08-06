import React, { Fragment, useState, useEffect } from 'react';
import '../css/lists.css';
import '../css/settings.css';
import { useStore } from '../store/StoreContext';
import { handleReg } from '../store/handlersUser';
import { useDebounce } from '../util/helpers';
import { useHistory, Link } from 'react-router-dom';
import { userExistsAPI } from '../store/apiCalls';
import * as api from '../util/constants';
import { FormLabel, FormControl } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { IconButton, MakeHelpButton } from './IconButton';

const Registration = () => {
  const { state, dispatch } = useStore();
  const history = useHistory();
  const [userName, setUserName] = useState('');
  const [userPwd, setUserPwd] = useState('');
  const [userPwd2, setUserPwd2] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [regMsg, setRegMsg] = useState('');
  const [uNameMsg, setUNameMsg] = useState('');
  const [pswMsg, setPswMsg] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const debouncedUserName = useDebounce(userName, 300);
  
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
  }

  const onSubmitForm = (e) => { // called when you press Enter after typing
    e.preventDefault();
    onSubmitButton();
  };

  /**
   * Send values of text fields to handler for new-user registration.
   */
  const onSubmitButton = async () => { // called when you press button
    if (userPwd!==userPwd2) {
      setPswMsg('Passwords do not match; please enter the same password twice.');
      return;
    } else {
      setPswMsg('');
    }
    if ((userName.length===0) || (userPwd.length===0) || (userEmail.length===0)) {
      setRegMsg('Please fill in all required fields.');
      return;
    } else {
      setRegMsg('');
    }
    const userInfo = { username: userName, password: userPwd,
      password2: userPwd2, email: userEmail, nickname: userNickname };
    const regResult = await handleReg(userInfo, dispatch);
    console.log(regResult);
    if (regResult===api.OK) { history.push('/'); }
    else setRegMsg(regResult);
  };

  const headingArea = () => {
    return (
      <div className='headingZone loginHeading'>
        <div className='headingNameArea'>
          Register new user
        </div>
        <div className='headingIcons headingIconsSmaller'>
          { MakeHelpButton() }
        </div>
      </div>
    );
  };
  
  const regForm = () => {
    const regConfig = {
      caption:'register', title:'register new user data', iconType:'login', callProc:onSubmitButton,
    };
    return (
      <Fragment>
        <form className='loginForm' onSubmit={onSubmitForm}>
          <FormLabel component="legend"><div className='formlabel'>
          Please enter the fields below
            or <Link to={{ pathname: '/login/' }}>log in (for existing users)</Link>
          </div>
          </FormLabel>
          <div className='regFormMessage'>
            {regMsg}
          </div>
          <div className='regbox'>
            <TextField
              required
              fullWidth
              label="User name:" value={userName}
              onChange={(e) => setUserName(e.target.value)}
              variant='outlined'
              margin='dense'
              inputProps={{ autoCapitalize: 'off', autoComplete:'new-password' }}
            />
          </div>
          <div className='regFormMessage'>
            {uNameMsg}
          </div>
          <div className='regbox'>
            <TextField
              required
              fullWidth
              label='Password:' value={userPwd}
              onChange={(e) => setUserPwd(e.target.value)}
              variant='outlined'
              margin='dense'
              inputProps={{ autoCapitalize: 'off', autoComplete:'off' }}
            />
          </div>
          <div className='regbox'>
            <TextField
              required
              fullWidth
              label='Repeat password:' value={userPwd2}
              onChange={(e) => setUserPwd2(e.target.value)}
              variant='outlined'
              margin='dense'
              inputProps={{ autoCapitalize: 'off', autoComplete:'off' }}
            />
          </div>
          <div className='regFormMessage'>
            {pswMsg}
          </div>
          <div className='regbox'>
            <TextField
              required
              fullWidth
              label='Email:' value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              variant='outlined'
              margin='dense'
              inputProps={{ autoCapitalize: 'off' }}
            />
          </div>
          <div className='reg regbox'>
            <TextField
              fullWidth
              label='Nickname (optional):' value={userNickname}
              onChange={(e) => setUserNickname(e.target.value)}
              variant='outlined'
              margin='dense'
              inputProps={{ autoCapitalize: 'off' }}
            />
          </div>
          <div className='regButton'><IconButton config={ regConfig } /></div>
          <input type="submit" className="hidden" />
        </form>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <div className='mainContainer'>
        <div className='topLogo'>- Cross It Off the List -</div>
        { headingArea() }
        { regForm() }
      </div>
    </Fragment>
  );
};



export default Registration;
