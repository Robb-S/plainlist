/**
 * SortableListUnit component.  Display one list from category, with info and link.
 * It is set up as a sortable list element, working with a dnd-kit sortable list.
 */
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import '../css/oneList.css';
import { GrDrag } from 'react-icons/gr';
import { pluralize } from '../util/helpers';

export function SortableListUnit(props) {
  const listID = props.list.id;
  const listName = props.list.listName;
  const itemCountTxt = pluralize(props.list.childCount, 'item', 'items');

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Fragment>
      <li ref={setNodeRef} style={style} className='oneItemLine noselect'>
        <div className='listOneRow'>
          <div className='dragHandle' {...listeners} {...attributes} >
            <div className='dragHandleIcon'>
              <GrDrag title='drag to change order' size='20' color='#ffffff' />
            </div>
          </div>
          <div className='itemName itemPart2'>
            <Link className='linky3'
              title={listName}
              to={{
                pathname: `/list/`,
                state: { listID: listID },
              }}
            >
              {listName}
            </Link>
          </div>
          <div className='itemNote itemPart3'>
            {itemCountTxt}
          </div>
        </div>
      </li>
    </Fragment>
  );
}
