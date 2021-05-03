import React, {Fragment} from 'react';
import { useParams, Link } from 'react-router-dom';
import '../css/lists.css';
import {useStore} from '../store/StoreContext';
import {getListsByCatID, getCatRec} from '../store/getData';
import Loading from './Loading';

const OneCat = () => {
  const { id } = useParams();
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
            title="See all categories"
          >
            See all categories
          </Link>
      
          <button
            className="btn default-btn"
          >
            Edit category details 
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
                      to={`/list/${list.id}`}
                      title={list.listName}
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
                    <button
                      className="btn default-btn"
                    >
                      Delete
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
