import React, {Fragment, useState} from 'react';
import { useLocation } from 'react-router-dom';
import '../css/lists.css';
import {useStore} from '../store/StoreContext';
import {handleAddList} from '../store/handlers';
import { FiCheckSquare, FiXCircle } from 'react-icons/fi';
import { FcTodoList } from 'react-icons/fc';

const AddList = () => {  
  const id = useLocation().state.catID; // or should this be passed by parameter? 
  const {state, dispatch} = useStore();

  const [editMode, setEditMode] = useState(false);  // set edit mode when add button is pressed.

  const [listName, setListName] = useState('');

  const onSubmitAdd = (e) => {
    e.preventDefault();
    if (listName.length===0) {return;}
    const newList = { listName: listName, categoryID: id};
    handleAddList(newList, state, dispatch);
  };

  const onSubmitAdd2 = () => {
    if (listName.length===0) {return;}
    const newList = { listName: listName, categoryID: id};
    handleAddList(newList, state, dispatch);
  };

  const cancelAdd = () => {
    setListName('');
    setEditMode(false);
  }

  const setupEdit = () => {
    setEditMode(true);
  }

  return (
    <Fragment>
      { !editMode && 
      <Fragment>
        <div className="thaddarea">
          <span className='iconBorder'>
            <FcTodoList onClick={() => setupEdit()}
              title='add new list' className='iconBorder' size='24' color='#555555' />
            </span>
          <span className="spacer"> </span>
          <span className="headerAddLabel">Add new list</span>
        </div>  
      </Fragment>
      }

      { editMode && 
      <Fragment>
        <div className='additem'>
          <form onSubmit={onSubmitAdd}>
            <label>New list: </label>
            <input
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              type="text"
              placeholder="name of list"
            />
            <span className='editButtonArea'>
              <span className='iconCheckmark iconNoBorder'>
                <FiCheckSquare onClick={() => onSubmitAdd2()}
                title='add list' size='24' color='#555555' />
              </span>
              <span className='iconEdit iconNoBorder'>
                <FiXCircle onClick={() => cancelAdd()}
                title='cancel list' className='iconBorder' size='24' color='#555555' />
              </span>
            </span>
          </form>
        </div>      
      </Fragment>
    }
    </Fragment>
  )
}

export default AddList;
