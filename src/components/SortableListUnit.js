/**
 * SortableListUnit component.  Display one list from category, with info and link.
 * It is set up as a sortable list element, working with a dnd-kit sortable list.
 */
import React, { Fragment, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import '../css/oneItem.css';
import { useStore } from '../store/StoreContext';
import { GrDrag } from 'react-icons/gr';
import { FiTrash2, FiEdit } from 'react-icons/fi';

export function SortableListUnit(props) {
  const listID = props.list.id;
  const { state, dispatch } = useStore();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Fragment>
      <Fragment>
        <li ref={setNodeRef} style={style} className='oneItemLine noselect'>
            <div className='itemOneRow'>
              <div className='dragHandle' {...listeners} {...attributes} >
                <div className='dragHandleIcon'>
                  <GrDrag title='drag to change order' size='20' color='#ffffff' />
                </div>
              </div>
              <div className='itemName itemPart2'>
                {props.list.listName}
              </div>
              <div className='itemNote itemPart3'>
                {props.list.listName}
              </div>
              <div className='buttons itemPart4'>
                <span className='iconEdit XiconBorder'>
                  <FiEdit
                  title='edit item' className='iconBorder' size='26' color='#555555' />
                </span>
              </div>
              <div className='buttons itemPart5'>
                <span className='iconDelete XiconBorder'>
                  <FiTrash2
                  title='delete item' className='iconBorder' size='26' color='#555555' />
                </span>
              </div>
            </div>

        </li>
      </Fragment>

    </Fragment>
  );
}
