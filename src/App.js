import './App.css';

import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import AllCats from './components/AllCats';
import OneCat from './components/OneCat';
import OneList from './components/OneList';
// import OneList2 from './components/OneList2';

// import Loading from './components/Loading';
import {useStore} from './store/StoreContext';
import {handleGetUserAndData} from './store/fetchUserAndData';
import {handleSetRunMode} from './store/handlers';
import * as api from './util/constants';

function App() {
  const runMode = api.RUNMODE_API;   // api.RUNMODE_API or api.RUNMODE_TEST
  // const runMode = api.RUNMODE_TEST;   // api.RUNMODE_API or api.RUNMODE_TEST  
  const testUserID = 1;     // 1 or 2 (when using testData)
  const store = useStore();
  // const state = store.state;
  // const isLoaded = !store.state.loading;
  const dispatch = store.dispatch;
  useEffect(() => {
    handleSetRunMode(runMode, dispatch);
    handleGetUserAndData(testUserID, runMode, dispatch);
  }, [dispatch, runMode]);

  return (
    <div className="App">
      <Switch>
        <Route path="/" component={AllCats} exact />
        <Route path="/cat/" component={OneCat} exact />
        <Route path="/list/" component={OneList} exact />
      </Switch>
    </div>
  );
}

export default App;
