/**
 * CategoriesGroup - show group of categories as draggable elements.  Called by AllCats.  
 * Handles REORDER_LIST on dragEnd.
 */
import React, { Fragment, useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor,
  useSensors, TouchSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useStore } from '../store/StoreContext';
import { getAllCats } from '../store/getData';
import { SortableCatUnit } from './SortableCatUnit';
import { findPosWithAttr } from '../util/helpers';
import { handleUpdateCategoriesGroup } from '../store/handlers';

const CategoriesGroup = () => {
  const { state, dispatch } = useStore();  // this must come before conditional render

  const allCats = getAllCats(state);
  // set variable 'items' as local array, which can be reordered by dragging.
  // not to be confused with 'items' in state.  It MUST be called 'items' apparently
  const [items, setItems] = useState([...allCats]);

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
      handleUpdateCategoriesGroup(newItems, state, dispatch);
    }
  };

  if (allCats.length<1) { return (<div>(no categories yet)</div>); }
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
          {items.map(item => <SortableCatUnit key={item.id} id={item.id} category={item}
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

export default CategoriesGroup;
