import React, {Fragment} from 'react';
import { useParams } from 'react-router-dom';
import '../css/lists.css';
import {useStore} from '../store/StoreContext';
import {getItemsByListID, getListRec} from '../store/getData';
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
  // const oneListItems = [];
  const oneListItems = getItemsByListID(id,state.items);
  const oneListRec = getListRec(id,state.lists);
  // console.log(oneListItems);

  // const dispatch = store.dispatch;

  return (
    <Fragment>
      {!isLoaded && <Loading />}

      {isLoaded && 
      <div className="main-show">
        This is the OneList component for list {oneListRec.listName}.  Hello {nickname}.
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
          { oneListItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.itemName}</td>
                  <td>
                    <button >
                      Go there
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      
    </Fragment>
  )
}

export default OneList;
