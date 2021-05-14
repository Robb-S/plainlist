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

function App() {
  const testMode = 'API';   // API or testData
  const testUserID = 1;     // 1 or 2 (when using testData)
  const store = useStore();
  // const state = store.state;
  // const isLoaded = !store.state.loading;
  const dispatch = store.dispatch;

  useEffect(() => {
    handleGetUserAndData(testUserID, testMode, dispatch);
  }, [dispatch]);

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
