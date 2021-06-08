
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
    case 'SET_RUNMODE': { // payload is 'API' or 'testMode'
      return {
        ...state,
        runMode: action.payload,
      };
    }
    case 'USER_LOGIN': {
      return {
        ...state,
        loggedIn: true,
      }
    }
    case 'USER_LOGOUT': {
      return {
        ...state,
        loggedIn: false,
      }
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
      // console.log(action.payload);
      return {
        ...state,
        items: state.items.filter(
          (item) => item.id !== action.payload
        ),
      };
    }
    case 'DELETE_CAT': { // payload is category ID
      console.log('*** deleting category in reducer');
      // console.log(action.payload);
      return {
        ...state,
        categories: state.categories.filter(
          (category) => category.id !== action.payload
        ),
      };
    }
    case 'DELETE_LIST': { // payload is list ID
      console.log('*** deleting list in reducer');
      // console.log(action.payload);
      return {
        ...state,
        lists: state.lists.filter(
          (list) => list.id !== action.payload
        ),
      };
    }
    case 'UPDATE_ITEM': { // payload is updatedItem object
      console.log('*** updating item in reducer');
      // console.log(action.payload);
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

    case 'UPDATE_LIST': { // payload is updatedList object
      console.log('*** updating list in reducer');
      // console.log(action.payload);
      const updatedList = action.payload;
      const updatedLists = state.lists.map((list) => {
        if (list.id === updatedList.id) {
          return updatedList;
        }
        return list;
      });
      return {
        ...state,
        lists: updatedLists,
      };
    }

    case 'UPDATE_CAT': { // payload is updatedCat object
      console.log('*** updating category in reducer');
      // console.log(action.payload);
      const updatedCat = action.payload;
      const updatedCats = state.categories.map((cat) => {
        if (cat.id === updatedCat.id) {
          return updatedCat;
        }
        return cat;
      });
      return {
        ...state,
        categories: updatedCats,
      };
    }


    case 'ADD_ITEM': { // payload is rec object
      console.log('*** adding item in reducer');
      // console.log(action.payload);
      // console.log('other items: ');
      // console.log(state.items);
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    case 'ADD_CAT': { // payload is rec object
      console.log('*** adding cat in reducer');
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    }
    case 'ADD_LIST': { // payload is rec object
      console.log('*** adding list in reducer');
      // console.log(action.payload);
      return {
        ...state,
        lists: [...state.lists, action.payload],
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
