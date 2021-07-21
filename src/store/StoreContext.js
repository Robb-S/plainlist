import React, { useContext } from 'react';
import { AppReducer } from './AppReducer';

const initValues = {
  loading: true,
  loggedIn: false,
  flatMode: false,
  isMobile: false,
  runMode: 'API',
  user: {},
  categories: [],
  lists: [],
  items: [],
};

const StoreContext = React.createContext();

function StoreProvider({ children }) {
  const [state, dispatch] = React.useReducer(AppReducer, initValues);
  const value = { state, dispatch };
  return (<StoreContext.Provider value={value}>{children}</StoreContext.Provider>);
}

function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a provider');
  }
  return context;
}

export { StoreProvider, useStore };
