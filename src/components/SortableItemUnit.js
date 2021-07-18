/**
 * SortableItemUnit component.  Display one item from list, with update and delete 
 * handlers.  It is set up as a sortable list element, working with a dnd-kit sortable list.
 */
import React, { Fragment, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import '../css/oneItem.css';
import { useStore } from '../store/StoreContext';
import { handleRemoveItem, handleUpdateItem } from '../store/handlers';
import { IconButton, MakeDragIcon } from './IconButton';
import TextField from '@material-ui/core/TextField';

export function SortableItemUnit(props) {
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
    if (itemName.length<1) return;
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
        <li ref={setNodeRef} style={style} className='oneItemLine noselect'>
            <div className='itemOneRow'>
              <div className='dragHandle' {...listeners} {...attributes} >
                <div className='dragHandleIcon'>{ MakeDragIcon() }</div>
              </div>
              <div className='itemName itemPart2'>
                {props.item.itemName}
              </div>
              <div className='itemNote itemPart3'>
                {props.item.itemNote}
              </div>
              <div className='buttons itemPart4'>
                <IconButton config={ { title:'edit item',
                  iconType:'edit', callProc:setupEdit }} />
              </div>
              <div className='buttons itemPart5'>
                <IconButton config={ { title:'delete item',
                  iconType:'delete', callProc:removeItem }} />
              </div>
            </div>
        </li>
      </Fragment>
      }

      { editMode &&
      <Fragment>
        <li className='editItemFormLi'>
          <div className='editItemDiv'>
            <form className='editItemForm' onSubmit={submitUpdateItem}>
              <span className='editItemInputArea'>
                <TextField
                  label="Item name:" value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  variant='outlined'
                  margin='dense'
                />
                <TextField
                  label="Note:" value={itemNote}
                  onChange={(e) => setItemNote(e.target.value)}
                  variant='outlined'
                  margin='dense'
                />
              </span>
              <input type="submit" className="hidden" />
            </form>
            <span className='editButtonArea'>
              <IconButton config={ { title:'accept edit',
                iconType:'confirm', callProc:updateItem }} />
              <IconButton config={ { title:'cancel edit',
                iconType:'cancel', callProc:cancelEdit }} />
            </span>
          </div>
        </li>
      </Fragment>
      }

    </Fragment>
  );
}
