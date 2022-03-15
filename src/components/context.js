import React, { createContext, useState } from "react";

export const Context = createContext();

// export const ContextProvider = (props) => {
//   const [state, setState] = useState({
//     email: localStorage.getItem('loginData')
//     ? JSON.parse(localStorage.getItem('loginData')).email
//     : undefined,
//     isAuthenticated: localStorage.getItem('loginData')? true : false,
//     theme: 'light',
//     language: 'rus',
//     user_id: 4,
//   })
//
//   return (
//     <Context.Provider value={{state, setState}}>
//       {props.children}
//     </Context.Provider>
//   )
//
// }
//
// module.export = { Context, ContextProvider}
