import './App.css';

import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import AllCats from './components/AllCats';
import OneCat from './components/OneCat';
import OneList from './components/OneList';
import OneItem from './components/OneItem';

// import Loading from './components/Loading';
import {useStore} from './store/StoreContext';
import {handleGetUserAndData} from './store/fetchUserAndData';

function App() {
  const store = useStore();
  // const state = store.state;
  // const isLoaded = !store.state.loading;
  const dispatch = store.dispatch;

  useEffect(() => {
    handleGetUserAndData('2', dispatch);
  }, [dispatch]);

  return (
    <div className="App">
      <Switch>
        <Route path="/" component={AllCats} exact />
        <Route path="/cat/:id" component={OneCat} exact />
        <Route path="/list/:id" component={OneList} exact />
        <Route path="/item/:id" component={OneItem} exact />
      </Switch>
    </div>
  );
}

export default App;
