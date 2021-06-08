import React, {Fragment, useState} from 'react';
import { useLocation } from 'react-router-dom';
import '../css/lists.css';
import * as api from '../util/constants';
import {useStore} from '../store/StoreContext';
import {handleAddList} from '../store/handlers';
import { FiCheckSquare, FiXCircle } from 'react-icons/fi';
import { FcTodoList } from 'react-icons/fc';

const AddList = () => {  
  const id = useLocation().state.catID; // or should this be passed by parameter? 
  // console.log('** AddList useLocation().state: **');
  // console.log(useLocation().state)
  const {state, dispatch} = useStore();

  const [addMode, setAddMode] = useState(false);  // set add mode when add button is pressed.

  const [listName, setListName] = useState('');

  const onSubmitAdd = (e) => {
    e.preventDefault();
    onRequestAdd()
  };

  const onRequestAdd = async () => {
    if (listName.length===0) {return;}
    const newList = { listName: listName, categoryID: id};
    const status = await handleAddList(newList, state, dispatch);
    if (status!==api.OK) {  }
    // TODO: maybe add additional message if API operation failed?
  };

  const cancelAdd = () => {
    setListName('');
    setAddMode(false);
  }

  const setupAdd = () => {
    setAddMode(true);
  }

  return (
    <Fragment>
      { !addMode && 
      <Fragment>
        <div className="showAddArea">
          <span className='iconBorder'>
            <FcTodoList onClick={() => setupAdd()}
              title='add new list' className='iconBorder' size='18' color='#555555' />
            </span>
          <span className="spacer"> </span>
          <span className="headerAddLabel">Add new list</span>
        </div>  
      </Fragment>
      }
      { addMode && 
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
              <FiXCircle onClick={() => cancelAdd()}
              title='cancel new list' className='iconBorder' size='24' color='#555555' />
            </span>
          </span>
        </div>
      </Fragment>
    }
    </Fragment>
  )
}

export default AddList;
