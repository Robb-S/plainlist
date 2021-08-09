import './App.css';

import React, { useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import OneCat from './components/OneCat';
import TopPage from './components/TopPage';
import OneList from './components/OneList';
import Login from './components/Login';
import Help from './components/Help';
// import Registration from './components/Registration';
import Registration2 from './components/Registration2';
import NotFound from './components/NotFound';

import Settings from './components/Settings';

import { useStore } from './store/StoreContext';
import { handleSetRunModeAndInitLoad } from './store/fetchUserAndData';
import { getLastList } from './store/getData';
// import { sleepy } from './util/helpers';

function App() {
  const runMode = process.env.REACT_APP_RUNMODE;   // API or DEMO
  const testUserID = parseInt(process.env.REACT_APP_TEST_USER);   // 1 or 2 (when in DEMO mode)
  const store = useStore();
  const { state, dispatch } = store;
  const history = useHistory();

  const startupProc = async () => {
    await handleSetRunModeAndInitLoad(testUserID, runMode, dispatch);
  };
  useEffect(() => {
    startupProc();
  }, [dispatch, runMode]);

  const redirectToLastList = async () => {
    const lastList = await getLastList(state);
    if (lastList!=0) {
      history.push('/list/', { listID:lastList });
    } else {
      history.push('/');
    }
  };
  useEffect(() => {
    redirectToLastList();
  }, [state.profile.lastList]);

  return (
    <div className="App">
      <div className='topLogo'>- Cross It Off the List -</div>
      <Switch>
        <Route path="/" component={TopPage} exact />
        <Route path="/cat/" component={OneCat} exact />
        <Route path="/list/" component={OneList} exact />
        <Route path='/login/' component={Login} exact />
        <Route path='/reg/' component={Registration2} exact />
        <Route path='/set/' component={Settings} exact />
        <Route path='/about/' component={Help} exact />
        <Route path='*' component={NotFound} />
      </Switch>
      <Toaster />
    </div>
  );
}

export default App;


