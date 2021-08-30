import React, { useContext } from 'react';
import { AppReducer } from './AppReducer';

const initValues = {
  isLaunched: false,
  isMobile: false,
  loading: false,
  loggedIn: false,
  loginName: '',
  user: {},
  profile: {},        // contains { flatMode, nickname, rememberLastList, lastList }
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
