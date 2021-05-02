import React, {useContext} from 'react'

const initValues = {
  loading: true,
  user: {},
  categories: [],
  lists: [],
  items: [],
};

const StoreContext = React.createContext();

function reducer(state, action) {
  switch (action.type) {
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
    case 'DO_NOTHING': {
      return state;
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
