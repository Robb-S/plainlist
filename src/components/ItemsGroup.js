/**
 * ItemsGroup - show group of items as draggable elements.  Called by OneList.  
 * Handles REORDER_LIST on dragEnd.
 */
import React, { Fragment, useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor,
  useSensors, TouchSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import '../css/lists.css';
import { useStore } from '../store/StoreContext';
import { getItemsByListID } from '../store/getData';
import { SortableItemUnit } from './SortableItemUnit';
import { findPosWithAttr } from '../util/helpers';
import { handleUpdateItemsGroup } from '../store/handlers';

const ItemsGroup = ({ listID }) => {
  const { state, dispatch } = useStore();  // this must come before conditional render

  const oneListItems = getItemsByListID(listID, state);
  // const [activeId, setActiveId] = useState(null); // used with DragOverlay
  // set variable 'items' as local array, which can be reordered by dragging.
  // not to be confused with 'items' in state.
  const [items, setItems] = useState([...oneListItems]);

  // this is needed when switching from orig to copied list, need to update items
  useEffect(() => {
    const newListItems = getItemsByListID(listID, state);
    setItems([...newListItems]);
  }, [listID]);

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
      handleUpdateItemsGroup(newItems, state, dispatch);
    }
  };

  if (oneListItems.length<1) { return (<div  className='noneYetMsg'>[no items yet]</div>); }
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
          {items.map(item => <SortableItemUnit key={item.id} id={item.id} item={item}
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

export default ItemsGroup;
