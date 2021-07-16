/**
 * Display all lists, without categories.
 */
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/StoreContext';
import { getAllLists, getUncategorizedCategory } from '../store/getData';
import Login from './Login';
import Loading from './Loading';
import AddList from './AddList';
import ListsGroup from './ListsGroup';  // the actual group (list) of lists
import { VscSettingsGear, VscEmptyWindow, VscEdit, VscTrash } from 'react-icons/vsc';
import '../css/lists.css';

const AllLists = () => {
  const { state, dispatch } = useStore();  // this must come before conditional render
  const [addMode, setAddMode] = useState(false);  // set add mode when add button is pressed.
  const uncatCat = getUncategorizedCategory(state); // used when adding a new list
  const allLists = getAllLists(state);
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
            <Link className='linky3 oneCrumb' to={`/set/`}>
              <VscSettingsGear
                title='settings' className='iconBorder' size='24' color='#555555' />
            </Link>
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

  const headingArea = () => {
    return (
      <div className='heading'>
        <div className='headingNameDiv'>
          <span className='headingName'>
            All Lists
          </span>
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
    return (
      <Fragment>
      <div className="showAddArea">
        <span className='iconBorder'>
          <VscEmptyWindow onClick={() => setupAdd()} title='add new list'
            className='cursorPointer' size='22' color='#555555' />
        </span>
        <span className="headerAddLabel cursorPointer" onClick={() => setupAdd()} >
          Add new list
        </span>
      </div>
      </Fragment>
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
          { mainDisplayOrEditForm() }
        </div>
      </Fragment>
    }
    </Fragment>
  );

};

export default AllLists;
