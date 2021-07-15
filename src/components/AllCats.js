import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/StoreContext';
import Loading from './Loading';
import Login from './Login';
import AddCat from './AddCat';
import CategoriesGroup from './CategoriesGroup';
import { VscSettingsGear, VscEmptyWindow } from 'react-icons/vsc';
import '../css/lists.css';

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
              All categories
            </span>
          </div>
          <div className='settingsicon'>
            <Link className='linky3 oneCrumb' to={`/set/`}>
              <VscSettingsGear
                title='settings' className='iconBorder' size='24' color='#555555' />
            </Link>
          </div>
        </div>
      </Fragment>
    );
  };


  const headingArea = () => {
    return (
      <div className='heading'>
        <div className='headingNameDiv'>
          <span className='headingName'>
            All categories
          </span>
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
    return (
      <div className="showAddArea">
        <span className='iconBorder'>
          <VscEmptyWindow onClick={() => setupAdd()} title='add new category'
            className='cursorPointer' size='22' color='#555555' />
        </span>
        <span className="headerAddLabel cursorPointer"  onClick={() => setupAdd()} >Add new category</span>
      </div>
    );
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
