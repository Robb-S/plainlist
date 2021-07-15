import React, { Fragment, useState } from 'react';
import '../css/lists.css';
import * as api from '../util/constants';
import { useStore } from '../store/StoreContext';
import { handleAddList } from '../store/handlers';
import { FiCheckSquare } from 'react-icons/fi';
import { TiCancelOutline } from 'react-icons/ti';

const AddList = ({ props }) => {
  const { cancelAdd, categoryID } = props;
  const { state, dispatch } = useStore();
  const [listName, setListName] = useState('');

  const onSubmitAdd = (e) => {
    e.preventDefault();
    onRequestAdd();
  };

  const onRequestAdd = async () => {
    if (listName.length===0) {return;}
    const newList = { listName: listName, categoryID: categoryID };
    const status = await handleAddList(newList, state, dispatch);
    if (status!==api.OK) {  }
    // TODO: maybe add additional message if API operation failed?
  };

  const cancelAddLocal = () => {
    setListName('');
    cancelAdd();
  };

  return (
    <Fragment>
        <div className='addArea'>
          <form className='addCategoryForm' onSubmit={onSubmitAdd}>
            <span className='addAreaInput'>
              <div>List name</div>
              <input
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                type="text"
              />
            </span>
          </form>
          <span className='editButtonArea'>
            <span className='iconCheckmark iconNoBorder'>
              <FiCheckSquare onClick={() => onRequestAdd()}
              title='add list' size='24' color='#555555' />
            </span>
            <span className="sliver5"> </span>
            <span className='iconEdit iconNoBorder'>
              <TiCancelOutline onClick={() => cancelAddLocal()}
              title='cancel new list' className='iconBorder' size='24' color='#555555' />
            </span>
          </span>
        </div>
    </Fragment>
  );
};

export default AddList;
