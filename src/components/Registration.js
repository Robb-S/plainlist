import React, { Fragment, useState, useEffect } from 'react';
import '../css/lists.css';
import { useStore } from '../store/StoreContext';
import { handleReg } from '../store/handlersUser';
import { useDebounce } from '../util/helpers';
import { useHistory, Link } from 'react-router-dom';
import { userExistsAPI } from '../store/apiCalls';
import * as api from '../util/constants';

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

  const onSubmitReg = async (e) => {
    e.preventDefault();
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

  // # BASE_URL/isuser/admin/ pattern
  const onChangeUserName = async (e) => {
    const uName = e.target.value;
    console.log('length: ' + uName.length);
    setUserName(uName);
  };

  return (
    <Fragment>
        <div className='additem'>
          <div className='msgPanel'>{regMsg}</div>
          <br />
          <form onSubmit={onSubmitReg}>
            <label>User name: </label>
            <input
              value={userName}
              onChange={onChangeUserName}
              type="text"
              placeholder="user name"
            />
            <br />
            {uNameMsg}
            <br /><br />
            <label> Password: </label>
            <input
              value={userPwd}
              onChange={(e) => setUserPwd(e.target.value)}
              type="text"
              placeholder="password"
            />
            <br /><br />
            <label> Repeat password: </label>
            <input
              value={userPwd2}
              onChange={(e) => setUserPwd2(e.target.value)}
              type="text"
              placeholder="repeat password"
            />

            <br /><br />
            <label> First name: </label>
            <input
              value={userFirstName}
              onChange={(e) => setUserFirstName(e.target.value)}
              type="text"
              placeholder="first name"
            />

            <br /><br />
            <label> Last name: </label>
            <input
              value={userLastName}
              onChange={(e) => setUserLastName(e.target.value)}
              type="text"
              placeholder="last name"
            />

            <br /><br />
            <label> Nickname: </label>
            <input
              value={userNickname}
              onChange={(e) => setUserNickname(e.target.value)}
              type="text"
              placeholder="nickname"
            />

            <br /><br />
            <label> Email: </label>
            <input
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              type="text"
              placeholder="email"
            />
            <br /><br />
            <button>Register</button>
          </form>
        </div>
        <button
          className="btn default-btn hidden"
           onClick={() => onTestButton()}
        >
          Test Button
        </button><br />

        <div className='redirectLink'>
          <Link to={{ pathname: '/login/' }}>
            Or log in (for existing users)
          </Link>
        </div>
    </Fragment>
  );
};



export default Registration;
