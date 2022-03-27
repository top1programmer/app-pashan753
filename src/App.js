import './App.css';
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavbarComponent } from './components/navbar'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { Main } from './components/main'
import { MyReviews } from './components/myReviews'
import { AdminPanel } from './components/adminPanel'
import {LoginComponent} from './components/login'
import './style/style.css'

function App() {
const theme = useSelector((state) => state.theme)
const role = useSelector((state) => state.role)

  return (
      <div className={`App ${theme}`}>
          <BrowserRouter>
          <NavbarComponent/>

          {role === 'admin'?
            (<Routes>
              <Route path='/' exact element={<AdminPanel />}/>
              <Route path='/reviews/:userId' element={<MyReviews/>}/>
            </Routes>) : (
            <Routes>
              <Route path='/' exact element={<Main/>}/>
              <Route path='/reviews' exact element={<MyReviews/>}/>
              <Route path='/users/login' element={<LoginComponent/>}/>
            </Routes>
            )
          }


          </BrowserRouter>
      </div>
  );
}

export default App;
