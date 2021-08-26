
function AppReducer(state, action) {
  switch (action.type) {
    case 'STARTED_LOADING': { // no payload
      return {
        ...state,
        loading: true,
      };
    }
    case 'FINISHED_LOADING': { // no payload
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
    case 'USER_LOGIN': { // payload is { loginName }
      return {
        ...state,
        loggedIn: true,
        loginName: action.payload.loginName,
        // userID: action.payload.userID,
      };
    }
    case 'USER_LOGOUT': { // no payload
      return {
        ...state,
        loggedIn: false,
        loginName: '',
        user: {},
        profile: {},
        categories: [],
        lists: [],
        items: [],
      };
    }
    // case 'SET_FLAT': { // payload is true or false
    //   return {
    //     ...state,
    //     flatMode: action.payload,
    //   };
    // }
    // case 'SET_FLAT2': { // payload is true or false
    //   return {
    //     ...state,
    //     profile: {
    //       ...state.profile,
    //       flatMode: action.payload,
    //     },
    //   };
    // }
    // case 'SET_LAST_LIST': { // payload is lastList (integer)
    //   return {
    //     ...state,
    //     profile: {
    //       ...state.profile,
    //       lastList: action.payload,
    //     },
    //   };
    // }
    // case 'SET_NICKNAME': { // payload is nickname
    //   return {
    //     ...state,
    //     profile: {
    //       ...state.profile,
    //       nickname: action.payload,
    //     },
    //   };
    // }
    case 'SET_IS_MOBILE': { // payload is true or false
      return {
        ...state,
        isMobile: action.payload,
      };
    }
    case 'SET_USER': { // payload is {user, profile}
      return {
        ...state,
        user: action.payload.user,
        profile: action.payload.profile,
      };
    }
    // case 'SET_PROFILE': { // payload is Profile object
    //   return {
    //     ...state,
    //     profile: action.payload,
    //   };
    // }
    case 'UPDATE_PROFILE': { // payload is profile object
      return {
        ...state,
        profile: action.payload,
      };
    }
    case 'SET_LISTS': { // payload is {categories, lists, items}
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
          (item) => item.id !== action.payload,
        ),
      };
    }
    case 'DELETE_CAT': { // payload is category ID
      /* Also delete lists with this categoryID, so that they're not accidentally
         accessed from browser forward or back button.  There's no need to delete
         the items, as they are already removed from API DB and will disappear the
         next time the store is refreshed. */
      console.log('*** deleting category ' + action.payload + ' in reducer');
      return {
        ...state,
        categories: state.categories.filter(
          (category) => category.id !== action.payload,
        ),
        lists: state.lists.filter(
          (list) => list.categoryID !== action.payload,
        ),
      };
    }
    case 'DELETE_LIST': { // payload is list ID
      // also delete items with this listID
      console.log('*** deleting list ' + action.payload + ' in reducer');
      return {
        ...state,
        lists: state.lists.filter(
          (list) => list.id !== action.payload,
        ),
        items: state.items.filter(
          (item) => item.listID !== action.payload,
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
      // console.log('*** adding item in reducer');
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

export { AppReducer };
