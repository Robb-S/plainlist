import React from 'react';
import '../css/ShowList.css';
import {useStore} from '../store/StoreContext';

const ShowList = () => {
  const store = useStore();
  const state = store.state;
  const nickname = state.user.nickname;
  const catnum = state.categories.length;
  const listnum = state.lists.length;
  const itemnum = state.items.length;
  // console.log(state);

  // const dispatch = store.dispatch;

  return (
    <div className="main-show">
      This is the ShowList component.  Hello {nickname}.
      <br />
      categories: {catnum}
      <br />
      lists: {listnum}
      <br />
      items: {itemnum}
      
    </div>
  )
}

export default ShowList;
