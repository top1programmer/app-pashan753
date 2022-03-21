import './App.css';
import { useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavbarComponent } from './components/navbar'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { Main } from './components/main'
import { MyReviews } from './components/myReviews'
import { AdminPanel } from './components/adminPanel'
import './style/style.css'

function App() {
const theme = useSelector((state) => state.theme)
const role = useSelector((state) => state.role)

  return (
      <div className={`App ${theme}`}>
        <Container>
          <NavbarComponent/>
          <BrowserRouter>
          {role === 'admin'?
            (<Routes>
              <Route path='/' exact element={<AdminPanel />}/>
              <Route path='/reviews/:userEmail' element={<MyReviews/>}/>
            </Routes>) : (
            <Routes>
              <Route path='/' exact element={<Main/>}/>
              <Route path='/reviews' exact element={<MyReviews/>}/>
            </Routes>
            )
          }

          </BrowserRouter>
        </Container>
      </div>
  );
}

export default App;
