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
 */
import React, { Fragment, useState } from 'react';
import { Link, useLocation, Redirect } from 'react-router-dom';
import '../css/lists.css';
import { useStore } from '../store/StoreContext';
import { getListRec, getParentCatName, getParentCatID, getOtherCats } from '../store/getData';
import { handleRemoveList } from '../store/handlers';
import Login from './Login';
import Loading from './Loading';
import EditList from './EditList';  // form to edit the list name
import MoveList from './MoveList';  // form to move the list to another category
import AddItem from './AddItem';    // form to add an item
import ItemsGroup from './ItemsGroup';  // the actual group (list) of items
// import { FiTrash2, FiEdit } from 'react-icons/fi';
import { VscSettingsGear, VscEdit, VscTrash, VscReferences } from 'react-icons/vsc';

const OneList = () => {
  const data = useLocation(); // to retrieve params from data.state
  // data.state will only exist when set up in LINK, not if URL was entered manually
  let needsRedirect = data.state ? false : true; // is it called from link or manual URL
  const listID = needsRedirect ? null : data.state.listID;
  const { state, dispatch } = useStore();    // this must come before conditional render
  const [editMode, setEditMode] = useState(false);  // set edit mode when button is pressed
  const [moveMode, setMoveMode] = useState(false);  // set move mode when button is pressed
  const oneListRec = getListRec(listID, state);
  if (oneListRec===null) {needsRedirect=true;} // this will happen after record deletion
  if (needsRedirect) {return (<Redirect to="/" />);}  // back to main page if no ID
  const showLogin = state.loading && !state.loggedIn;
  const showLoading = state.loading && state.loggedIn;
  const showMain = !state.loading;
  const parentCatName = getParentCatName(listID, state);
  const parentCatID = getParentCatID(listID, state);
  // see if there are other categories; equivalent to getAllCats.length>1, but maybe safer
  const areThereOtherCats = getOtherCats(parentCatID, state).length>0;

  const setupEdit = () => { setEditMode(true); };
  const cancelEdit = () => { setEditMode(false); };
  const setupMove = () => { setMoveMode(true); };
  const cancelMove = () => { setMoveMode(false); };
  const removeList = async () => {
    handleRemoveList(listID, state, dispatch);
  };

  const crumbArea = () => {
    return (
      <Fragment>
        <div className='crumbsandsettings'>
          <div className='breadcrumbs'>
            <Link className='linky3 oneCrumb' to={`/`}>
              [All categories]
            </Link>
            <span className='oneCrumb'>:</span>
            <Link className='linky3 oneCrumb'
              to={{
                pathname: `/cat/`,
                state: { categoryID: parentCatID },
              }}
            >[{parentCatName}] category</Link>
            <span className='oneCrumb'>:</span>
            <span className='oneCrumb'>
              [{oneListRec.listName}] list
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
   * Show move icon or hide it depending on whether there are other categories 
   * to move to.
   */
  const showOrHideMoveIcon = () => {
    if (!areThereOtherCats) {return null;}
    return (
      <Fragment>
        <span className="spacer"> </span>
        <span className='iconMove'>
        <VscReferences onClick={() => setupMove()}
          title='change category' className='iconBorder' size='24' color='#555555' />
        </span>
      </Fragment>
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
        <div className='heading'>
          <div className='headingNameDiv'>
            <span className='headingName'>
              {oneListRec.listName}
            </span>
            <span className="spacer"> </span>
            <span className='iconEdit'>
              <VscEdit onClick={() => setupEdit()}
              title='edit list' className='iconBorder' size='24' color='#555555' />
            </span>
            { showOrHideMoveIcon() }
            <span className="spacer"> </span>
            <span className='iconDelete'>
            <VscTrash onClick={() => removeList()}
              title='delete list' className='iconBorder' size='24' color='#555555' />
            </span>
          </div>
        </div>
        <AddItem />
        <ItemsGroup />
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
          { mainDisplayOrMoveOrEditForm() }
        </div>
      </Fragment>
      }
    </Fragment>
  );

};

export default OneList;
