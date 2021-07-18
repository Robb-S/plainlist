/**
 * SortableCatUnit component.  Display one category, with info and link.
 * It is set up as a sortable list element, working with a dnd-kit sortable list.
 */
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import '../css/oneList.css';
import { MakeDragIcon } from './IconButton';
import { pluralize } from '../util/helpers';

export function SortableCatUnit(props) {
  const categoryID = props.category.id;
  const categoryName = props.category.categoryName;
  const itemCountTxt = pluralize(props.category.childCount, 'item', 'items');

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
            <div className='dragHandleIcon'>{ MakeDragIcon() }</div>
          </div>
          <div className='itemName itemPart2'>
            <Link className='linky3'
              title={categoryName}
              to={{
                pathname: `/cat/`,
                state: { categoryID: categoryID },
              }}
            >
              {categoryName}
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
