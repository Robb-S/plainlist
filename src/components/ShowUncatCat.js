/**
 * ShowUncatCat - show uncategorized category at bottom of group of regular categories
 * with no options to reorder.  Don't display it (hide it) if there are no sublists.
 * Otherwise, display with info and link. Called by AllCats.  
 */
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/StoreContext';
import { getUncategorizedCategory } from '../store/getData';
import { pluralize } from '../util/helpers';
import '../css/oneList.css';
import '../css/oneItem.css';

const ShowUncatCat = () => {
  const { state } = useStore();  // this must come before conditional render
  const specialCat = getUncategorizedCategory(state);
  if (!specialCat) return null;  // just in case something went wrong
  if (specialCat.childCount<1) return null; // hide if no children
  const categoryID = specialCat.id;
  const categoryName = specialCat.categoryName;
  const itemCountTxt = pluralize(specialCat.childCount, 'item', 'items');

  return (
    <Fragment>
      <div className='listOneRow listOneRowUncat'>
        <div className='notDragHandle'>
          <div className='noDragHandleIcon'></div>
        </div>
        <div className='itemName listPart2'>
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
        <div className='itemNote listPart3'>
          {itemCountTxt}
        </div>
      </div>
    </Fragment>
  );
};

export default ShowUncatCat;
