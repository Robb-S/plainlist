import './App.css';

import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import AllCats from './components/AllCats';
import OneCat from './components/OneCat';
import OneList from './components/OneList';
import Login from './components/Login';
import Registration from './components/Registration';

import {useStore} from './store/StoreContext';
import {handleGetUserAndData} from './store/fetchUserAndData';
import {handleSetRunMode} from './store/handlers';
import * as api from './util/constants';

function App() {
  const runMode = api.RUNMODE_API;   // api.RUNMODE_API or api.RUNMODE_DEMO
  // const runMode = api.RUNMODE_DEMO;   // api.RUNMODE_API or api.RUNMODE_DEMO  
  const testUserID = 1;     // 1 or 2 (when using testData)
  const store = useStore();
  // const state = store.state;
  // const isLoaded = !store.state.loading;
  const dispatch = store.dispatch;
  const isLoggedIn = store.isLoggedIn;

  useEffect(() => {
    handleSetRunMode(testUserID, runMode, dispatch);
  }, [dispatch, runMode]);
  

  useEffect(() => {
    if (isLoggedIn) {
      handleGetUserAndData(testUserID, runMode, dispatch);
    }
  }, [dispatch, runMode, isLoggedIn]);

  return (
    <div className="App">
      <Switch>
        <Route path="/" component={AllCats} exact />
        <Route path="/cat/" component={OneCat} exact />
        <Route path="/list/" component={OneList} exact />
        <Route path='/login/' component={Login} exact />
        <Route path='/reg/' component={Registration} exact />
      </Switch>
    </div>
  );
}

export default App;


