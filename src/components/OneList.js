/**
 * Show a single list.  The list ID is passed from the LINK in the previous component 
 * rather than as part of the URL.  If someone just types in the URL there won't be
 * a list ID, and the URL will be rerouted to the home page.  This will also happen 
 * after a list is deleted.
 * 
 * In addition to displaying, adding and removing items, the user can edit (rename), 
 * delete, or move (to a different category) the list itself.  If the edit or move icon
 * is pressed, the list is hidden and a form to edit or move is shown instead, until
 * the operation is performed or the cancel button is pressed.
 * 
 * The area below the headingArea will show one of the following:
 * - form to add an item (default start on desktop) / addMode===true
 * - single icon for "add item" (default start on mobile) / addMode===false, moreMode===false
 * - "add item" icon plus more icons for additional operations (change category, copy 
 *     list, etc.) / moreMode===true, addMode===false
 * - form to move a list (change category) / moveMode===true
 */
import React, { Fragment, useState, useEffect } from 'react';
import { Link, useLocation, Redirect, useHistory } from 'react-router-dom';
import '../css/lists.css';
import { useStore } from '../store/StoreContext';
import { getListRec, getParentCatName, getParentCatID, getOtherCats, getFlatMode2 }
  from '../store/getData';
import { handleRemoveList } from '../store/handlers';
import Login2 from './Login2';
import Loading from './Loading';
import EditList from './EditList';  // form to edit the list name
import MoveList from './MoveList';  // form to move the list to another category
import AddItemForm from './AddItemForm';    // form to add an item
import ItemsGroup from './ItemsGroup';  // the actual group (list) of items
import { IconButton, MakeSettingsButton, MakeHelpButton } from './IconButton';
import { getMobile } from '../store/getData';
import { useEscape } from '../util/helpers'; // set addMode to false

