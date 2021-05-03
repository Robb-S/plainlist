import React, {Fragment} from 'react';
import { useParams } from 'react-router-dom';
import '../css/lists.css';
import {useStore} from '../store/StoreContext';
import {getItemsByListID, getListRec, getParentCatName, getParentCatID} from '../store/getData';
import Loading from './Loading';

const OneList = () => {
  const { id } = useParams();
  // const store = useStore();
  const state = useStore().state;
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
      <div className="main-container">
        <div className='heading'>
          List: {oneListRec.listName}
          <br />
          <button
            className="btn default-btn"
          >
            Up to {parentCatName} category (ID {parentCatID})
          </button>
          <br />
          <button
            className="btn default-btn"
          >
            Edit list details 
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
