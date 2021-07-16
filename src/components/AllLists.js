/**
 * Display all lists, without categories.
 */
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/StoreContext';
import { getAllLists } from '../store/getData';
import Login from './Login';
import Loading from './Loading';
import AddList from './AddList';
import ListsGroup from './ListsGroup';  // the actual group (list) of lists
import { VscSettingsGear, VscEmptyWindow, VscEdit, VscTrash } from 'react-icons/vsc';
import '../css/lists.css';

const AllLists = () => {
  const { state, dispatch } = useStore();  // this must come before conditional render
  const [addMode, setAddMode] = useState(false);  // set add mode when add button is pressed.
  const allLists = getAllLists(state);
  const showLogin = state.loading && !state.loggedIn;
  const showLoading = state.loading && state.loggedIn;
  const showMain = !state.loading;

  const setupAdd = () => { setAddMode(true); };
  const cancelAdd = () => { setAddMode(false); };

  const crumbArea = () => {
    return (
      <Fragment>
        <div className='crumbsandsettings'>
          <div className='breadcrumbs'>
            <span className='oneCrumb'>
              All lists (flat)
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

  /**
   * The header area includes an edit button, and when this is pressed the edit form
   * (to change the category name) will be shown, and the main category will disappear 
   * until the name is updated or cancelled.  While category-name updates are handled by
   * the EditCat component, deletions are handled here.
   */
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
            All Lists (flat)
          </span>
        </div>
      </div>
    );
  };

  const addListArea = () => {
    if (addMode) {
      const addListProps = { cancelAdd: cancelAdd, categoryID: categoryID };
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
