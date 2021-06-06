import React, {Fragment, useState} from 'react';
import { Link } from 'react-router-dom';
import {useStore} from '../store/StoreContext';
import {getAllCats} from '../store/getData';
import Loading from './Loading';
import Login from './Login';
import AddCat from './AddCat';
import { FiSettings } from 'react-icons/fi';
import '../css/lists.css';

const AllCats = () => {
  const { state } =  useStore();
  const [editMode, setEditMode] = useState(false);  // set edit mode when edit button is pressed.
  const allCats = getAllCats(state);
  let showLogin = state.loading && !state.loggedIn;
  let showLoading = state.loading && state.loggedIn;
  let showMain = !state.loading;

  const setupEdit = () => {
    setEditMode(true);
  }
  const cancelEdit = () => {
    setEditMode(false);
  }
  /**
   * Show the "add category" button initially, but hide it once it's pressed, return
   * to view when edit is finished or cancelled. 
   */
  const displayAddButton = () => {
    if (editMode) {return null};
    return (
      <button className="btn default-btn" onClick={() => setupEdit()}> 
        Add new category
      </button>
    )
  }
  const addCatProps = { editMode: editMode, cancelEdit: cancelEdit};

  const crumbArea = () => {
    return (
      <Fragment>
        <div className='crumbsandsettings'>
          <div className='breadcrumbs'>
          <span className='oneCrumb'>
              All categories 
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

  return (
    <Fragment>
      {showLoading && <Loading />}
      {showLogin && <Login />}

      {showMain && 
      <Fragment>
      <div className='mainContainer'>
        { crumbArea() }
        <div className='heading'>
          <div className='headingName'>
            All categories          
          </div>
          {displayAddButton()}
        </div>
        <AddCat props={addCatProps} />  
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th># of Lists</th>
            </tr>
          </thead>
          <tbody>
            {allCats.map((cat) => (
              <tr key={cat.id}>
                <td>
                <Link className='linky3'
                  to={{
                    pathname: `/cat/`,
                    state: { catID: cat.id }
                  }}
                >
                  {cat.categoryName}
                </Link>
                </td>
                <td>
                  {cat.childCount} list(s)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </Fragment>
      }
    </Fragment>
    )
  }

export default AllCats;
