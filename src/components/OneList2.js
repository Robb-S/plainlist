import React, {Fragment} from 'react';
import { Link, useLocation, Redirect } from 'react-router-dom';
import '../css/lists.css';
import {useStore} from '../store/StoreContext';
import {getItemsByListID, getListRec, getParentCatName, getParentCatID, getItemRec} 
  from '../store/getData';
import {handleRemoveItem} from '../store/handlers';
import Loading from './Loading';
import AddItem from './AddItem';

const OneList2 = () => {
  const data = useLocation(); // to retrieve params from data.state
  // data.state will only exist when set up in LINK, not if URL was entered manually
  const needsRedirect = data.state ? false : true; // is it called from link or manual URL
  const id = needsRedirect ? null : data.state.listID; 
  const {state, dispatch} = useStore();  // this must come before conditional render
  if (needsRedirect) {return (<Redirect to="/" />);}  // back to main page if no ID
  const isLoaded = !state.loading;
  // const nickname = state.user.nickname;
  const oneListItems = getItemsByListID(id, state);
  const oneListRec = getListRec(id, state);
  const parentCatName = getParentCatName(id, state);
  const parentCatID = getParentCatID(id, state);

  const removeItem = (itemID) => {
    // console.log ('** removeItem: ' + itemID);
    // TODO: make confirmation dialog
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
      <div className='mainContainer'>
        <div className='heading'>
          <div className="headingName">
            List2: {oneListRec.listName}
          </div>
          <Link className='linky2'
            to={{
              pathname: `/cat/`,
              state: { catID: `${parentCatID}`}
            }}
          >Up to: "{parentCatName}" category)</Link>
          <button className="btn default-btn">Edit/delete list</button>
        </div>

        <AddItem/>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
              <th> </th>
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
                    <td>{item.itemNote}</td>
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

export default OneList2;
