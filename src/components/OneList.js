import React, {Fragment, useState} from 'react';
import { Link, useLocation, Redirect } from 'react-router-dom';
import '../css/lists.css';
import { useStore } from '../store/StoreContext';
import { getListRec, getParentCatName, getParentCatID } from '../store/getData';
import { handleRemoveList } from '../store/handlers';
import Loading from './Loading';
import AddItem from './AddItem';
import ItemsList from './ItemsList';
import EditList from './EditList';
import Login from './Login';
import { FiTrash2, FiEdit, FiSettings } from 'react-icons/fi';

const OneList = () => {
  const data = useLocation(); // to retrieve params from data.state
  // data.state will only exist when set up in LINK, not if URL was entered manually
  let needsRedirect = data.state ? false : true; // is it called from link or manual URL
  const listID = needsRedirect ? null : data.state.listID; 
  const { state, dispatch } = useStore();    // this must come before conditional render
  const [editMode, setEditMode] = useState(false);  // set edit mode when button is pressed.
  const oneListRec = getListRec(listID, state);
  if (oneListRec===null) {needsRedirect=true;} // this will happen after record deletion
  if (needsRedirect) {return (<Redirect to="/" />);}  // back to main page if no ID
  const showLogin = state.loading && !state.loggedIn;
  const showLoading = state.loading && state.loggedIn;
  const showMain = !state.loading;
  const parentCatName = getParentCatName(listID, state);
  const parentCatID = getParentCatID(listID, state);

  const cancelEdit = () => { setEditMode(false); }
  const setupEdit = () => { setEditMode(true); }

  const removeList = async () => {
    handleRemoveList(listID, state, dispatch);
  }

  const crumbArea = () => {
    return (
      <Fragment>
        <div className='crumbsandsettings'>
          <div className='breadcrumbs'>
            <Link className='linky3 oneCrumb' to={`/`}>
              All categories 
            </Link>
            <span className='oneCrumb'>:</span>
            <Link className='linky3 oneCrumb' 
              to={{
                pathname: `/cat/`,
                state: { catID: parentCatID }
              }}
            >{parentCatName} category</Link>
            <span className='oneCrumb'>:</span>
            <span className='oneCrumb'>
              {oneListRec.listName} list
            </span>
          </div>
          <div className='settingsicon'>
            <Link className='linky3 oneCrumb' to={`/set/`}>
              <FiSettings 
                title='settings' className='iconBorder' size='24' color='#555555' />
            </Link>
          </div>
        </div>
      </Fragment>
    )
  }

  const mainDisplayOrEditForm = () => {
    const editListProps = { cancelEdit: cancelEdit, listRec: oneListRec };
    if (editMode) return (<EditList props={editListProps} />)
    return (
      <Fragment>
        <div className='heading'>
          <div className='headingNameDiv'>
            <span className='headingName'>
              {oneListRec.listName}
            </span>
            <span className="spacer"> </span>
            <span className='iconEdit XiconBorder'>
              <FiEdit onClick={() => setupEdit()}
              title='edit list' className='iconBorder' size='24' color='#555555' />
            </span>
            <span className="spacer"> </span>
            <span className='iconDelete XiconBorder'>
            <FiTrash2 onClick={() => removeList()}
              title='delete list' className='iconBorder' size='24' color='#555555' />
            </span>
          </div>
        </div>
        <AddItem />
        <ItemsList />
      </Fragment>
    );
  }

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
  )
}

export default OneList;
