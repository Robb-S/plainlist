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
  const newCat = !data.state ? false : data.state.newCat==='new';
  const { state, dispatch } = useStore();  // this must come before conditional render
  const [editMode, setEditMode] = useState(false);  // set edit mode when button is pressed.
  const [addMode, setAddMode] = useState(newCat);  // also true when new category is set up.
  const [moreMode, setMoreMode] = useState(false); // show or hide extra group of icons
  const oneCatRec = getCatRec(categoryID, state);
  if (oneCatRec===null) {needsRedirect=true;} // this will happen after record deletion
  if (needsRedirect) {return (<Redirect to="/" />);}  // back to main page if no ID
  const showLoading = state.loading;
  const showLogin = !state.loading && !state.loggedIn;
  const showMain = !state.loading  && state.loggedIn;
  const showMore = !state.loading && moreMode && !addMode; ; // show more icons for additional operations
  const showAdd = !state.loading && addMode;
  const showEdit = !state.loading && editMode;

  const setupEdit = () => { clearAllModes(); setEditMode(true); };
  const cancelEdit = () => { setEditMode(false); };
  const setupAdd = () => { clearAllModes(); setAddMode(true); };
  const cancelAdd = () => { setAddMode(false); };
  const setupMore = () => { clearAllModes(); setMoreMode(true); };
  const cancelMore = () => { setMoreMode(false); };
  const clearAllModes = () => {
    setMoreMode(false);
    setAddMode(false);
    setEditMode(false);
  };
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
            <span>: </span>
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
    return (
      <Fragment>
        { headingArea() }
        { showMore && moreIconsZone() }
        { showAdd && <AddList cancelAdd={cancelAdd} categoryID={categoryID} /> }
        { showEdit && <EditCat cancelEdit={cancelEdit} categoryRec={oneCatRec} /> }
        <ListsGroup categoryID={categoryID} />
      </Fragment>
    );
  };

  const headingArea = () => {
    // don't allow delete or renaming of uncategorized category
    const showEditAndDelete = oneCatRec.uncategorized !== true;
    return (
      <div className='headingZone catHeading'>
        <div className='headingNameArea'>
          Category: {oneCatRec.categoryName}
        </div>
        <div className='headingIcons'>
          <IconButton config={ { title:'add a new list', caption:'add a list',
            disabled:addMode,
            iconType:'add', callProc:setupAdd } } />
          { showEditAndDelete &&
            <IconButton config={ { title:'more operations on this category',
              caption:'changes to category', disabled:moreMode,
              iconType:'more', callProc:setupMore } } />
          }
        </div>
      </div>
    );
  };

  const moreIconsZone = () => {
    return (
      <div className='moreIcons'>
        <IconButton config={ { title:'rename category', caption:'rename category',
          width:'wide', iconType:'edit', callProc:setupEdit } } />
        <IconButton config={ { title:'delete category', caption:'delete category',
          width:'wide', iconType:'delete', callProc:removeCategory } } />
        <IconButton config={ { title:'close submenu of category changes', caption:'close submenu',
          width:'wide', iconType:'close', callProc:cancelMore } } />
      </div>
    );
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
