import React, { useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux"
import { Context } from './components/context'

// import { createStore } from 'redux';
//
// const store = createStore(reducer);
//
// export default store;

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
    role: 'user'
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
      <App />
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
