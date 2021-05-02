import React, {useContext} from 'react'

const initValues = {
  loading: true,
  user: {},
  categories: {},
  lists: {},
  items: {},
};

const StoreContext = React.createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      return state;
    }
    case 'DELETE_ITEM': {
      return state;
    }
    case 'FINISHED_LOADING': {
      return {
        ...state,
        loading: false,
      };
    }
    case 'SET_USER': {
      // console.log('SET_USER');
      // console.log(state);
      // console.log(action.payload.user);
      return {
        ...state,
        user: action.payload.user,
      };
    }
    case 'DO_NOTHING': {
      return state;
    }
    case 'GET_LISTS': {
      return {
        ...state,
        categories: action.payload.categories,
        lists: action.payload.lists,
        items: action.payload.items,
      };
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function StoreProvider({children}) {
  const [state, dispatch] = React.useReducer(reducer, initValues );
  const value = {state, dispatch};
  return (<StoreContext.Provider value={value}>{children}</StoreContext.Provider>);
}

function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a provider');
  }
  return context;
}

export {StoreProvider, useStore};
