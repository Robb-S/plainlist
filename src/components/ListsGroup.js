/**
 * ListsGroup - show group of lists as draggable elements.  Called by OneCat and AllLists.
 * If categoryID===null then show a group of all (uncategorized) lists, otherwise just
 * show the ones for this category.
 * Handles one of two REORDER_LIST handlers on dragEnd.
 */
import React, { Fragment, useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor,
  useSensors, TouchSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useStore } from '../store/StoreContext';
import { getAllLists, getListsByCatID } from '../store/getData';
import { SortableListUnit } from './SortableListUnit';
import { findPosWithAttr } from '../util/helpers';
import { handleUpdateListsGroup, handleUpdateFlatListsGroup } from '../store/handlers';

const ListsGroup = ({ categoryID }) => {
  const isAllLists = categoryID===null;
  const { state, dispatch } = useStore();  // this must come before conditional render

  const listsToShow = isAllLists ? getAllLists(state) :
    getListsByCatID(categoryID, state);
  // set variable 'items' as local array, which can be reordered by dragging.
  // not to be confused with 'items' in state.  It MUST be called 'items' apparently
  const [items, setItems] = useState([...listsToShow]);

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
    console.log('** handleDragEnd started for list.');
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = findPosWithAttr(items, 'id', active.id);
      const newIndex = findPosWithAttr(items, 'id', over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      // choose from separate handlers for lists within category or all lists
      if (isAllLists) { handleUpdateFlatListsGroup(newItems, state, dispatch); }
      else { handleUpdateListsGroup(newItems, state, dispatch); }
    }
  };

  if (listsToShow.length<1) { return (<div>(no lists yet)</div>); }
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
