/**
 * Display all categories.  Should be shown as top page when in Hierarchical mode
 * (i.e. state.flatMode is false).  Special uncategorized category will be shown at the bottom,
 * or hidden if it's empty.  It will not be sortable with the other categories, and should
 * always have a sortOrder property of zero.
 */
import React, { Fragment, useState } from 'react';
import { useStore } from '../store/StoreContext';
import Loading from './Loading';
import Login from './Login';
import AddCat from './AddCat';
import CategoriesGroup from './CategoriesGroup';
import ShowUncatCat from './ShowUncatCat';
import '../css/lists.css';
import { IconButton, MakeSettingsButton, MakeHelpButton } from './IconButton';
import { getGreeting } from '../store/getData';

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
        <div className='crumbsandsettingsandhelp'>
          <div className='breadcrumbs'>
            <span className='oneCrumb'>
              Welcome { getGreeting(state) }
            </span>
          </div>
          <div className='settingsicon'>
          { MakeSettingsButton() }
          </div>
          <div className='helpicon'>
          { MakeHelpButton() }
          </div>
        </div>
      </Fragment>
    );
  };

  const headingArea = () => {
    const showAddIcon = !addMode; // hide icon when already in add mode
    return (
      <div className='headingZone topHeading'>
        <div className='headingNameArea'>
          All categories
        </div>
        <div className='headingIcons'>
          { showAddIcon &&
            <IconButton config={ { title:'add a new category', caption:'add category',
              iconType:'add', callProc:setupAdd, width:'wide' } } />
          }
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
        <ShowUncatCat />
      </div>
      </Fragment>
      }
    </Fragment>
    );
  };

export default AllCats;
