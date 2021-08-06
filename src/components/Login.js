import React, { Fragment, useState } from 'react';
import '../css/lists.css';
import '../css/settings.css';
import { useStore } from '../store/StoreContext';
import { handleLogin } from '../store/handlersUser';
import { useHistory, Link } from 'react-router-dom';
import { FormLabel } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { IconButton, MakeHelpButton } from './IconButton';

const Login = () => {
  const { state, dispatch } = useStore();
  const history = useHistory();
  const [userName, setUserName] = useState('');
  const [userPwd, setUserPwd] = useState('');
  const [doAutoFocus, setDoAutoFocus] = useState(false); // tried to solve Firefox issue
  // with login helper box that keeps reappearing

  const onSubmitForm = (e) => { // called when you press Enter after typing
    e.preventDefault();
    onSubmitButton();
  };

  const onSubmitButton = async () => { // called when you press button
    setDoAutoFocus(false);
    if ((userName.length===0) || (userPwd.length===0)) {return;}
    const userInfo = { userName: userName, userPwd: userPwd };
    handleLogin(userInfo, dispatch);
    history.push('/');
  };

  const loginForm = () => {
    const loginConfig = {
      caption:'log in', title:'log in', iconType:'login', callProc:onSubmitButton,
    };
    return (
      <Fragment>
        <form className='loginForm' onSubmit={onSubmitForm}>
          <FormLabel component="legend"><div className='formlabel'>
          Please enter user name and password
            or <Link to={{ pathname: '/reg/' }}>register new user</Link>
          </div>
          </FormLabel>
          <div className='loginLine'>
          <span className='editItemInputArea loginLine1'>
            <TextField
              required
              label="User name:" value={userName}
              onChange={(e) => setUserName(e.target.value)}
              variant='outlined'
              margin='dense'
              autoFocus={doAutoFocus}
              inputProps={{ autoCapitalize: 'off' }}
            />
            <TextField
              required
              label='Password:' value={userPwd}
              onChange={(e) => setUserPwd(e.target.value)}
              type="password"
              autoComplete='current-password'
              variant='outlined'
              margin='dense'
              inputProps={{ autoCapitalize: 'off' }}
            />
          </span>
          <span className='loginLine2'><IconButton config={ loginConfig } /></span>
          </div>
          <input type="submit" className="hidden" />
        </form>
      </Fragment>
    );
  };


  const headingArea = () => {
    return (
      <div className='headingZone loginHeading'>
        <div className='headingNameArea'>
          Log in
        </div>
        <div className='headingIcons headingIconsSmaller'>
          { MakeHelpButton() }
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <div className='mainContainer'>
        <div className='topLogo'>- Cross It Off the List -</div>
        { headingArea() }
        { loginForm() }
      </div>
    </Fragment>
  );
};

export default Login;
