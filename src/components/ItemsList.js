import React, {Fragment, useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor,  
  useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, 
  verticalListSortingStrategy } from '@dnd-kit/sortable';
import {restrictToWindowEdges, restrictToVerticalAxis} from '@dnd-kit/modifiers';
import '../css/lists.css';
import {useStore} from '../store/StoreContext';
import {getItemsByListID} from '../store/getData';
import {SortableItemItem} from './SortableItemItem';
import {findPosWithAttr} from '../util/helpers';


const ItemsList = () => {
  const data = useLocation(); // to retrieve params from data.state
  // data.state will only exist when set up in LINK, not if URL was entered manually
  const needsRedirect = data.state ? false : true; // is it called from link or manual URL
  const listID = needsRedirect ? null : data.state.listID; 
  const {state } = useStore();  // this must come before conditional render

  const oneListItems = getItemsByListID(listID, state);

  // const [activeId, setActiveId] = useState(null);
  const [items, setItems] = useState([...oneListItems]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // console.log('useEffect for items');
    // console.log(items);
  }, [items]);

  // function handleDragStart(event) {
  //   const {active} = event;
  //   setActiveId(active.id);
  // }

  const handleDragEnd = (event) => {
    const {active, over} = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = findPosWithAttr(items, 'id', active.id);
        const newIndex = findPosWithAttr(items, 'id', over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <Fragment>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        // onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={items}
          strategy={verticalListSortingStrategy}
        >
          <table className="itemsTable">
          <tbody>
          {items.map(item => <SortableItemItem key={item.id} id={item.id} item={item} 
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]} handle 
          />)}
          </tbody>
          </table>

        </SortableContext>
        {/* <DragOverlay>
          {activeId ? <Item id={activeId} item={items[0]} /> : null}
        </DragOverlay> */}
      </DndContext>
    </Fragment>
  )
}

export default ItemsList;
