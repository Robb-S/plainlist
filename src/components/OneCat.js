/**
 * Display the lists in one category.  In order to hide the category ID from the URL,
 * the ID is passed in via data from a LINK statement.  If the URL was entered manually, 
 * this won't happen, in which case we redirect to the main page.
 */
import React, { Fragment, useState } from 'react';
import { Link, useLocation, Redirect } from 'react-router-dom';
import { useStore } from '../store/StoreContext';
import { getCatRec } from '../store/getData';
import Login2 from './Login2';
import Loading from './Loading';
import EditCat from './EditCat';
import AddList from './AddList';
import ListsGroup from './ListsGroup';  // the actual group (list) of lists
import { IconButton, MakeSettingsButton, MakeHelpButton } from './IconButton';
import { handleRemoveCategory  } from '../store/handlers';
import '../css/lists.css';

const OneCat = () => {
  const data = useLocation(); // to retrieve params from data.state
  // data.state will only exist when set up in LINK, not if URL was entered manually
  let needsRedirect = data.state ? false : true; // is it called from link or manual URL
  const categoryID = needsRedirect ? null : data.state.categoryID;
  const { state, dispatch } = useStore();  // this must come before conditional render
  const [editMode, setEditMode] = useState(false);  // set edit mode when button is pressed.
  const [addMode, setAddMode] = useState(false);  // set add mode when add button is pressed.
  const oneCatRec = getCatRec(categoryID, state);
  if (oneCatRec===null) {needsRedirect=true;} // this will happen after record deletion
  if (needsRedirect) {return (<Redirect to="/" />);}  // back to main page if no ID
  const showLogin = !state.loading && !state.loggedIn;
  const showLoading = state.loading && state.loggedIn;
  const showMain = !state.loading;
  
  const setupEdit = () => { setEditMode(true); };
  const cancelEdit = () => { setEditMode(false); };
  const setupAdd = () => { setAddMode(true); };
  const cancelAdd = () => { setAddMode(false); };
  const removeCategory = async () => {
    handleRemoveCategory(categoryID, state, dispatch);
  };

  const crumbArea = () => {
    return (
      <Fragment>
        <div className='crumbsplustwo'>
          <div className='breadcrumbs'>
            <Link className='linky3 oneCrumb' to={`/`}>
              All categories
            </Link>
            <span className='oneCrumb'>:</span>
            <span className='oneCrumb'>
              {oneCatRec.categoryName}
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

  /**
   * The header area includes an edit button, and when this is pressed the edit form
   * (to change the category name) will be shown, and the main category will disappear 
   * until the name is updated or cancelled.  While category-name updates are handled by
   * the EditCat component, deletions are handled here.
   */
  const mainDisplayOrEditForm = () => {
    if (editMode) {
      const editCatProps = { cancelEdit: cancelEdit, categoryRec: oneCatRec };
      return (<EditCat props={editCatProps} />);
    }
    return (
      <Fragment>
        { headingArea() }
        { addListArea() }
        <ListsGroup categoryID={categoryID} />
      </Fragment>
    );
  };

  const headingArea = () => {
    const showAddIcon = !addMode; // hide icon when already in add mode
    // don't allow delete or renaming of uncategorized category
    const showEditAndDelete = oneCatRec.uncategorized !== true;
    return (
      <div className='headingZone catHeading'>
        <div className='headingNameArea'>
          Category: {oneCatRec.categoryName}
        </div>
        <div className='headingIcons'>
          { showAddIcon &&
            <IconButton config={ { title:'add a new list', caption:'add a list',
              iconType:'add', callProc:setupAdd } } />
          }
          { showEditAndDelete &&
            <IconButton config={ { title:'rename category', caption:'rename category',
              iconType:'edit', callProc:setupEdit } } />
          }
          { showEditAndDelete &&
            <IconButton config={ { title:'delete category', caption:'delete category',
              iconType:'delete', callProc:removeCategory } } />
          }
        </div>
      </div>
    );
  };

  const addListArea = () => {
    if (addMode) {
      const addListProps = { cancelAdd: cancelAdd, categoryID: categoryID };
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
          { mainDisplayOrEditForm() }
        </div>
      </Fragment>
    }
    </Fragment>
  );

};

export default OneCat;
