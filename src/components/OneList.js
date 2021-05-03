import React, {Fragment} from 'react';
import { useParams } from 'react-router-dom';
import '../css/lists.css';
import {useStore} from '../store/StoreContext';
import {getItemsByListID} from '../store/getData';
import Loading from './Loading';

const OneList = () => {
  let { id } = useParams();
  const store = useStore();
  const state = store.state;
  const isLoaded = !store.state.loading;
  const nickname = state.user.nickname;
  const catnum = state.categories.length;
  const listnum = state.lists.length;
  const itemnum = state.items.length;
  const oneListItems = [];
  // const oneListItems = getItemsByListID(id,state.items);
  // console.log(state);

  // const dispatch = store.dispatch;

  return (
    <Fragment>
      {!isLoaded && <Loading />}

      {isLoaded && 
      <div className="main-show">
        This is the OneList component for list {id}.  Hello {nickname}.
        <br />
        categories: {catnum}
        <br />
        lists: {listnum}
        <br />
        items: {itemnum}      
      </div>
      }

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {oneListItems.map(({ id, itemName }) => {
              <tr key={id}>
                <td>{itemName}</td>
                <td>
                  <button
                    className="btn default-btn"
                  >
                    Go to list
                  </button>
                </td>
              </tr>
          })}
        </tbody>
      </table>

      
    </Fragment>
  )
}

export default OneList;
