/**
 * Form for entry of one item.  The form needs a hidden submit button so that 
 * the ENTER button can be used to submit the form's multiple input fields.
 */
import React, {Fragment, useState} from 'react';
import { useLocation } from 'react-router-dom';
import '../css/lists.css';
import {useStore} from '../store/StoreContext';
import {handleAddItem} from '../store/handlers';
import { FiCheckSquare, FiXCircle } from 'react-icons/fi';

const AddItem = () => {  
  const id = useLocation().state.listID; // or should this be passed by parameter? 
  const {state, dispatch} = useStore();
  const isLoaded = !state.loading;  // maybe not needed, if handled by parent component

  const [itemName, setItemName] = useState('');
  const [itemNote, setItemNote] = useState('');

  const onSubmitAdd = (e) => {
    console.log('*** onSubmitAdd item called ***')
    e.preventDefault();
    onRequestAdd()
  };

  const onRequestAdd = () => {
    if (itemName.length===0) {return;}
    const newItem = { itemName: itemName, itemNote: itemNote, listID: id};
    handleAddItem(newItem, state, dispatch);
  };

  const cancelAdd = () => {
    setItemName('')
    setItemNote('')
  }

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
            <span className='editButtonArea'>
              <span className='iconCheckmark iconNoBorder'>
                <FiCheckSquare onClick={() => onRequestAdd()}
                title='add item' size='24' color='#555555' />
              </span>
              <span className='iconEdit iconNoBorder'>
                <FiXCircle onClick={() => cancelAdd()}
                title='cancel item' className='iconBorder' size='24' color='#555555' />
              </span>
            </span>
            <input type="submit" className="hidden" />
          </form>
        </div>      
      </Fragment>
    }
    </Fragment>
  )
}

export default AddItem;
