import React, { Fragment, useState, useEffect } from 'react';
import '../css/lists.css';
import { useStore } from '../store/StoreContext';
import { handleReg } from '../store/handlersUser';
import { useDebounce } from '../util/helpers';
import { useHistory, Link } from 'react-router-dom';
import { userExistsAPI } from '../store/apiCalls';
import * as api from '../util/constants';
import { FormLabel } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { IconButton } from './IconButton';

const Registration = () => {
  const { state, dispatch } = useStore();
  const history = useHistory();
  const [userName, setUserName] = useState('');
  const [userPwd, setUserPwd] = useState('');
  const [userPwd2, setUserPwd2] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [regMsg, setRegMsg] = useState('Please fill out the fields below.');
  const [uNameMsg, setUNameMsg] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
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

  const onTestButton = async () => {
    console.log('test button pressed. ');
    // unsetAxiosAuthToken();
    // const newUserInfo = {
    //   username:'user18',
    //   password:'zdj1superuser',
    //   email:'nomail@no.com',
    //   firstName: 'myfirst18',
    //   lastName: 'mylast',
    //   nickname: 'nickname',
    // };
    // await handleReg(newUserInfo, dispatch);
    console.log('test button end. ');
  };


  const onSubmitForm = (e) => { // called when you press Enter after typing
    e.preventDefault();
    onSubmitButton();
  };

  /**
   * Send values of text fields to handler for new-user registration.
   * TODO: check if passwords match, if not, use error message area for message.
   */
  const onSubmitButton = async () => { // called when you press button
    if ((userName.length===0) || (userPwd.length===0)) {return;}
    const userInfo = { username: userName, password: userPwd,
      password2: userPwd2, email: userEmail, first_name: userFirstName,
      last_name: userLastName, nickname: userNickname };
    const regResult = await handleReg(userInfo, dispatch);
    console.log(regResult);
    // handleReg(userInfo, dispatch);
    if (regResult===api.OK) { history.push('/'); }
    else setRegMsg(regResult);
  };

  // const onSubmitReg = async (e) => {
  //   e.preventDefault();
  //   if ((userName.length===0) || (userPwd.length===0)) {return;}
  //   const userInfo = { username: userName, password: userPwd,
  //     password2: userPwd2, email: userEmail, first_name: userFirstName,
  //     last_name: userLastName, nickname: userNickname };
  //   const regResult = await handleReg(userInfo, dispatch);
  //   console.log(regResult);
  //   // handleReg(userInfo, dispatch);
  //   if (regResult===api.OK) { history.push('/'); }
  //   else setRegMsg(regResult);
  // };

  // // # BASE_URL/isuser/admin/ pattern
  // const onChangeUserName = async (e) => {
  //   const uName = e.target.value;
  //   console.log('length: ' + uName.length);
  //   setUserName(uName);
  // };

  const headingArea = () => {
    return (
      <div className='headingZone loginHeading'>
        <div className='headingNameArea'>
          Register new user
        </div>
        <div className='headingIcons'>

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
          <div className='reg1 regbox'>
            <TextField
              required
              label="User name:" value={userName}
              onChange={(e) => setUserName(e.target.value)}
              variant='outlined'
              margin='dense'
              inputProps={{ autoCapitalize: 'off', autoComplete:'new-password' }}
            />
          </div>
          <div className='userNameMessage'>
            {uNameMsg}
          </div>
          <div className='reg2 regbox'>
            <TextField
              required
              label='Password:' value={userPwd}
              onChange={(e) => setUserPwd(e.target.value)}
              variant='outlined'
              margin='dense'
              inputProps={{ autoCapitalize: 'off', autoComplete:'off' }}
            />
          </div>
          <div className='reg3 regbox'>
            <TextField
              required
              label='Repeat password:' value={userPwd2}
              onChange={(e) => setUserPwd2(e.target.value)}
              variant='outlined'
              margin='dense'
              inputProps={{ autoCapitalize: 'off', autoComplete:'off' }}
            />
          </div>
          <div className='reg4 regbox'>
            <TextField
              required
              label='Email:' value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              variant='outlined'
              margin='dense'
              inputProps={{ autoCapitalize: 'off' }}
            />
          </div>
          <div className='reg5 regbox'>
            <TextField
              label='First name:' value={userFirstName}
              onChange={(e) => setUserFirstName(e.target.value)}
              variant='outlined'
              margin='dense'
              inputProps={{ autoCapitalize: 'off' }}
            />
          </div>
          <div className='reg6 regbox'>
            <TextField
              label='Last name:' value={userLastName}
              onChange={(e) => setUserLastName(e.target.value)}
              variant='outlined'
              margin='dense'
              inputProps={{ autoCapitalize: 'off' }}
            />
          </div>
          <div className='reg7 regbox'>
            <TextField
              label='Nickname:' value={userNickname}
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
