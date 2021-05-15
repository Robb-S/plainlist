import React, {Fragment} from 'react';
import { Link } from 'react-router-dom';
import '../css/lists.css';
import {useStore} from '../store/StoreContext';
import {getAllCats} from '../store/getData';
import Loading from './Loading';
import Login from './Login';

const AllCats = () => {
  const { state } =  useStore();
  const allCats = getAllCats(state);
  const showLogin = state.loading && !state.loggedIn;
  const showLoading = state.loading && state.loggedIn;
  const showMain = !state.loading;

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
        
          <button
            className="btn default-btn"
          >
            Add new category 
          </button>
   
          </div>
  
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              { allCats.map((cat) => (
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
                        {cat.childCount}
                      </td>
                      <td>
                      <button
                        className="btn default-btn"
                      >
                        Up
                      </button>
                      <button
                        className="btn default-btn"
                      >
                        Down
                      </button>
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

/*
        <Fragment>
          <div className='logoBar' >Would You Rather?</div>
          { loggedOut===true
          ? null
          : <Navbar />
          }
          <Loading />
        </Fragment>
 * 
 */
