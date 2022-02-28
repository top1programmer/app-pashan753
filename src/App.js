import './App.css';
import { useState, useContext } from 'react';
import * as Bootstrap from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavbarComponent } from './components/navbar'
import { Context, ContextProvider } from './components/context'
import { Main } from './components/main'
import './style/style.css'

function App() {
  //const contextData = useContext(Context)
   const [contextData, setContextData] =useState(false)
  // const [contextData, setContextData] =useState({
  //   isAuthenticated: false,
  //   theme: 'light',
  //   language: 'rus',
  // })

  console.log(contextData);
  return (
    <ContextProvider>
    <div className="App">
      <Bootstrap.Container>
      <NavbarComponent />
      <Main/>
    </Bootstrap.Container>
  </div>
  </ContextProvider>
);
}

export default App;
