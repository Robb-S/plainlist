import React, {Fragment, useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import {useStore} from '../store/StoreContext';
import {getAllCats} from '../store/getData';
import Loading from './Loading';
import Login from './Login';
import AddCat from './AddCat';
import {handleLogout} from '../store/handlers';
import '../css/lists.css';

const AllCats = () => {
  const { state, dispatch } =  useStore();
  const [editMode, setEditMode] = useState(false);  // set edit mode when edit button is pressed.
  const history = useHistory();
  const allCats = getAllCats(state);
  let showLogin = state.loading && !state.loggedIn;
  let showLoading = state.loading && state.loggedIn;
  let showMain = !state.loading;

  const onLogout = async () => {
    await handleLogout(dispatch);
    history.push('/login/');
  }
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

  return (
    <Fragment>
      {showLoading && <Loading />}
      {showLogin && <Login />}

      {showMain && 
      <Fragment>
      <div className='mainContainer'>
        <div className='heading'>
          <div className='headingName'>
            Categories          
          </div>
          {displayAddButton()}
          <button
            className="btn default-btn"
            onClick={() => onLogout()}
          >
            Log out 
          </button>
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
                <Link className='linky2'
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
