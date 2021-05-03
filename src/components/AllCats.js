import React, {Fragment} from 'react';
import '../css/AllCats.css';
import {useStore} from '../store/StoreContext';
import Loading from './Loading';

const AllCats = () => {
  const store = useStore();
  const state = store.state;
  const isLoaded = !store.state.loading;
  const nickname = state.user.nickname;
  const catnum = state.categories.length;
  const listnum = state.lists.length;
  const itemnum = state.items.length;
  // console.log(state);

  // const dispatch = store.dispatch;

  return (
    <Fragment>
      {!isLoaded && <Loading />}

      {isLoaded && 
      <div className="main-show">
        This is the AllCats component.  Hello {nickname}.
        <br />
        categories: {catnum}
        <br />
        lists: {listnum}
        <br />
        items: {itemnum}      
      </div>
      }
      
    </Fragment>
  )
}

export default AllCats;
