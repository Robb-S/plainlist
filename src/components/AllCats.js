import React, {Fragment, useState} from 'react';
import { Link } from 'react-router-dom';
import {useStore} from '../store/StoreContext';
import {getAllCats} from '../store/getData';
import Loading from './Loading';
import Login from './Login';
import AddCat from './AddCat';
import { FiSettings } from 'react-icons/fi';
import { FcTodoList } from 'react-icons/fc';
import '../css/lists.css';

const AllCats = () => {
  const { state } =  useStore();
  const [addMode, setAddMode] = useState(false);  // set add mode when add button is pressed.
  const allCats = getAllCats(state);
  let showLogin = state.loading && !state.loggedIn;
  let showLoading = state.loading && state.loggedIn;
  let showMain = !state.loading;

  const setupAdd = () => {
    setAddMode(true);
  }
  const cancelAdd = () => {
    setAddMode(false);
  }
  /**
   * Show the "add category" button initially, but hide it once it's pressed, return
   * to view when edit is finished or cancelled. 
   */
  const displayAddButton = () => {
    if (addMode) {return null};
    return (
      <div className="showAddArea">
        <span className='iconBorder'>
          <FcTodoList onClick={() => setupAdd()}
            title='add new list' className='iconBorder' size='18' color='#555555' />
        </span>
        <span className="spacer"> </span>
        <span className="headerAddLabel">Add new category</span>
      </div>  
    )
  }
  const addCatProps = { addMode: addMode, cancelAdd: cancelAdd};

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
          <div className='headingNameDiv'>
            <span className='headingName'>
              All categories          
            </span>
          </div>
        </div>
        {displayAddButton()}
        <AddCat props={addCatProps} />  
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th># of Lists</th>
            </tr>
          </thead>
          <tbody>
            {allCats.map((category) => (
              <tr key={category.id}>
                <td>
                <Link className='linky3'
                  to={{
                    pathname: `/cat/`,
                    state: { categoryID: category.id }
                  }}
                >
                  {category.categoryName}
                </Link>
                </td>
                <td>
                  {category.childCount} list(s)
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
