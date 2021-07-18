/**
 * Show edit form for changing name of a list.  
 * Handle the update, or toggle the edit mode if 
 * cancel button is pressed.  Called by OneList.
 * Params: cancelEdit function (toggles state in parent component)
 * listRec: list record w/ list name and id
 */

import React, { Fragment, useState } from 'react';
import '../css/lists.css';
import * as api from '../util/constants';
import { useStore } from '../store/StoreContext';
import { handleUpdateList } from '../store/handlers';
import { IconButton } from './IconButton';

const EditList = ({ props }) => {
  const { cancelEdit, listRec }  = props;
  const { state, dispatch } = useStore();
  const [listName, setListName] = useState(listRec.listName);

  const onSubmitEdit = (e) => {
    e.preventDefault();
    onRequestEdit();
  };

  const onRequestEdit = async () => {
    if (listName.length===0) {return;}
    const status = await handleUpdateList(listRec.id, listName, state, dispatch);
    if (status===api.OK) { cancelEdit(); }
    // TODO: maybe add additional message if API operation failed?
  };

  return (
      <Fragment>
        <div className='addArea'>
          <form className='addCategoryForm' onSubmit={onSubmitEdit}>
            <span className='addAreaInput'>
              <div>Edit list name:</div>
              <input
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                type="text"
              />
            </span>
          </form>
          <span className='editButtonArea'>
            <IconButton config={ { title:'accept list edit',
              iconType:'confirm', callProc:onRequestEdit }} />
            <IconButton config={ { title:'cancel list edit',
              iconType:'cancel', callProc:cancelEdit }} />
          </span>
        </div>
      </Fragment>
  );
};

export default EditList;
