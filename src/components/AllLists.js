/**
 * Display all lists, without categories.
 */
import React, { Fragment, useState } from 'react';
import { useStore } from '../store/StoreContext';
import { getUncategorizedCategory } from '../store/getData';
import Login from './Login';
import Loading from './Loading';
import AddList from './AddList';
import ListsGroup from './ListsGroup';  // the actual group (list) of lists
import { IconButton, MakeSettingsButton } from './IconButton';
import '../css/lists.css';

const AllLists = () => {
  const { state } = useStore();  // this must come before conditional render
  const [addMode, setAddMode] = useState(false);  // set add mode when add button is pressed.
  const uncatCat = getUncategorizedCategory(state); // used when adding a new list
  const showLogin = state.loading && !state.loggedIn;
  const showLoading = state.loading && state.loggedIn;
  const showMain = !state.loading;

  const setupAdd = () => {
    if (uncatCat!==null) {
      setAddMode(true);
    } else { // can't find uncategorized category; this shouldn't ever happen though
      alert ('Sorry, cannot add uncategorized list; please switch to category mode.');
    }
  };
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

  // TODO: merge this
  const mainDisplayOrEditForm = () => {
    return (
      <Fragment>
        { headingArea() }
        { addListArea() }
        <ListsGroup categoryID={null} />
      </Fragment>
    );
  };

  const showAddIcon = () => {
    if (addMode && uncatCat!==null) {return null;}
    return (
      <IconButton config={ { title:'add a new list', caption:'add a list',
        iconType:'add', callProc:setupAdd } } />
    );
  };

  const headingArea = () => {
    return (
      <div className='heading'>
        <div className='headingNameDiv'>
          <span className='headingName'>
            All Lists
          </span>
          { showAddIcon() }
        </div>
      </div>
    );
  };

  /**
   * Swap in the component to add a list.
   */
  const addListArea = () => {
    if (addMode && uncatCat!==null) {
      const addListProps = { cancelAdd: cancelAdd, categoryID: uncatCat.id };
      return (<AddList props={addListProps} />);
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
          { mainDisplayOrEditForm() }
        </div>
      </Fragment>
    }
    </Fragment>
  );

};

export default AllLists;
