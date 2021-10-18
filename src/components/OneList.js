/**
 * Show a single list.  The list ID is passed from the LINK in the previous component 
 * rather than as part of the URL.  If someone just types in the URL there won't be
 * a list ID, and the URL will be rerouted to the home page.  This will also happen 
 * after a list is deleted.
 * 
 * In addition to displaying, adding and removing items, the user can edit (rename), 
 * delete, or move (to a different category) the list itself, for copy the list.  
 * If the edit or move icon is pressed, the list is hidden and a form to edit or move is
 * shown instead, until the operation is performed or the cancel button is pressed.
 * 
 * The area below the headingArea will show one of the following:
 * 1) nothing (default)
 * 2) row of icons to alter this list (rename, delete, move, copy) / moreMode===true
 * 3) form to add an item / addMode===true
 * 4) form to move a list (list of other categories) / moveMode===true
 * 5) form to copy a list (name of new list) / copyMode===true
 * 6) the actual list of items will be displayed unless #4 or #5 is visible.
 */
import React, { Fragment, useState } from 'react';
import { Link, useLocation, Redirect, useHistory } from 'react-router-dom';
import '../css/lists.css';
import { useStore } from '../store/StoreContext';
import { getListRec, getParentCatName, getParentCatID, getOtherCats, getFlatMode2 }
  from '../store/getData';
import { handleRemoveList } from '../store/handlers';
import Login2 from './Login2';
import Loading from './Loading';
import EditList from './EditList';  // form to edit the list name
import CopyList from './CopyList';  // form to edit new list name
import MoveList from './MoveList';  // form to move the list to another category
import AddItemForm from './AddItemForm';    // form to add an item
import ItemsGroup from './ItemsGroup';  // the actual group (list) of items
import { IconButton, MakeButtonForLink } from './IconButton';
// import { getMobile } from '../store/getData';
import { useEscape } from '../util/helpers'; // set addMode to false
import * as api from '../util/constants';

const OneList = () => {
  const data = useLocation(); // to retrieve params from data.state
  // data.state will only exist when set up in LINK, not if URL was entered manually
  let needsRedirect = data.state ? false : true; // is it called from link or manual URL
  const listID = needsRedirect ? null : data.state.listID;
  const newList = !data.state ? false : data.state.newList==='new';
  const { state, dispatch } = useStore();    // this must come before conditional render
  const history = useHistory();
  const [addMode, setAddMode] = useState(newList); // just show items, not add form.
  const [editMode, setEditMode] = useState(false); // edit list name
  const [moveMode, setMoveMode] = useState(false); // show form to change category
  const [moreMode, setMoreMode] = useState(false); // show or hide extra group of icons
  const [copyMode, setCopyMode] = useState(false); // show form to copy list
  useEscape(() => cancelAdd()); // need to use this before any branching
  const oneListRec = getListRec(listID, state);
  if (oneListRec===null) {needsRedirect=true;} // this will happen after record deletion
  if (needsRedirect) {return (<Redirect to="/" />);}  // back to main page if no ID
  const isFlatMode = getFlatMode2(state);
  const showLoading = state.loading;
  const showLogin = !state.loading && !state.loggedIn;
  const showMain = !state.loading  && state.loggedIn;
  const showMore = !state.loading && moreMode && !addMode; // show more icons for additional operations
  const showAdd = !state.loading && addMode;
  const showMove = !state.loading && moveMode;
  const showEdit = !state.loading && editMode;
  const showItems = !state.loading && !editMode && !moveMode && !copyMode;
  const showCopy = !state.loading && copyMode;

  const parentCatName = getParentCatName(listID, state);
  const parentCatID = getParentCatID(listID, state);
  // see if there are other categories; equivalent to getAllCats.length>1, but maybe safer
  const areThereOtherCats = getOtherCats(parentCatID, state).length>0;

  const setupAdd = () => { clearAllModes(); setAddMode(true); };
  const cancelAdd = () => { setAddMode(false); };
  const setupEdit = () => { clearAllModes(); setEditMode(true); };
  const cancelEdit = () => { setEditMode(false); setMoreMode(true); };
  const setupMove = () => { clearAllModes(); setMoveMode(true); };
  const cancelMove = () => { setMoveMode(false); setMoreMode(true); };
  const setupMore = () => { clearAllModes(); setMoreMode(true); };
  const cancelMore = () => { setMoreMode(false); };
  const setupCopy = () => { clearAllModes(); setCopyMode(true); };
  const cancelCopy = () => { setCopyMode(false); setMoreMode(true); };
  const clearAllModes = () => {
    setMoreMode(false);
    setAddMode(false);
    setCopyMode(false);
    setMoveMode(false);
    setEditMode(false);
  };

  // NOTE: Reinstate this in order to show/hide add form depending on platform.
  // useEffect(() => { // make sure addMode is up to date if isMobile tester is slow
  //   // console.log('** setting AddMode to ' + (!state.isMobile).toString());
  //   setAddMode(!getMobile(state));
  // }, [state.isMobile]);

  // go to parent category page after deletion, or top page if in flat mode
  const removeList = async () => {
    const status = await handleRemoveList(listID, state, dispatch);
    if (status===api.OK) {
      if (isFlatMode) {
        history.push('/');
      } else {
        if (parentCatID!=null) history.push('/cat/', { categoryID:parentCatID });
      }
    }
  };

  /**
   * Breadcrumb area will show different structure depending on whether user is in
   * flat mode or category mode. 
   */
  const crumbArea = () => {
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
            { MakeButtonForLink('settings') }
          </div>
          <div className='helpicon'>
            { MakeButtonForLink('help') }
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
          <IconButton config={ { title:'add a new item', caption:'add an item',
            disabled:addMode,
            iconType:'add', callProc:setupAdd } } />
          <IconButton config={ { title:'more operations on this list',
            caption:'changes to list', disabled:moreMode,
            iconType:'more', callProc:setupMore } } />
        </div>
      </div>
    );
  };

  const moreIconsZone = () => {
    return (
      <div className='moreIcons moreIcons5'>
        <IconButton config={ { title:'rename list', caption:'rename this list',
          width:'wide', iconType:'edit', callProc:setupEdit } } />
        <IconButton config={ { title:'change category for this list',
          caption:'change category', disabled:!areThereOtherCats,
          width:'wide', iconType:'move', callProc:setupMove } } />
        <IconButton config={ { title:'copy list', caption:'copy this list',
          width:'wide', iconType:'copy', callProc:setupCopy } } />
        <IconButton config={ { title:'delete list', caption:'delete this list',
          width:'wide', iconType:'delete', callProc:removeList } } />
        <IconButton config={ { title:'close submenu of list changes', caption:'close submenu',
          width:'wide', iconType:'close', callProc:cancelMore } } />
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
    return (
      <Fragment>
        { headingArea() }
        { showMore && moreIconsZone() }
        { showAdd && <AddItemForm cancelAdd={cancelAdd} listID={listID} /> }
        { showCopy && <CopyList cancelCopy={cancelCopy} listRec={oneListRec} /> }
        { showMove && <MoveList cancelMove={cancelMove} listRec={oneListRec} /> }
        { showEdit && <EditList cancelEdit={cancelEdit} listRec={oneListRec} /> }
        { showItems && <ItemsGroup listID={listID} /> }
      </Fragment>
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
          { mainDisplayOrMoveOrEditForm() }
        </div>
      </Fragment>
      }
    </Fragment>
  );

};

export default OneList;
