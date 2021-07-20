/**
 * Display all categories or all lists, depending on flatMode.
 */
import React, { Fragment } from 'react';
import { useStore } from '../store/StoreContext';
import Loading from './Loading';
import Login from './Login';
import AllCats from './AllCats';
import AllLists from './AllLists';

const TopPage = () => {
  const { state } = useStore();  // this must come before conditional render
  let showLogin = state.loading && !state.loggedIn;
  let showLoading = state.loading && state.loggedIn;
  let showMain = !state.loading;
  let showFlat = state.flatMode;
  return (
    <Fragment>
      {showLoading && <Loading />}
      {showLogin && <Login />}

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
