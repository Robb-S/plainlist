/**
 * ListsGroup - show group of lists as draggable elements.  Called by OneCat.  
 * Handles REORDER_LIST on dragEnd.
 */
import React, { Fragment, useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor,
  useSensors, TouchSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useStore } from '../store/StoreContext';
import { getListsByCatID } from '../store/getData';
import { SortableListUnit } from './SortableListUnit';
import { findPosWithAttr } from '../util/helpers';
import { handleUpdateListsGroup } from '../store/handlers';

const ListsGroup = ({ categoryID }) => {
  const { state, dispatch } = useStore();  // this must come before conditional render

  const oneCatLists = getListsByCatID(categoryID, state);
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

  if (oneCatLists.length<1) { return (<div>(no lists yet)</div>); }
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
