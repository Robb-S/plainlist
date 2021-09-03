/**
 * Show copy form for changing name of a new list.  Handle the copy of the list,
 * update, or toggle the copy mode if the cancel button is pressed.  
 * Escape key also calls cancel.  Called by OneList.
 * Params: cancelCopy function (toggles state in parent component)
 * listRec: list record w/ list name and id
 */

import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../css/lists.css';
import * as api from '../util/constants';
import { showToast, sleepy } from '../util/helpers';
import { useEscape, validateLength, isValidLength } from '../util/helpers'; // hook to capture escape key
import { useStore } from '../store/StoreContext';
import { handleCopyList } from '../store/handlers';
import { IconButton } from './IconButton';
import TextField from '@material-ui/core/TextField';

const CopyList = ({ cancelCopy, listRec }) => {
  const { state, dispatch } = useStore();
  const [listName, setListName] = useState(listRec.listName+' #2');
  const history = useHistory();
  useEscape(() => cancelCopy());

  const onSubmitCopy = (e) => {
    e.preventDefault();
    onRequestCopy();
  };

  const onRequestCopy = async () => {
    if (!validateLength(listName, 1, 60, 'list name')) return;
    // make newList object with same category ID and new listName
    const newList = { listName: listName, categoryID: listRec.categoryID };
    const { status, newListID } = await handleCopyList(listRec.id, newList, state, dispatch);
    console.log('onRequestCopy status: ' + status + ' ' + newListID);
    if (status===api.OK) {
      // await sleepy(2000);
      cancelCopy();
      if (newListID!=null) history.push('/list/', { listID:newListID });
    } else {
      showToast(status, 5000);
    }
  };


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
