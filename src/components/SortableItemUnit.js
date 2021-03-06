/**
 * SortableItemUnit component.  Display one item from list, with update and delete 
 * handlers.  It is set up as a sortable list element, working with a dnd-kit sortable list.
 */
import React, { Fragment, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import '../css/oneItem.css';
import '../css/oneList.css';
import { validateLength, isValidLength } from '../util/helpers';

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
    if (!validateLength(itemName, 1, 60, 'item name')) return;
    if (!validateLength(itemNote, 0, 60, 'note')) return;
    setEditMode(false);
    handleUpdateItem(itemID, itemName, itemNote, state, dispatch);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setItemName(props.item.itemName);
    setItemNote(props.item.itemNote);
  };

  // show an actual horizontal rule if itemName==='<hr>'
  const showHR = props.item.itemName==='<hr>';
  return (
    <Fragment>
      { !editMode &&
      <Fragment>
        <li ref={setNodeRef} style={style} className='oneItemLine noselect'>
            <div className='itemOneRow'>
              <div className='dragHandle' {...listeners} {...attributes} >
                <div className='dragHandleIcon'>{ MakeDragIcon() }</div>
              </div>
              <div className='itemPart23'>
                { !showHR &&
                <div className='itemPart2'>
                  {props.item.itemName}
                </div>
                }
                { !showHR &&
                <div className='itemPart3'>
                  {props.item.itemNote}
                </div>
                }
                { showHR && <div><hr /></div>}
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
                  required
                  label="Item name:" value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  variant='outlined'
                  margin='dense'
                  inputProps={{ autoCapitalize: 'off' }}
                />
                <TextField
                  label="Note:" value={itemNote}
                  onChange={(e) => setItemNote(e.target.value)}
                  variant='outlined'
                  margin='dense'
                  inputProps={{ autoCapitalize: 'off' }}
                />
              </span>
              <input type="submit" className="hidden" />
            </form>
            <span className='editButtonArea'>
              <IconButton config={ { title:'accept edit',
                disabled: !(isValidLength(itemName, 1, 60) && isValidLength(itemNote, 0, 60)),
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
