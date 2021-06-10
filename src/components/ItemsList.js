/**
 * ItemsList - show list of items as draggable elements.  Called by OneList.  
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
import { getItemsByListID } from '../store/getData';
import { SortableItemItem } from './SortableItemItem';
import { findPosWithAttr } from '../util/helpers';
import { handleUpdateItemsList } from '../store/handlers';

const ItemsList = () => {
  const data = useLocation(); // to retrieve params from data.state
  // data.state will only exist when set up in LINK, not if URL was entered manually
  const needsRedirect = data.state ? false : true; // is it called from link or manual URL
  const listID = needsRedirect ? null : data.state.listID;
  const { state, dispatch } = useStore();  // this must come before conditional render

  const oneListItems = getItemsByListID(listID, state);
  // const [activeId, setActiveId] = useState(null); // used with DragOverlay
  // set variable 'items' as local array, which can be reordered by dragging.
  // not to be confused with 'items' in state.
  const [items, setItems] = useState([...oneListItems]);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 2,
        tolerance: 3,
      },
    }),
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // function handleDragStart(event) {
  //   const {active} = event;
  //   setActiveId(active.id);
  // }

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = findPosWithAttr(items, 'id', active.id);
      const newIndex = findPosWithAttr(items, 'id', over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      handleUpdateItemsList(newItems, state, dispatch);
      // setItems((items) => {
      //   const oldIndex = findPosWithAttr(items, 'id', active.id);
      //   const newIndex = findPosWithAttr(items, 'id', over.id);
      //   return arrayMove(items, oldIndex, newIndex);
      // });
    }
  };

  return (
    <Fragment>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        // onDragStart={handleDragStart}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}
        >
          <table className="itemsTable">
          <tbody>
          {items.map(item => <SortableItemItem key={item.id} id={item.id} item={item}
          />)}
          </tbody>
          </table>

        </SortableContext>
        {/* <DragOverlay>
          {activeId ? <Item id={activeId} item={items[0]} /> : null}
        </DragOverlay> */}
      </DndContext>
    </Fragment>
  );
};

export default ItemsList;
