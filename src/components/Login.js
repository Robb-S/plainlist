import React, { Fragment, useState, useEffect } from 'react';
import '../css/lists.css';
import '../css/settings.css';
import { useStore } from '../store/StoreContext';
import { handleLogin } from '../store/handlersUser';
import { useHistory, Link } from 'react-router-dom';
import { getLastList, getRemember } from '../store/getData';
import { validateLength } from '../util/helpers';
import { MakeHelpButton } from './IconButton';
import { IconButton as CrossIconButton } from './IconButton';  // alias needed
import IconButton from '@material-ui/core/IconButton';    // same name as local component
import { FormLabel } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const Login = () => {
  const { state, dispatch } = useStore();
  const history = useHistory();
  const [userName, setUserName] = useState('');
  const [userPwd, setUserPwd] = useState('');
  const [doAutoFocus, setDoAutoFocus] = useState(false); // tried to solve Firefox issue
  // with login helper box that keeps reappearing
  const [showPassword, setShowPassword ] = useState(true);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmitForm = (e) => { // called when you press Enter after typing
    e.preventDefault();
    onSubmitButton();
  };

  const onSubmitButton = async () => { // called when you press button
    setDoAutoFocus(false);
    if (!validateLength(userName, 1, 60, 'user name')) return;
    if (!validateLength(userPwd, 1, 60, 'password')) return;
    const userInfo = { userName: userName, userPwd: userPwd };
    await handleLogin(userInfo, dispatch);
  };

  /**
   * After Profile record is loaded, check for lastList field and redirect if present.
   */
  const redirectToLastList = async () => {
    if (!state.profile.lastList) return;
    const lastList = getLastList(state);
    const remember = getRemember(state);
    const gotoLastList = remember && (lastList!=0);
    if (gotoLastList) {
      history.push('/list/', { listID:lastList });
    } else {
      history.push('/');
    }
  };
  useEffect(() => {
    redirectToLastList();
  }, [state.profile]);

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing(0),
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      width: '100%',
    },
  }));

  const loginForm = () => {
    const loginConfig = {
      caption:'log in', title:'log in', iconType:'login', callProc:onSubmitButton,
    };
    const classes = useStyles();
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
            <FormControl className={clsx(classes.textField)} variant='outlined' margin='dense' >
            <InputLabel htmlFor='userPwd'>Password *</InputLabel>
              <OutlinedInput
                labelWidth={87}
                required
                id='userPwd'
                name='userPwd'
                type={showPassword ? 'text' : 'password'}
                value={userPwd}
                onChange={(e) => setUserPwd(e.target.value)}
                autoComplete='current-password'
                inputProps={{
                  autoCapitalize: 'off',
                  autoComplete:'current-password',
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {!showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </span>
          <span className='loginLine2'><CrossIconButton config={ loginConfig } /></span>
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
        { headingArea() }
        { loginForm() }
      </div>
    </Fragment>
  );
};

export default Login;
