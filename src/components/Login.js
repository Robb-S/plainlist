import React, {Fragment, useState} from 'react';
import '../css/lists.css';
import {useStore} from '../store/StoreContext';
import {handleLogin} from '../store/handlers';
import { useHistory } from 'react-router-dom';

const Login = () => {  
  const {state, dispatch} = useStore();
  const history = useHistory();
  // const isLoaded = !state.loading;  // maybe not needed, if handled by parent component
  // const userID = state.user.id;

  const [userName, setUserName] = useState('');
  const [userPwd, setUserPwd] = useState('');

  const onSubmitUser = (e) => {
    e.preventDefault();
    if ((userName.length===0) || (userPwd.length===0)) {return;}
    const userInfo = { userName: userName, userPwd: userPwd};
    handleLogin(userInfo, state, dispatch);
    history.push('/');
  };

  return (
    <Fragment>
        <div className='additem'>
          <form onSubmit={onSubmitUser}>
            <label>User name: </label>
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              placeholder="user name"
            />
            <label> Password: </label>
            <input
              value={userPwd}
              onChange={(e) => setUserPwd(e.target.value)}
              type="text"
              placeholder="password"
            />
            <button>Log in</button>
          </form>
        </div>      
    </Fragment>
  )
}

export default Login;
