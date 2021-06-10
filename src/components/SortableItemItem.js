/**
 * SortableItemItem component.  Display one item from list, with update and delete 
 * handlers.  It is set up as a sortable list element (although it's currently a 
 * table row), working with a dnd-kit sortable list.
 */
import React, { Fragment, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import '../css/lists.css';
import { useStore } from '../store/StoreContext';
import { handleRemoveItem, handleUpdateItem } from '../store/handlers';
import { MdDragHandle } from 'react-icons/md';
import { FiTrash2, FiEdit, FiCheckSquare, FiXCircle } from 'react-icons/fi';

export function SortableItemItem(props) {
  const itemID = props.item.id;
  const { state, dispatch } = useStore();
  const [editMode, setEditMode] = useState(false);  // set edit mode when edit button is pressed.
  const [itemName, setItemName] = useState(props.item.itemName);
  const [itemNote, setItemNote] = useState(props.item.itemNote);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const removeItem = () => {
    handleRemoveItem(itemID, state, dispatch);
  };

  const setupEdit = () => {
    setEditMode(true);
  };

  const submitUpdateItem = (e) => {
    e.preventDefault();
    updateItem();
  };

  const updateItem = () => {
    setEditMode(false);
    handleUpdateItem(itemID, itemName, itemNote, state, dispatch);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setItemName(props.item.itemName);
    setItemNote(props.item.itemNote);
  };

  return (
    <Fragment>
      { !editMode &&
      <Fragment>
        <tr ref={setNodeRef} style={style} className='oneItemLine noselect'>
          <td className='dragHandle'>
            <span className='iconBorderSmall iconHandle'>
              <MdDragHandle {...listeners} {...attributes}
              title='drag to change order' size='16' color='green' />
            </span>
          </td>
          <td className='itemName'>
            {props.item.itemName}
          </td>
          <td className='itemNote'>
            {props.item.itemNote}
          </td>
          <td className='buttons'>
            <span className='iconEdit iconBorder'>
              <FiEdit onClick={() => setupEdit()}
              title='edit item' className='iconBorder' size='24' color='#555555' />
            </span>
            <span className="spacer"> </span>
            <span className='iconDelete iconBorder'>
              <FiTrash2 onClick={() => removeItem()}
              title='delete item' className='iconBorder' size='24' color='#555555' />
            </span>
          </td>
        </tr>
      </Fragment>
      }

      { editMode &&
      <Fragment>
        <tr>
          <td></td>
          <td colSpan="2" className='editFormTD'>
            <form className='editFormForm' onSubmit={submitUpdateItem}>
              <span className='editInputArea'>
                <input
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  type="text"
                />
                <span className="sliver5"> </span>
                <input
                  value={itemNote}
                  onChange={(e) => setItemNote(e.target.value)}
                  type="text"
                />
              </span>
              <input type="submit" className="hidden" />
            </form>
          </td>
          <td className='buttons editButtons'>
            <span className='editButtonArea'>
              <span className='iconCheckmark iconNoBorder'>
                <FiCheckSquare onClick={() => updateItem()}
                title='accept edit' size='24' color='#555555' />
              </span>
              <span className="sliver5"> </span>
              <span className='iconEdit iconNoBorder'>
                <FiXCircle onClick={() => cancelEdit()}
                title='cancel edit' className='iconBorder' size='24' color='#555555' />
              </span>
            </span>
          </td>
        </tr>
      </Fragment>
      }

    </Fragment>
  );
}
