import React, {Fragment} from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../css/lists.css';
import {useStore} from '../store/StoreContext';
import {getListsByCatID, getCatRec} from '../store/getData';
import Loading from './Loading';

const OneCat = () => {
  const id = useLocation().state.catID;
  const { state } = useStore();
  // const { state, dispatch } = useStore();
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
