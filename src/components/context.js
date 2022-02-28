import React, { createContext, useState } from "react";

const Context = createContext();

const ContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState("light");

  const login = (getuser, getrole) => {
    setIsAuthenticated(getuser);
  };

  return (
    <Context.Provider value={{ isAuthenticated, theme, login }}>
      {children}
    </Context.Provider>
  );
};

export { Context, ContextProvider };
