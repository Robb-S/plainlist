/**
 * Show edit form for changing name of a category.  
 * Handle the update, or toggle the edit mode if 
 * cancel button is pressed.  Called by OneCat.
 * Params: cancelEdit function (toggles state in parent component)
 * categoryRec: existing category record w/ category name and id
 */

import React, { Fragment, useState } from 'react';
import '../css/lists.css';
import * as api from '../util/constants';
import { useStore } from '../store/StoreContext';
import { useEscape, validateLength, isValidLength } from '../util/helpers'; // hook to capture escape key
import { handleUpdateCategory } from '../store/handlers';
import { IconButton } from './IconButton';
import TextField from '@material-ui/core/TextField';

const EditCat = ({ props }) => {
  const { cancelEdit, categoryRec } = props;
  const { state, dispatch } = useStore();
  const [categoryName, setCategoryName] = useState(categoryRec.categoryName);
  useEscape(() => cancelEdit());
  const catNameChangeDisabled = ((categoryName.trim()===categoryRec.categoryName) ||
    !isValidLength(categoryName, 1, 60));

  const onSubmitEdit = (e) => {
    e.preventDefault();
    onRequestEdit();
  };

  const onRequestEdit = async () => {
    // if (categoryName.length===0) {return;}
    if (!validateLength(categoryName, 1, 60, 'category name')) return;
    const status = await handleUpdateCategory(categoryRec.id, categoryName, state, dispatch);
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
                label="Edit category name:" value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                variant='outlined'
                margin='dense'
                autoFocus={true}
                inputProps={{ autoCapitalize: 'off' }}
              />
            </span>
          </form>
          <span className='editButtonArea'>
            <IconButton config={ { title:'accept category edit', caption:'rename category',
              disabled:catNameChangeDisabled, width:'wide',
              iconType:'confirm', callProc:onRequestEdit }} />
            <IconButton config={ { title:'cancel category edit', caption:'cancel rename',
              width:'wide', iconType:'cancel', callProc:cancelEdit }} />
          </span>
        </div>
      </Fragment>
  );
};

export default EditCat;
