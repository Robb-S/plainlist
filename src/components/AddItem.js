/**
 * Form for entry of one item.  The form needs a hidden submit button so that 
 * the ENTER button can be used to submit the form's multiple input fields.  (It wouldn't 
 * be necessary for only one input field.)
 */
import React, { Fragment, useState } from 'react';
import '../css/oneItem.css';
import { useStore } from '../store/StoreContext';
import { useEscape } from '../util/helpers'; // hook to capture escape key
import { handleAddItem } from '../store/handlers';
import { IconButton } from './IconButton';
import TextField from '@material-ui/core/TextField';

const AddItem = ({ listID }) => {
  const { state, dispatch } = useStore();
  const [addMode, setAddMode] = useState(!state.isMobile); // if mobile, show only button
  const [itemName, setItemName] = useState('');
  const [itemNote, setItemNote] = useState('');

  const onSubmitAdd = (e) => { // allow pressing ENTER to submit
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
    setAddMode(false);
  };

  const setupAdd = () => {
    setAddMode(true);
  };

  useEscape(() => cancelAdd());
  return (
    <Fragment>
    {addMode &&
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
                iconType:'confirm', callProc:onRequestAdd }} />
              <IconButton config={ { title:'cancel item',
                iconType:'cancel', callProc:cancelAdd }} />
            </span>
          </div>
        </div>
      </Fragment>
    }
    {!addMode &&
      <Fragment>
        <div className='addItemIconContainer'>
          <div className='addItemIcon'>
            <IconButton config={ { title:'add a new item', caption:'add item',
              iconType:'add', callProc:setupAdd } } />
          </div>
        </div>
      </Fragment>
    }
    </Fragment>
  );
};

export default AddItem;
