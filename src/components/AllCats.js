/**
 * Display all categories.
 */
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/StoreContext';
import Loading from './Loading';
import Login from './Login';
import AddCat from './AddCat';
import CategoriesGroup from './CategoriesGroup';
import '../css/lists.css';
import { IconButton, MakeSettingsButton } from './IconButton';

const AllCats = () => {
  const { state } =  useStore();
  const [addMode, setAddMode] = useState(false);  // set add mode when add button is pressed.
  let showLogin = state.loading && !state.loggedIn;
  let showLoading = state.loading && state.loggedIn;
  let showMain = !state.loading;

  const setupAdd = () => { setAddMode(true); };
  const cancelAdd = () => { setAddMode(false); };

  const crumbArea = () => {
    return (
      <Fragment>
        <div className='crumbsandsettings'>
          <div className='breadcrumbs'>
            <span className='oneCrumb'>
              Welcome
            </span>
          </div>
          <div className='settingsicon'>
            { MakeSettingsButton() }
          </div>
        </div>
      </Fragment>
    );
  };

  const showAddIcon = () => {
    if (addMode) {return null;}
    return (
      <IconButton config={ { title:'add a new category', caption:'add a category',
       iconType:'add', callProc:setupAdd } } />
    );
  };

  const headingArea = () => {
    return (
      <div className='heading'>
        <div className='headingNameDiv'>
          <span className='headingName'>
            All categories | { }
            <Link className='linky3 oneCrumb' to={`/alllists/`}>
              All lists
            </Link>
          </span>
          { showAddIcon() }
        </div>
      </div>
    );
  };

  /**
   * Show the "add category" button initially, but hide it once it's pressed, return
   * to view when edit is finished or cancelled. 
   */
  const addCatArea = () => {
    if (addMode) {
      const addCatProps = { addMode: addMode, cancelAdd: cancelAdd };
      return (<AddCat props={ addCatProps } />);
    }
  };

  return (
    <Fragment>
      {showLoading && <Loading />}
      {showLogin && <Login />}

      {showMain &&
      <Fragment>
      <div className='mainContainer'>
        { crumbArea() }
        { headingArea() }
        { addCatArea() }
        <CategoriesGroup />
      </div>
      </Fragment>
      }
    </Fragment>
    );
  };

export default AllCats;
