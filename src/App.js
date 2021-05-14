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
  const store = useStore();
  // const state = store.state;
  // const isLoaded = !store.state.loading;
  const dispatch = store.dispatch;

  useEffect(() => {
    handleGetUserAndData(1, 'API', dispatch);
  }, [dispatch]);

  return (
    <div className="App">
      <Switch>
        <Route path="/" component={AllCats} exact />
        <Route path="/cat/" component={OneCat} exact />
        <Route path="/list/" component={OneList} exact />
        {/* <Route path="/list2/" component={OneList2} exact /> */}
      </Switch>
    </div>
  );
}

export default App;
