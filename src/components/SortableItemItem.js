import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import '../css/lists.css';
import {useStore} from '../store/StoreContext';
import {handleRemoveItem} from '../store/handlers';
import { MdDragHandle } from 'react-icons/md';
import { FiTrash2, FiEdit } from 'react-icons/fi';

export function SortableItemItem(props) {
  const {state, dispatch} = useStore();  

  const { attributes, listeners, setNodeRef, transform, transition } = 
    useSortable({id: props.id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const removeItem = (itemID) => {
    // TODO: make confirmation dialog
    handleRemoveItem(itemID, state, dispatch);
  }

  const editItem = (itemID) => {
    // handleEditItem(itemID, state, dispatch);
  }

  return (
    <tr ref={setNodeRef} style={style} className='oneItemLine'>
      <td className='dragHandle'>
        <span className='iconBorderSmall iconHandle'>
          <MdDragHandle {...listeners} {...attributes} size='16' color='red' />
        </span>
      </td>
      <td className='itemName'>
        {props.item.itemName}
      </td>
      <td className='itemNote'>
        {props.item.itemNote}  
      </td>
      <td className='buttons'>
        <span className='iconDelete iconBorder'>
          <FiTrash2 onClick={() => removeItem(props.item.id)}
          className='iconBorder' size='24' color='#555555' />
        </span>
        <span className="sliver5"> </span>
        <span className='iconEdit iconBorder'>
          <FiEdit onClick={() => editItem(props.item.id)}
          className='iconBorder' size='24' color='#555555' />
        </span>
      </td>
    </tr>
  );
}
