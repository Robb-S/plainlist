import React, {Fragment} from 'react';
import { Link, useLocation, Redirect } from 'react-router-dom';
import '../css/lists.css';
import {useStore} from '../store/StoreContext';
import {getListsByCatID, getCatRec} from '../store/getData';
import Loading from './Loading';

/**
 * Display the lists in one category.  In order to hide the category ID from the URL,
 * the ID is passed in via data from a LINK statement.  If the URL was entered manually, 
 * this won't happen, so we need to redirect to the main page.
 */
const OneCat = () => {
  const data = useLocation(); // to retrieve params from data.state
  // data.state will only exist when set up in LINK, not if URL was entered manually
  const needsRedirect = data.state ? false : true; // is it called from link or manual URL
  const id = needsRedirect ? null : data.state.catID; 
  const { state } = useStore();  // this must come before conditional render
  // const { state, dispatch } = useStore(); // this must come before conditional render
  if (needsRedirect) {return (<Redirect to="/" />);}  // back to main page if no ID
  const isLoaded = !state.loading;
  const oneCatLists = getListsByCatID(id, state);
  const oneCatRec = getCatRec(id, state);

  return (
    <Fragment>
      {!isLoaded && <Loading />}

      {isLoaded && 
      <Fragment>
      <div className='mainContainer'>
        <div className='heading'>
          <div className='headingName'>
            Category: {oneCatRec.categoryName}          
          </div>
          <Link className='linky'
            to={`/`}
          >
            See all categories
          </Link>
      
          <button
            className="btn default-btn"
          >
            Edit/delete category
          </button>
          
          <button
            className="btn default-btn"
          >
            Add new list 
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Lists</th>
              <th>Alt links</th>
              <th>Size</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            { oneCatLists.map((list) => (
              <tr key={list.id}>
                <td>
                  <Link className='linky2'
                    title={list.listName}
                    to={{
                      pathname: `/list/`,
                      state: { listID: `${list.id}`}
                    }}
                  >
                    {list.listName}
                  </Link>
                </td>
                <td>
                  <Link className='linky2'
                    to={{
                      pathname: `/list2/`,
                      state: { listID: `${list.id}`}
                    }}
                  >
                    Alt
                  </Link>
                </td>
                <td>
                      {list.childCount}
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

export default OneCat;
