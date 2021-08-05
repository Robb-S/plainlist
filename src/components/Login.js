import React, { Fragment, useState } from 'react';
import '../css/lists.css';
import '../css/settings.css';
import { useStore } from '../store/StoreContext';
import { handleLogin } from '../store/handlersUser';
import { useHistory, Link } from 'react-router-dom';
import { FormLabel } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { IconButton } from './IconButton';

const Login = () => {
  const { state, dispatch } = useStore();
  const history = useHistory();
  const [userName, setUserName] = useState('');
  const [userPwd, setUserPwd] = useState('');

  const onSubmitForm = (e) => { // called when you press Enter after typing
    e.preventDefault();
    onSubmitButton();
  };

  const onSubmitButton = () => { // called when you press button
    if ((userName.length===0) || (userPwd.length===0)) {return;}
    const userInfo = { userName: userName, userPwd: userPwd };
    handleLogin(userInfo, state, dispatch);
    history.push('/');
  };

  const loginForm = () => {
    const loginConfig = {
      caption:'log in', title:'log in', iconType:'login', callProc:onSubmitButton,
    };
    return (
      <Fragment>
        <form onSubmit={onSubmitForm}>
          <FormLabel component="legend">Please enter user name and password</FormLabel>
          <span className='editItemInputArea'>
            <TextField
              required
              label="User name:" value={userName}
              onChange={(e) => setUserName(e.target.value)}
              variant='outlined'
              margin='dense'
              autoFocus={true}
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
          <input type="submit" className="hidden" />
          <div className='loginButtonArea'>
            <IconButton config={ loginConfig } />
            <span className='redirectLink'>
              <Link to={{ pathname: '/reg/' }}>
                Register new user
              </Link>
            </span>
          </div>
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
        <div className='headingIcons'>

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
