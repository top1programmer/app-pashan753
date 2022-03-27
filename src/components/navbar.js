import { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Row, Col, Form, Dropdown,
  DropdownButton, FormControl, InputGroup, Button} from 'react-bootstrap';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons'
import { useHttp } from '../hooks/http.hook'

 export const NavbarComponent = (props) => {

  const  history = useNavigate()
  const request = useHttp()
  const stateRedux = useSelector((state) => state)
  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState('')
  const [suggestedRequests, setSuggestedRequests] = useState([])
  const [loginVisibility, setLoginVisibility] = useState(false)

  const [loginData, setLoginData] = useState(
    localStorage.getItem('loginData')
    ? JSON.parse(localStorage.getItem('loginData'))
    : undefined
  );

  const handleFailure = (result) => {
    alert(result);
  };
  let languageSettings = require(`../languageSettings/${stateRedux.language || 'eng'}.json`)
  useEffect(() => {
    if(stateRedux.language)
      languageSettings = require(`../languageSettings/${stateRedux.language}.json`)
    else
      languageSettings = require(`../languageSettings/eng.json`)
    dispatch({type:"SET_LANGUAGE_SETTINGS", payload: languageSettings})
  },[stateRedux.language])

  const handleFilterChange = (e) => {
    dispatch({type:"CHANGE_FILTER", payload: e.target.name})
  }
  const handleLanguageChange = (e) => {
    dispatch({type:"CHANGE_LANGUAGE", payload: e.target.name})
  }

  const onSearchInput = async (e) =>{
    setSearchValue(e.target.value)
    const data = await request('/api/suggest-request', 'POST', { searchValue })
    setSuggestedRequests(data)
  }

  const handleLogout = () => {
    dispatch({type: 'CHANGE_ISAUTHENTICATED', payload:{
      isAuthenticated: false,
      email: '',
      user_id: '',
      role: 'user',
    }})
    localStorage.removeItem('context');
    localStorage.removeItem('loginData');
    setLoginData(null);
    history('/')
  };


  return  (
    <Navbar className={stateRedux.theme} variant={stateRedux.theme} expand="lg">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          {stateRedux.role !== 'admin' && stateRedux.isAuthenticated && <><Nav.Item as="li">
            <Nav.Link href="/">{languageSettings.home}</Nav.Link>
          </Nav.Item>
          <Nav.Item as="li">
            <Nav.Link href="/reviews">{languageSettings.myReviews}</Nav.Link>
          </Nav.Item></>}
            <Nav.Item as="li">
            <InputGroup className="mb-3">
              <Form.Control
                className={stateRedux.theme}
                placeholder={languageSettings.search}
                value={searchValue}
                onChange={onSearchInput}/>
                <datalist id="data">
                 {suggestedRequests.map((item, key) =>
                   <option key={key} value={item.text} />
                 )}
               </datalist>
              <Button
                variant="outline-secondary"
                onClick={()=> dispatch({type:"CHANGE_SEARCH", payload: searchValue})}>
                <FontAwesomeIcon
                  icon={  faMagnifyingGlass} />
              </Button>
              <DropdownButton
                variant="outline-secondary"
                title={<FontAwesomeIcon icon={faFilter} />}
                id="input-group-dropdown-2"
                align="end" >
                  <Dropdown.Item
                    onClick={handleFilterChange}
                    name='most-rated'href="#">most rated</Dropdown.Item>
                  <Dropdown.Item
                    onClick={handleFilterChange}
                    name='last' href="#">last</Dropdown.Item>
              </DropdownButton>

              </InputGroup>
            </Nav.Item>
            <Nav.Item style={{display: 'flex'}}>
            <DropdownButton
              variant="outline-secondary"
              title={languageSettings.language}
              id="input-group-dropdown-2"
              align="end">
              <Dropdown.Item
                onClick={handleLanguageChange}
                name='eng'href="#">eng</Dropdown.Item>
              <Dropdown.Item
                onClick={handleLanguageChange}
                name='rus' href="#">rus</Dropdown.Item>
            </DropdownButton>
            <BootstrapSwitchButton
              checked={stateRedux.theme === 'dark' ? true : false}
              onlabel={languageSettings.light}
              offlabel={languageSettings.dark}
              onstyle="dark"
              offstyle="light"
              style="border"
              width={100}
              onChange={(checked: boolean) => {
                  localStorage.setItem('context', JSON.stringify(stateRedux));
                  dispatch({type:"CHANGE_THEME", payload: checked? "dark" : "light"})
              }}
            />
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
        {stateRedux.email ? (
          <>
          <Nav.Item>
            <Navbar.Text>
              {languageSettings.singnedInAs} : {stateRedux.email}
            </Navbar.Text>
            <Nav.Item>
              <Nav.Link
                onClick={handleLogout}>{languageSettings.logout}
              </Nav.Link>
            </Nav.Item>
            </Nav.Item>
          </>
        ) : (
          <div>
            <Nav.Item>
              <Nav.Link
                href="/users/login">
                log in
              </Nav.Link>
            </Nav.Item>
          </div>
        )
      }
      </Container>
    </Navbar>

  )
}
