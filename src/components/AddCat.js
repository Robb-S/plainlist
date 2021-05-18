import React, {Fragment, useState} from 'react';
import '../css/lists.css';
import {useStore} from '../store/StoreContext';
import {handleAddCategory} from '../store/handlers';
import {FiCheckSquare, FiXCircle} from 'react-icons/fi';
import * as api from '../util/constants';

const AddCat = ({ props }) => {
  const { editMode, cancelEdit }  = props;
  const { state, dispatch } = useStore();
  const userID = state.user.id;     
  const [catName, setCatName] = useState('');

  /**
   * Form submit handler allows user to press RETURN rather than button to submit
   */
  const onSubmitAdd = (e) => {
    e.preventDefault();
    onRequestAdd();
  }

  const onRequestAdd = async () => {
    if (catName.length===0) {return;}
    const newCategory = { categoryName: catName, userID: userID };
    const status = await handleAddCategory(newCategory, state, dispatch);
    if (status===api.OK) { cancelEdit(); }
    // TODO: maybe add additional message if API operation failed?
  };

  return (
    <Fragment>
      {editMode && 
      <Fragment>
        <div className='addArea'>
          <form className='addCategoryForm' onSubmit={onSubmitAdd}>
            <span className='addAreaInput'>
              <div>Category name</div>
              <input
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                type="text"
              />
            </span>
          </form>
          <span className='editButtonArea'>
            <span className='iconCheckmark iconNoBorder'>
              <FiCheckSquare onClick={() => onRequestAdd()}
              title='accept edit' size='24' color='#555555' />
            </span>
            <span className="sliver5"> </span>
            <span className='iconEdit iconNoBorder'>
              <FiXCircle onClick={() => cancelEdit()}
              title='cancel edit' className='iconBorder' size='24' color='#555555' />
            </span>
          </span>
        </div>
      </Fragment>
      }
    </Fragment>
  )
}

export default AddCat;
