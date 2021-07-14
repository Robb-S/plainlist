/**
 * ListsGroup - show group of lists as draggable elements.  Called by OneCat.  
 * Handles REORDER_LIST on dragEnd.
 */
import React, { Fragment, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor,
  useSensors, TouchSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import '../css/lists.css';
import { useStore } from '../store/StoreContext';
import { getListsByCatID } from '../store/getData';
import { SortableListUnit } from './SortableListUnit';
import { findPosWithAttr } from '../util/helpers';
import { handleUpdateListsGroup } from '../store/handlers';

const ListsGroup = () => {
  const data = useLocation(); // to retrieve params from data.state
  // data.state will only exist when set up in LINK, not if URL was entered manually
  const needsRedirect = data.state ? false : true; // is it called from link or manual URL
  const categoryID = needsRedirect ? null : data.state.categoryID;
  // console.log('** categoryID found * ' + categoryID);
  const { state, dispatch } = useStore();  // this must come before conditional render

  const oneCatLists = getListsByCatID(categoryID, state);
  // const [activeId, setActiveId] = useState(null); // used with DragOverlay
  // set variable 'items' as local array, which can be reordered by dragging.
  // not to be confused with 'items' in state.  It MUST be called 'items' apparently
  const [items, setItems] = useState([...oneCatLists]);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      // Press delay of 50ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 50,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = findPosWithAttr(items, 'id', active.id);
      const newIndex = findPosWithAttr(items, 'id', over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      handleUpdateListsGroup(newItems, state, dispatch);
    }
  };

  return (
    <Fragment>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}
        >
          <div className='itemsTable'>
          <ul className='itemsTableUL'>
          {items.map(item => <SortableListUnit key={item.id} id={item.id} list={item}
          />)}
          </ul>
          </div>

        </SortableContext>
        {/* <DragOverlay>
          {activeId ? <Item id={activeId} item={items[0]} /> : null}
        </DragOverlay> */}
      </DndContext>
    </Fragment>
  );
};

export default ListsGroup;
