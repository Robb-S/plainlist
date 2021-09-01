/**
 * Form for entry of one item.  The form needs a hidden submit button so that 
 * the ENTER button can be used to submit the form's multiple input fields.  (It wouldn't 
 * be necessary for only one input field.)
 * Cancel button calls cancel proc in parent component, to juggle display.
 */
import React, { Fragment, useState, useEffect } from 'react';
import '../css/oneItem.css';
import { useStore } from '../store/StoreContext';
import { validateLength, isValidLength } from '../util/helpers'; // hook to capture escape key
import { handleAddItem } from '../store/handlers';
import { IconButton } from './IconButton';
import TextField from '@material-ui/core/TextField';

const AddItemForm = ({ cancelAdd, listID }) => {
  const { state, dispatch } = useStore();
  const [itemName, setItemName] = useState('');
  const [itemNote, setItemNote] = useState('');

  const onSubmitAdd = (e) => { // allow pressing ENTER to submit
    e.preventDefault();
    onRequestAdd();
  };

  const onRequestAdd = () => {
    if (!validateLength(itemName, 1, 60, 'item name')) return;
    if (!validateLength(itemNote, 0, 60, 'note')) return;
    const newItem = { itemName: itemName, itemNote: itemNote, listID: listID };
    handleAddItem(newItem, state, dispatch);
  };

  const cancelAddLocal = () => {
    setItemName('');
    setItemNote('');
    cancelAdd();
  };

  return (
    <Fragment>
      <div className='addNewShell'>
        <div className='addThisLabel'>Add new item:</div>
        <div className='editItemDiv'>
          <form className='editItemForm' onSubmit={onSubmitAdd}>
            <span className='editItemInputArea'>
              <TextField
                required
                label="Item name:" value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                variant='outlined'
                margin='dense'
                autoFocus={true}
                inputProps={{ autoCapitalize: 'off' }}
              />
              <TextField
                label="Note:" value={itemNote}
                onChange={(e) => setItemNote(e.target.value)}
                variant='outlined'
                margin='dense'
                inputProps={{ autoCapitalize: 'off' }}
              />
            </span>
            <input type="submit" className="hidden" />
          </form>
          <span className='editButtonArea'>
            <IconButton config={ { title:'add item',
              disabled: !(isValidLength(itemName, 1, 60) && isValidLength(itemNote, 0, 60)),
              iconType:'confirm', callProc:onRequestAdd }} />
            <IconButton config={ { title:'cancel item',
              iconType:'cancel', callProc:cancelAddLocal }} />
          </span>
        </div>
      </div>
    </Fragment>
  );
};

export default AddItemForm;
