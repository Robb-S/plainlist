/**
 * Show copy form for changing name of a new list.  Handle the copy of the list,
 * update, or toggle the copy mode if the cancel button is pressed.  
 * Escape key also calls cancel.  Called by OneList.
 * Params: cancelCopy function (toggles state in parent component)
 * listRec: list record w/ list name and id
 */

import React, { Fragment, useState } from 'react';
import '../css/lists.css';
import * as api from '../util/constants';
import { useEscape, validateLength, isValidLength } from '../util/helpers'; // hook to capture escape key
import { useStore } from '../store/StoreContext';
import { handleCopyList } from '../store/handlers';
import { IconButton } from './IconButton';
import TextField from '@material-ui/core/TextField';

const CopyList = ({ cancelCopy, listRec }) => {
  const { state, dispatch } = useStore();
  const [listName, setListName] = useState(listRec.listName+' #2');

  const onSubmitCopy = (e) => {
    e.preventDefault();
    onRequestCopy();
  };

  const onRequestCopy = async () => {
    if (!validateLength(listName, 1, 60, 'list name')) return;
    const status = await handleCopyList(listRec.id, listName, state, dispatch);
    if (status===api.OK) { cancelCopy(); } // TODO go to new list if successful
    // TODO: maybe add additional message if API operation failed?
  };

  useEscape(() => cancelCopy());
  return (
      <Fragment>
        <div className='addArea'>
          <form className='addCategoryForm' onSubmit={onSubmitCopy}>
            <span className='addAreaInput'>
              <TextField
                required
                label="Name for copied list" value={listName}
                onChange={(e) => setListName(e.target.value)}
                variant='outlined'
                margin='dense'
                autoFocus={true}
                inputProps={{ autoCapitalize: 'off' }}
              />
            </span>
          </form>
          <span className='editButtonArea'>
            <IconButton config={ { title:'copy list', caption: 'copy current list',
              disabled: !isValidLength(listName, 1, 60), width:'wide',
              iconType:'confirm', callProc:onRequestCopy }} />
            <IconButton config={ { title:'cancel new list', caption: 'cancel list copy',
              width:'wide', iconType:'cancel', callProc:cancelCopy }} />
          </span>
        </div>
      </Fragment>
  );
};

export default CopyList;
