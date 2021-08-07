/**
 * Show one-line input form for adding name of new category.  
 * Called by AddCats.  addMode (state in AddCats) and cancelAdd (function
 * to change state in AddCats) are passed in as props.  
 */
import React, { Fragment, useState } from 'react';
import { useStore } from '../store/StoreContext';
import { useEscape, validateLength } from '../util/helpers'; // hook to capture escape key
import { handleAddCategory } from '../store/handlers';
import { IconButton } from './IconButton';
import TextField from '@material-ui/core/TextField';
import * as api from '../util/constants';
import '../css/lists.css';

const AddCat = ({ props }) => {
  const { addMode, cancelAdd }  = props;
  const { state, dispatch } = useStore();
  const [ categoryName, setCategoryName ] = useState('');
  /**
   * Form submit handler allows user to press RETURN as well as button to submit
   */
  const onSubmitAdd = (e) => {
    e.preventDefault();
    onRequestAdd();
  };
  const onRequestAdd = async () => {
    if (!validateLength(categoryName, 1, 60, 'category name')) return;
    const newCategory = { categoryName: categoryName };
    const status = await handleAddCategory(newCategory, state, dispatch);
    // if (status===api.OK) { cancelAdd(); }
    if (status!==api.OK) {  }
    // TODO: maybe add additional message if API operation failed?
  };
  const cancelAddLocal = () => {
    setCategoryName('');     // clear the input field for next time
    cancelAdd();
  };

  useEscape(() => cancelAddLocal());
  return (
    <Fragment>
      {addMode &&
      <Fragment>
        <div className='addArea'>
          <form className='addCategoryForm' onSubmit={onSubmitAdd}>
            <span className='addAreaInput'>
              <TextField
                required
                label="New category name" value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                variant='outlined'
                margin='dense'
                autoFocus={true}
                inputProps={{ autoCapitalize: 'off' }}
              />
            </span>
            
          </form>
          <span className='editButtonArea'>
            <IconButton config={ { title:'accept add',
              iconType:'confirm', callProc:onRequestAdd }} />
            <IconButton config={ { title:'cancel add',
              iconType:'cancel', callProc:cancelAddLocal }} />
          </span>
        </div>
      </Fragment>
      }
    </Fragment>
  );
};

export default AddCat;
