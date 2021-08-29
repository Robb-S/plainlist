import './App.css';

import React, { useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import OneCat from './components/OneCat';
import TopPage from './components/TopPage';
import OneList from './components/OneList';
import Login2 from './components/Login2';
import Help from './components/Help';
import Registration from './components/Registration';
import NotFound from './components/NotFound';
import Settings from './components/Settings';
import Loading from './components/Loading';
import { useStore } from './store/StoreContext';
import { handleInitLoad } from './store/fetchUserAndData';
import { getLastList, getRemember } from './store/getData';
// import { sleepy } from './util/helpers';

function App() {
  const store = useStore();
  const { state, dispatch } = store;
  const history = useHistory();

  const startupProc = async () => {
    await handleInitLoad(dispatch);
  };
  useEffect(() => {
    startupProc();
  }, [dispatch]);

  const redirectToLastList = async () => {
    const lastList = getLastList(state);
    const remember = getRemember(state);
    const gotoLastList = remember && (lastList!=0);
    if (gotoLastList) {
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
        <Route path='/login/' component={Login2} exact />
        <Route path='/reg/' component={Registration} exact />
        <Route path='/set/' component={Settings} exact />
        <Route path='/about/' component={Help} exact />
        <Route path='/load/' component={Loading} exact />
        <Route path='*' component={NotFound} />
      </Switch>
      <Toaster />
    </div>
  );
}

export default App;


