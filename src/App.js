import './App.css';

import React, { useEffect } from 'react';
import ShowList from './components/ShowList';
import {useStore} from './store/StoreContext';
import {handleGetUser} from './store/getUser';

function App() {
  const store = useStore();
  const state = store.state;
  const isLoaded = !store.state.loading;
  const dispatch = store.dispatch;

  useEffect(() => {
    handleGetUser('2', dispatch);
  }, []);


  return (
    <div className="App">
      {isLoaded && <ShowList />}
    </div>
  );
}

export default App;
