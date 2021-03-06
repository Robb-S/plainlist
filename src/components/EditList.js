/**
 * Show edit form for changing name of a list.  Handle the update, or toggle the edit mode if 
 * cancel button is pressed.  Escape key also calls cancel.  Called by OneList.
 * Params: cancelEdit function (toggles state in parent component)
 * listRec: list record w/ list name and id
 */

import React, { Fragment, useState } from 'react';
import '../css/lists.css';
import * as api from '../util/constants';
import { useEscape, validateLength, isValidLength } from '../util/helpers'; // hook to capture escape key
import { useStore } from '../store/StoreContext';
import { handleUpdateList } from '../store/handlers';
import { IconButton } from './IconButton';
import TextField from '@material-ui/core/TextField';

const EditList = ({ cancelEdit, listRec }) => {
  const { state, dispatch } = useStore();
  const [listName, setListName] = useState(listRec.listName);
  useEscape(() => cancelEdit());
  const listNameChangeDisabled = ((listName.trim()===listRec.listName) ||
    !isValidLength(listName, 1, 60));

  const onSubmitEdit = (e) => {
    e.preventDefault();
    onRequestEdit();
  };

  const onRequestEdit = async () => {
    if (!validateLength(listName, 1, 60, 'list name')) return;
    const status = await handleUpdateList(listRec.id, listName, state, dispatch);
    if (status===api.OK) { cancelEdit(); }
    // TODO: maybe add additional message if API operation failed?
  };

  return (
      <Fragment>
        <div className='addArea'>
          <form className='addCategoryForm' onSubmit={onSubmitEdit}>
            <span className='addAreaInput'>
              <TextField
                required
                label="Edit list name:" value={listName}
                onChange={(e) => setListName(e.target.value)}
                variant='outlined'
                margin='dense'
                autoFocus={true}
                inputProps={{ autoCapitalize: 'off' }}
              />
            </span>
          </form>
          <span className='editButtonArea'>
            <IconButton config={ { title:'accept list edit', caption:'rename list',
              disabled:listNameChangeDisabled, width:'wide',
              iconType:'confirm', callProc:onRequestEdit }} />
            <IconButton config={ { title:'cancel list edit', caption:'cancel rename',
              width:'wide', iconType:'cancel', callProc:cancelEdit }} />
          </span>
        </div>
      </Fragment>
  );
};

export default EditList;
