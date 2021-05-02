import './App.css';

import React, { useEffect } from 'react';
import ShowList from './components/ShowList';
import Loading from './components/Loading';
import {useStore} from './store/StoreContext';
import {handleGetUserAndData} from './store/getUser';

function App() {
  const store = useStore();
  // const state = store.state;
  const isLoaded = !store.state.loading;
  const dispatch = store.dispatch;

  useEffect(() => {
    handleGetUserAndData('2', dispatch);
  }, [dispatch]);

  return (
    <div className="App">
      {!isLoaded && <Loading />}
      {isLoaded && <ShowList />}
    </div>
  );
}

export default App;
