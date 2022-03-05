import './App.css';
import { useState, useContext } from 'react';
import * as Bootstrap from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavbarComponent } from './components/navbar'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { Context } from './components/context'
import { Main } from './components/main'
import { MyReviews } from './components/myReviews'
import './style/style.css'

function App() {
  const [state, setState] = useState({
    email: JSON.parse(localStorage.getItem('loginData')).email,
    isAuthenticated: localStorage.getItem('loginData')? true : false,
    theme: 'light',
    language: 'rus'
  })


  console.log('aaaaap', state);
  return (
    <Context.Provider value={{state, setState}}>
      <div className={`App ${state.theme == 'light' ? "light" : "dark"}`}>
        <Bootstrap.Container>
          <NavbarComponent />
          <BrowserRouter>
          <Routes>
            <Route path='/' exact element={<Main/>}/>
            <Route path='/reviews' exact element={<MyReviews/>}/>
          </Routes>
          </BrowserRouter>
        </Bootstrap.Container>
      </div>
    </Context.Provider>
  );
}

export default App;
