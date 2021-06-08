/**
 * Display the lists in one category.  In order to hide the category ID from the URL,
 * the ID is passed in via data from a LINK statement.  If the URL was entered manually, 
 * this won't happen, so we need to redirect to the main page.
 */
import React, {Fragment, useState} from 'react';
import { Link, useLocation, Redirect } from 'react-router-dom';
import {useStore} from '../store/StoreContext';
import {getListsByCatID, getCatRec} from '../store/getData';
import Login from './Login';
import Loading from './Loading';
import EditCat from './EditCat';
import AddList from './AddList';
import { FiTrash2, FiEdit, FiSettings } from 'react-icons/fi';
import { handleRemoveCategory  } from '../store/handlers';
import '../css/lists.css';

const OneCat = () => {
  const data = useLocation(); // to retrieve params from data.state
  // data.state will only exist when set up in LINK, not if URL was entered manually
  let needsRedirect = data.state ? false : true; // is it called from link or manual URL
  const catID = needsRedirect ? null : data.state.catID; 
  const { state, dispatch } = useStore();  // this must come before conditional render
  const [editMode, setEditMode] = useState(false);  // set edit mode when button is pressed.
  const oneCatRec = getCatRec(catID, state);
  if (oneCatRec===null) {needsRedirect=true;} // this will happen after record deletion
  if (needsRedirect) {return (<Redirect to="/" />);}  // back to main page if no ID
  const showLogin = state.loading && !state.loggedIn;
  const showLoading = state.loading && state.loggedIn;
  const showMain = !state.loading;
  const oneCatLists = getListsByCatID(catID, state);
  
  const setupEdit = () => { setEditMode(true); }
  const cancelEdit = () => { setEditMode(false); }
  const removeCategory = async () => {
    handleRemoveCategory(catID, state, dispatch);
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
            <span className='oneCrumb'>
              {oneCatRec.categoryName}  
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

  const tableHead = () => {
    if (oneCatLists.length<1) { 
      return (
        <thead>
          <tr>
            <th colSpan="2">No lists yet</th>
          </tr>
        </thead>
      )
    }
    return(
      <thead>
        <tr>
          <th>List</th>
          <th># of items</th>
        </tr>
      </thead>
    )
  }

  const tableBody = () => {
    return (
      <tbody>
      { oneCatLists.map((list) => (
        <tr key={list.id}>
          <td>
            <Link className='linky3'
              title={list.listName}
              to={{
                pathname: `/list/`,
                state: { listID: list.id }
              }}
            >
              {list.listName}
            </Link>
          </td>
          <td>
            {list.childCount} item(s)
          </td>
        </tr>
      ))}
    </tbody>
    )
  }

  /**
   * The header area includes an edit button, and when this is pressed the edit form
   * (to change the category name) will be shown, and the main category will disappear 
   * until the name is updated or cancelled.  While category-name updates are handled by
   * the EditCat component, deletions are handled here.
   */
  const mainDisplayOrEditForm = () => {
    if (editMode) {
      const editCatProps = { cancelEdit: cancelEdit, categoryRec: oneCatRec };
      return (<EditCat props={editCatProps} />)
    }
    return (
      <Fragment>
        <div className='heading'>
          <div className='headingNameDiv'>
            <span className='headingName'>
              Category: {oneCatRec.categoryName}          
            </span>
            <span className="spacer"> </span>
            <span className='iconEdit'>
            <FiEdit onClick={() => setupEdit()}
              title='edit category' className='iconBorder' size='24' color='#555555' />
            </span>
            <span className="spacer"> </span>
            <span className='iconDelete'>
            <FiTrash2 onClick={() => removeCategory()}
              title='delete category' className='iconBorder' size='24' color='#555555' />
            </span>
          </div>  
        </div>
        <AddList />
        <table>
          {tableHead()}
          {tableBody()}
        </table>
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

export default OneCat;
