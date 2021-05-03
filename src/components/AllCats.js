import React, {Fragment} from 'react';
import { Link } from 'react-router-dom';
import '../css/lists.css';
import {useStore} from '../store/StoreContext';
import {getAllCats} from '../store/getData';
import Loading from './Loading';

const AllCats = () => {
  const { state } =  useStore();
  const isLoaded = !state.loading;
  const allCats = getAllCats(state);

  return (
    <Fragment>
      {!isLoaded && <Loading />}

      {isLoaded && 
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
                        to={`/cat/${cat.id}`}
                        title={cat.categoryName}
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
