import React, {Fragment, useState} from 'react';
import '../css/lists.css';
import {useStore} from '../store/StoreContext';
import {handleReg} from '../store/handlers';
import { useHistory, Link } from 'react-router-dom';

const Registration = () => {  
  const {state, dispatch} = useStore();
  const history = useHistory();
  // const isLoaded = !state.loading;  // maybe not needed, if handled by parent component
  // const userID = state.user.id;

  const [userName, setUserName] = useState('');
  const [userPwd, setUserPwd] = useState('');
  const [userPwd2, setUserPwd2] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [regMsg, setRegMsg] = useState('Please fill out the fields below.');

  const onSubmitReg = async (e) => {
    e.preventDefault();
    if ((userName.length===0) || (userPwd.length===0)) {return;}
    const userInfo = { userName: userName, userPwd: userPwd, 
      userPwd2: userPwd2, userEmail: userEmail};
    const regResult = await handleReg(userInfo, state, dispatch);
    console.log(regResult);
    // handleReg(userInfo, state, dispatch);
    if (regResult==='success') { history.push('/'); }
    else setRegMsg(regResult);
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
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              placeholder="user name"
            />
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
        <div className='redirectLink'>
          <Link to={{ pathname: '/login/' }}>
            Or log in (for existing users)
          </Link>
        </div>
    </Fragment>
  )
}

export default Registration;
