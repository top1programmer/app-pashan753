import React, { useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux"
import { createStore } from 'redux';
import rootReducer from './reducer/rootReducer'
import { Context } from './components/context'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { PersistGate } from 'redux-persist/integration/react'


//const store = createStore(rootReducer);

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['textToSearch']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
let store = createStore(persistedReducer)
let persistor = persistStore(store)

const ContextProvider = (props) => {
  //console.log(localStorage.getItem('context'));
  const [state, setState] = useState(localStorage.getItem('context')
   ? JSON.parse(localStorage.getItem('context'))
   :{
      email: localStorage.getItem('loginData')
      ? JSON.parse(localStorage.getItem('loginData')).email
      : undefined,
    isAuthenticated: localStorage.getItem('loginData')? true : false,
    theme: 'light',
    language: 'rus',
    user_id: 0,
    filter: '',
    role: 'user',
    textToSearch: ''
  })

  return (
    <Context.Provider value={{state, setState}}>
      {props.children}
    </Context.Provider>

  )
}


ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
