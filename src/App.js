import './App.css';

import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import OneCat from './components/OneCat';
import TopPage from './components/TopPage';
import OneList from './components/OneList';
import Login from './components/Login';
import Help from './components/Help';
import Registration from './components/Registration';
import NotFound from './components/NotFound';

import Settings from './components/Settings';

import { useStore } from './store/StoreContext';
import { handleSetRunModeAndInitLoad } from './store/fetchUserAndData';
// import * as api from './util/constants';

function App() {
  const runMode = process.env.REACT_APP_RUNMODE;   // API or DEMO
  // const runMode = api.RUNMODE_API;
  const testUserID = parseInt(process.env.REACT_APP_TEST_USER);   // 1 or 2 (when in DEMO mode)
  const store = useStore();
  const dispatch = store.dispatch;
  // console.log('*** starting app ***');  

  useEffect(() => {
    console.log('** starting up **');
    handleSetRunModeAndInitLoad(testUserID, runMode, dispatch);
  }, [dispatch, runMode]);
  
  return (
    <div className="App">
      <Switch>
        <Route path="/" component={TopPage} exact />
        <Route path="/cat/" component={OneCat} exact />
        <Route path="/list/" component={OneList} exact />
        <Route path='/login/' component={Login} exact />
        <Route path='/reg/' component={Registration} exact />
        <Route path='/set/' component={Settings} exact />
        <Route path='/about/' component={Help} exact />
        <Route path='*' component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;


