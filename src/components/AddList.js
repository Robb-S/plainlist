import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../css/lists.css';
import * as api from '../util/constants';
import { useStore } from '../store/StoreContext';
import { useEscape, validateLength, isValidLength } from '../util/helpers'; // hook to capture escape key
import { handleAddList } from '../store/handlers';
import { IconButton } from './IconButton';
import TextField from '@material-ui/core/TextField';

const AddList = ({ props }) => {
  const { cancelAdd, categoryID } = props;
  const { state, dispatch } = useStore();
  const history = useHistory();
  const [listName, setListName] = useState('');

  const onSubmitAdd = (e) => {
    e.preventDefault();
    onRequestAdd();
  };
  const onRequestAdd = async () => {
    if (!validateLength(listName, 1, 60, 'list name')) return;
    const newList = { listName: listName, categoryID: categoryID };
    const { status, listID } = await handleAddList(newList, state, dispatch);
    if (status!==api.OK) {  }
    // TODO: maybe add additional message if API operation failed?
    cancelAdd();
    if (listID!=null) history.push('/list/', { listID:listID });
  };
  const cancelAddLocal = () => {
    setListName('');
    cancelAdd();
  };

  useEscape(() => cancelAddLocal());
  return (
    <Fragment>
        <div className='addArea'>
          <form className='addCategoryForm' onSubmit={onSubmitAdd}>
            <span className='addAreaInput'>
              <TextField
                required
                label="List name:" value={listName}
                onChange={(e) => setListName(e.target.value)}
                variant='outlined'
                margin='dense'
                autoFocus={true}
                inputProps={{ autoCapitalize: 'off' }}
              />
            </span>
          </form>
          <span className='editButtonArea'>
            <IconButton config={ { title:'accept add',
              disabled: !isValidLength(listName, 1, 60),
              iconType:'confirm', callProc:onRequestAdd }} />
            <IconButton config={ { title:'cancel add',
              iconType:'cancel', callProc:cancelAddLocal }} />
          </span>
        </div>
    </Fragment>
  );
};

export default AddList;
