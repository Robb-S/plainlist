/**
 * SortableListUnit component.  Display one list from category, with info and link.
 * It is set up as a sortable list element, working with a dnd-kit sortable list.
 */
import React, { Fragment, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import '../css/oneList.css';
import { useStore } from '../store/StoreContext';
import { GrDrag } from 'react-icons/gr';

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
            <div className='listOneRow'>
              <div className='dragHandle' {...listeners} {...attributes} >
                <div className='dragHandleIcon'>
                  <GrDrag title='drag to change order' size='20' color='#ffffff' />
                </div>
              </div>
              <div className='itemName itemPart2'>
                {props.list.listName}
              </div>
              <div className='itemNote itemPart3'>
                60 items
              </div>
            </div>

        </li>
      </Fragment>

    </Fragment>
  );
}
