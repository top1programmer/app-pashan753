import './App.css';
import { useState, useContext } from 'react';
import * as Bootstrap from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavbarComponent } from './components/navbar'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { Context } from './components/context'
import { Main } from './components/main'
import { MyReviews } from './components/myReviews'
import { AdminPanel } from './components/adminPanel'
import './style/style.css'

function App() {
const {state, setState} =useContext(Context)

//  console.log('app', state);
  return (
      <div className={`App ${state.theme == 'light' ? "light" : "dark"}`}>
        <Bootstrap.Container>
          <NavbarComponent />
          <BrowserRouter>
          {state.role === 'admin'?
            (<Routes>
              <Route path='/' exact element={<AdminPanel/>}/>
              <Route path='/reviews/:userEmail' element={<MyReviews/>}/>
            </Routes>) : (
            <Routes>
              <Route path='/' exact element={<Main/>}/>
              <Route path='/reviews' exact element={<MyReviews/>}/>
            </Routes>
            )
          }

          </BrowserRouter>
        </Bootstrap.Container>
      </div>
  );
}

export default App;
