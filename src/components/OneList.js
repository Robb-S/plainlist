import React, {Fragment} from 'react';
import { Link, useLocation, Redirect } from 'react-router-dom';
import '../css/lists.css';
import { useStore } from '../store/StoreContext';
import { getListRec, getParentCatName, getParentCatID } from '../store/getData';
import Loading from './Loading';
import AddItem from './AddItem';
import ItemsList from './ItemsList';

const OneList = () => {
  const data = useLocation(); // to retrieve params from data.state
  // data.state will only exist when set up in LINK, not if URL was entered manually
  const needsRedirect = data.state ? false : true; // is it called from link or manual URL
  const listID = needsRedirect ? null : data.state.listID; 
  const {state} = useStore();  // this must come before conditional render

  if (needsRedirect) {return (<Redirect to="/" />);}  // back to main page if no ID
  const isLoaded = !state.loading;
  // const nickname = state.user.nickname;
  const oneListRec = getListRec(listID, state);
  const parentCatName = getParentCatName(listID, state);
  const parentCatID = getParentCatID(listID, state);

  return (
    <Fragment>
      {!isLoaded && <Loading />}

      {isLoaded && 
      <Fragment>
      <div className='mainContainer'>
        <div className='heading'>
          <div className="headingName">
            List: {oneListRec.listName}
          </div>
          <Link className='linky2'
            to={{
              pathname: `/cat/`,
              state: { catID: parentCatID }
            }}
          >Up to: "{parentCatName}" category)</Link>
          <button className="btn default-btn">Edit/delete list</button>
        </div>

        <AddItem/>
        <ItemsList />
      </div>
      </Fragment>
    }
    </Fragment>
  )
}

export default OneList;
