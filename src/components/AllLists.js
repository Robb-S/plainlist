/**
 * Display all lists, without categories.
 */
import React, { Fragment, useState } from 'react';
import { useStore } from '../store/StoreContext';
import { getUncategorizedCategory, getGreeting } from '../store/getData';
import Login2 from './Login2';
import Loading from './Loading';
import AddList from './AddList';
import ListsGroup from './ListsGroup';  // the actual group (list) of lists
import { IconButton, MakeSettingsButton, MakeHelpButton } from './IconButton';
import '../css/lists.css';

const AllLists = () => {
  const { state } = useStore();  // this must come before conditional render
  const [addMode, setAddMode] = useState(false);  // set add mode when add button is pressed.
  const uncatCat = getUncategorizedCategory(state); // used when adding a new list here
  const showLogin = !state.loading && !state.loggedIn;
  const showLoading = state.loading;
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
        <div className='crumbsplustwo'>
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
     // hide add icon in add mode, or when there's no uncategorized category to add to
    const showAddIcon = ((!addMode) && (uncatCat!=null));
    return (
      <div className='headingZone topHeading'>
        <div className='headingNameArea'>
          All Lists
        </div>
        <div className='headingIcons'>
          { showAddIcon &&
            <IconButton config={ { title:'add a new list', caption:'add a list',
              iconType:'add', callProc:setupAdd } } />
          }
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
      {showLogin && <Login2 />}

      {showMain &&
      <Fragment>
        <div className='mainContainer'>
          { crumbArea() }
          { headingArea() }
          { addListArea() }
          <ListsGroup categoryID={null} />
        </div>
      </Fragment>
    }
    </Fragment>
  );

};

export default AllLists;
