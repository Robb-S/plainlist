/**
 * Display all categories or all lists, depending on flatMode.
 */
import React, { Fragment } from 'react';
import { useStore } from '../store/StoreContext';
import Loading from './Loading';
import Login2 from './Login2';
import AllCats from './AllCats';
import AllLists from './AllLists';
import { getFlatMode2 } from '../store/getData';

const TopPage = () => {
  const { state } = useStore();  // this must come before conditional render
  // let showLogin = state.loading && !state.loggedIn;
  // let showLogin = !state.loggedIn;
  // let showLoading = state.loading && state.loggedIn;
  // let showMain = !state.loading && state.loggedIn;
  const showLoading = state.loading;
  const showLogin = !state.loading && !state.loggedIn;
  const showMain = !state.loading  && state.loggedIn;
  const isLaunched = state.isLaunched; // don't show login screen until login token checked

  let showFlat = getFlatMode2(state);
  return (
    <Fragment>
      {showLoading && <Loading />}
      {showLogin && isLaunched && <Login2 />}

      {showMain && showFlat &&
        <AllLists />
      }
      {showMain && !showFlat &&
        <AllCats />
      }
    </Fragment>
    );
  };

export default TopPage;
