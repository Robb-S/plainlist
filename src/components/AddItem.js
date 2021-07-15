/**
 * Form for entry of one item.  The form needs a hidden submit button so that 
 * the ENTER button can be used to submit the form's multiple input fields.
 */
import React, { Fragment, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/oneItem.css';
import { useStore } from '../store/StoreContext';
import { handleAddItem } from '../store/handlers';
import { FiCheckSquare } from 'react-icons/fi';
import { TiCancelOutline } from 'react-icons/ti';
import TextField from '@material-ui/core/TextField';

const AddItem = () => {
  const listID = useLocation().state.listID; // or should this be passed by parameter? 
  const { state, dispatch } = useStore();
  const isLoaded = !state.loading;  // maybe not needed, if handled by parent component

  const [itemName, setItemName] = useState('');
  const [itemNote, setItemNote] = useState('');

  const onSubmitAdd = (e) => {
    // console.log('*** onSubmitAdd item called ***');
    e.preventDefault();
    onRequestAdd();
  };

  const onRequestAdd = () => {
    if (itemName.length===0) {return;}
    const newItem = { itemName: itemName, itemNote: itemNote, listID: listID };
    handleAddItem(newItem, state, dispatch);
  };

  const cancelAdd = () => {
    setItemName('');
    setItemNote('');
  };

  return (
    <Fragment>
      {isLoaded &&
      <Fragment>
        <div className='addNewShell'>
          <div className='addThisLabel'>Add new item:</div>
          <div className='editItemDiv'>
            <form className='editItemForm' onSubmit={onSubmitAdd}>
              <span className='editItemInputArea'>
                <TextField
                  label="Item name:" value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  variant='outlined'
                  margin='dense'
                />
                <TextField
                  label="Note:" value={itemNote}
                  onChange={(e) => setItemNote(e.target.value)}
                  variant='outlined'
                  margin='dense'
                />
              </span>
              <input type="submit" className="hidden" />
            </form>
            <span className='editButtonArea'>
              <span className='iconCheckmark iconNoBorder'>
                <FiCheckSquare onClick={() => onRequestAdd()}
                  title='add item' size='24' color='#555555' />
              </span>
              <span className='iconEdit iconNoBorder'>
                <TiCancelOutline onClick={() => cancelAdd()}
                  title='cancel item' className='iconBorder' size='24' color='#555555' />
              </span>
            </span>
          </div>
        </div>
      </Fragment>
    }
    </Fragment>
  );
};

export default AddItem;