const OneList = () => {
  const data = useLocation(); // to retrieve params from data.state
  // data.state will only exist when set up in LINK, not if URL was entered manually
  let needsRedirect = data.state ? false : true; // is it called from link or manual URL
  const listID = needsRedirect ? null : data.state.listID;
  console.log('** listID: ' + listID);
  const { state, dispatch } = useStore();    // this must come before conditional render
  const history = useHistory();
  const [addMode, setAddMode] = useState(!getMobile(state)); // if mobile, show only button
  const [editMode, setEditMode] = useState(false); // set edit mode when button is pressed
  const [moveMode, setMoveMode] = useState(false); // set move mode when button is pressed
  const [moreMode, setMoreMode] = useState(false); // show or hide extra group of icons 
  const oneListRec = getListRec(listID, state);
  if (oneListRec===null) {needsRedirect=true;} // this will happen after record deletion
  if (needsRedirect) {return (<Redirect to="/" />);}  // back to main page if no ID
  const showLoading = state.loading;
  const showLogin = !state.loading && !state.loggedIn;
  const showMain = !state.loading  && state.loggedIn;
  const showMore = !state.loading && moreMode && !addMode; // show more icons for additional operations
  const showAdd = !state.loading && addMode;
  const showAddIcon = !state.loading && !moreMode && !addMode;

  const parentCatName = getParentCatName(listID, state);
  const parentCatID = getParentCatID(listID, state);
  // see if there are other categories; equivalent to getAllCats.length>1, but maybe safer
  const areThereOtherCats = getOtherCats(parentCatID, state).length>0;

  const setupAdd = () => { setAddMode(true); };
  const cancelAdd = () => { setAddMode(false); setMoreMode(false); };
  const setupEdit = () => { setEditMode(true); };
  const cancelEdit = () => { setEditMode(false); };
  const setupMove = () => { setMoveMode(true); };
  const cancelMove = () => { setMoveMode(false); };
  const setupMore = () => { setMoreMode(true); setAddMode(false); };
  const cancelMore = () => { setMoreMode(false); };

  useEffect(() => { // make sure addMode is up to date if isMobile tester is slow
    // console.log('** setting AddMode to ' + (!state.isMobile).toString());
    setAddMode(!getMobile(state));
  }, [state.isMobile]);

  const removeList = async () => {
    await handleRemoveList(listID, state, dispatch);
    if (parentCatID!=null) history.push('/cat/', { categoryID:parentCatID });
  };

  /**
   * Breadcrumb area will show different structure depending on whether user is in
   * flat mode or category mode. 
   */
  const crumbArea = () => {
    const isFlatMode = getFlatMode2(state);
    return (
      <Fragment>
        <div className='crumbsplustwo'>
          <div className='breadcrumbs'>
            { isFlatMode &&
              <Fragment>
                <Link className='linky3 oneCrumb' to={`/`}>
                  [All lists]
                </Link>
              </Fragment>
            }
            { !isFlatMode &&
              <Fragment>
                <Link className='linky3 oneCrumb' to={`/`}>
                  [All]
                </Link>
                <span className='oneCrumb'>:</span>
                Category &nbsp;
                <Link className='linky3 oneCrumb'
                  to={{
                    pathname: `/cat/`,
                    state: { categoryID: parentCatID },
                  }}
                >[{parentCatName}]</Link>
              </Fragment>
            }
            <span className='oneCrumb hiddenOnDevice'>:</span>
            <span className='oneCrumb hiddenOnDevice'>
              {oneListRec.listName}
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
    return (
      <div className='headingZone listHeading'>
        <div className='headingNameArea'>
          {oneListRec.listName}
        </div>
        <div className='headingIcons'>
          <IconButton config={ { title:'rename list', caption:'rename list',
            iconType:'edit', callProc:setupEdit } } />
          <IconButton config={ { title:'more operations', caption:'more',
            iconType:'more', callProc:setupMore } } />
        </div>
      </div>
    );
  };

  /**
   * Show move icon or hide it depending on whether there are other categories 
   * to move to.
   */
  const showOrHideMoveIcon = () => {
    if (!areThereOtherCats) {return null;}
    return (
      <IconButton config={ { title:'change category for this list', caption:'change category',
        iconType:'move', callProc:setupMove } } />
    );
  };

  const addItemIconAlone = () => {
    return (
      <Fragment>
        <div className='addItemIconContainer'>
          <div className='addItemIcon'>
            <IconButton config={ { title:'add a new item', caption:'add item',
              iconType:'add', width:'wide', callProc:setupAdd } } />
          </div>
        </div>
      </Fragment>
    );
  };

  const moreIconsZone = () => {
    return (
      <div className='oneListMoreIcons'>
        <IconButton config={ { title:'add a new item', caption:'add item',
          iconType:'add', callProc:setupAdd } } />
        { showOrHideMoveIcon() }
        <IconButton config={ { title:'delete list', caption:'delete list',
          iconType:'delete', callProc:removeList } } />
      </div>
    );
  };

  /**
   * The header area includes an edit button, and when this is pressed the edit form
   * (to change the list name) will be shown, and the main list will disappear until
   * the name is updated or cancelled.  While list-name updates are handled by
   * the EditList component, deletions are handled here.
   */
  const mainDisplayOrMoveOrEditForm = () => {
    if (editMode) {
      const editListProps = { cancelEdit: cancelEdit, listRec: oneListRec };
      return (<EditList props={editListProps} />);
    }
    if (moveMode) {
      const moveListProps = { cancelMove: cancelMove, listRec: oneListRec };
      return (<MoveList props={moveListProps} />);
    }
    return (
      <Fragment>
        { headingArea() }
        { showAdd && <AddItemForm cancelAdd={cancelAdd} listID={listID} /> }
        { showMore && moreIconsZone() }
        { showAddIcon && addItemIconAlone() }
        <ItemsGroup />
      </Fragment>
    );
  };

  useEscape(() => cancelAdd());
  return (
    <Fragment>
      {showLoading && <Loading />}
      {showLogin && <Login2 />}

      {showMain &&
      <Fragment>
        <div className='mainContainer'>
          { crumbArea() }
          { mainDisplayOrMoveOrEditForm() }
        </div>
      </Fragment>
      }
    </Fragment>
  );

};

export default OneList;
