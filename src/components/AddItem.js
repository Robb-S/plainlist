import React, {Fragment, useState} from 'react';
import { useLocation } from 'react-router-dom';
import '../css/lists.css';
import {useStore} from '../store/StoreContext';
import {handleAddItem} from '../store/handlers';

const AddItem = () => {  
  const id = useLocation().state.listID; // or should this be passed by parameter? 
  const {state, dispatch} = useStore();
  const isLoaded = !state.loading;  // maybe not needed, if handled by parent component
  const userID = state.user.id;

  const [itemName, setItemName] = useState('');
  const [itemNote, setItemNote] = useState('');

  const onSubmitAdd = (e) => {
    e.preventDefault();
    if (itemName.length===0) {return;}
    const newItem = { itemName: itemName, itemNote: itemNote, listID: id, userID: userID};
    handleAddItem(newItem, state, dispatch);
  };

  return (
    <Fragment>
      {isLoaded && 
      <Fragment>
        <div className='additem'>
          <form onSubmit={onSubmitAdd}>
            <label>New item: </label>
            <input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              type="text"
              placeholder="name of item"
            />
            <label> Note: </label>
            <input
              value={itemNote}
              onChange={(e) => setItemNote(e.target.value)}
              type="text"
              placeholder="note"
            />
            <button>Add item</button>
          </form>
        </div>      
      </Fragment>
    }
    </Fragment>
  )
}

export default AddItem;
