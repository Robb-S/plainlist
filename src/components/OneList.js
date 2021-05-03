import React, {Fragment} from 'react';
import { useParams, Link } from 'react-router-dom';
import '../css/lists.css';
import {useStore} from '../store/StoreContext';
import {getItemsByListID, getListRec, getParentCatName, getParentCatID} from '../store/getData';
import Loading from './Loading';

const OneList = () => {
  const { id } = useParams();
  const { state } = useStore();
  // const {state, dispatch} = useStore();
  const isLoaded = !state.loading;
  // const nickname = state.user.nickname;
  const oneListItems = getItemsByListID(id, state);
  const oneListRec = getListRec(id, state);
  const parentCatName = getParentCatName(id, state);
  const parentCatID = getParentCatID(id, state);

  return (
    <Fragment>
      {!isLoaded && <Loading />}

      {isLoaded && 
      <Fragment>
      <div className="mainContainer">
        <div className='heading'>
          <div className="headingName">
            List: {oneListRec.listName}
          </div>
          <Link className='linky2'
            to={`/cat/${parentCatID}`}
            title="See category"
          >
            Up to: "{parentCatName}" category)
          </Link>
          <button
            className="btn default-btn"
          >
            Edit list details 
          </button>
          <button
            className="btn default-btn"
          >
            Add item 
          </button>

        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            { oneListItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.itemName}</td>
                    <td>
                    <button
                      className="btn default-btn"
                    >
                      Delete
                    </button>
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
                      Edit/more
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

export default OneList;
