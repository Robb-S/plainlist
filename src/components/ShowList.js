import React from 'react';
import '../css/ShowList.css';
import {useStore} from '../store/StoreContext';

const ShowList = () => {
  const store = useStore();
  const state = store.state;
  const nickname = state.user.nickname;
  // const catnum = state.categories.length;
  const catnum = '*** NOT YET ***';
  // console.log('nickname: ' + nickname);
  console.log(state);

  // const dispatch = store.dispatch;

  return (
    <div className="main-show">
      This is the ShowList component.  Hello {nickname}.
      categories: {catnum}
    </div>
  )
}

export default ShowList;
