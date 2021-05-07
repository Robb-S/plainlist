
function AppReducer(state, action) {
  switch (action.type) {
    case 'STARTED_LOADING': {
      return {
        ...state,
        loading: true,
      };
    }
    case 'FINISHED_LOADING': {
      return {
        ...state,
        loading: false,
      };
    }
    case 'SET_USER': {
      return {
        ...state,
        user: action.payload.user,
      };
    }
    case 'SET_LISTS': {
      return {
        ...state,
        categories: action.payload.categories,
        lists: action.payload.lists,
        items: action.payload.items,
      };
    }
    case 'DELETE_ITEM': { // payload is item ID
      console.log('*** deleting item in reducer');
      console.log(action.payload);
      return {
        ...state,
        items: state.items.filter(
          (item) => item.id !== action.payload
        ),
      };
    }
    case 'UPDATE_ITEM': { // payload is updatedItem object
      console.log('*** updating item in reducer');
      console.log(action.payload);
      const updatedItem = action.payload;
      const updatedItems = state.items.map((item) => {
        if (item.id === updatedItem.id) {
          return updatedItem;
        }
        return item;
      });
      return {
        ...state,
        items: updatedItems,
      };
    }
    case 'ADD_ITEM': { // payload is item object
      console.log('*** adding item in reducer');
      console.log(action.payload);
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    case 'DO_NOTHING': {
      return state;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export {AppReducer} ; 