import React, {Fragment} from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/lists.css';
import {useStore} from '../store/StoreContext';
import {getItemsByListID, getListRec, getParentCatName, getParentCatID, getItemRec} 
  from '../store/getData';
import {handleRemoveItem} from '../store/handlers';
import Loading from './Loading';

const OneList = () => {  
  const id = useLocation().state.listID; // TODO redirect when this doesn't exist
  const {state, dispatch} = useStore();
  const isLoaded = !state.loading;
  // const nickname = state.user.nickname;
  const oneListItems = getItemsByListID(id, state);
  const oneListRec = getListRec(id, state);
  const parentCatName = getParentCatName(id, state);
  const parentCatID = getParentCatID(id, state);

  const removeItem = (itemID) => {
    // console.log ('** removeItem: ' + itemID);
    // make confirmation dialog
    if (!getItemRec(itemID, state)) { // check that it still exists in state
      alert("Sorry, that item can't be found.");
      return;
    }
    handleRemoveItem(itemID, dispatch);
  }

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
            to={{
              pathname: `/cat/`,
              state: { catID: `${parentCatID}`}
            }}
          >
            Up to: "{parentCatName}" category)
          </Link>
          <button
            className="btn default-btn"
          >
            Edit/delete list 
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
                      onClick={() => removeItem(item.id)}
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
