import React, {Fragment} from 'react';
import '../css/lists.css';
import {useStore} from '../store/StoreContext';
import Loading from './Loading';

const OneCat = () => {
  
  const store = useStore();
  const state = store.state;
  const isLoaded = !store.state.loading;
  const nickname = state.user.nickname;
  const catnum = state.categories.length;
  const listnum = state.lists.length;
  const itemnum = state.items.length;
  const oneCatLists = [];
  // console.log(state);

  // const dispatch = store.dispatch;

  return (
    <Fragment>
      {!isLoaded && <Loading />}

      {isLoaded && 
      <div className="main-show">
        This is the OneCat component.  Hello {nickname}.
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
          {oneCatLists.map(({ id, listName }) => {
              <tr key={id}>
                <td>{listName}</td>
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

export default OneCat;
