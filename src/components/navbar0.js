
import { useState, useContext, useEffect } from 'react';
import { Navbar, Nav, Container, Row, Col, Form, Dropdown,
  DropdownButton, FormControl, InputGroup, NavDropdown, Button} from 'react-bootstrap';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons'
export const NavbarComponentTest = (props) => {

  const  history = useNavigate()
  const stateRedux = useSelector((state) => state)
  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState('')
  const [loginVisibility, setLoginVisibility] = useState(false)
  const [loginData, setLoginData] = useState(
    localStorage.getItem('loginData')
    ? JSON.parse(localStorage.getItem('loginData'))
    : undefined
  );
  const handleFailure = (result) => {
    alert(result);
  };
  let languageSettings = require(`../languageSettings/rus.json`)

  useEffect(() => {
    if(stateRedux.language)
      languageSettings = require(`../languageSettings/${stateRedux.language}.json`)
    else
      languageSettings = require(`../languageSettings/eng.json`)
  },[stateRedux.language])

  const handleFilterChange = (e) => {
    dispatch({type:"CHANGE_FILTER", payload: e.target.name})
    //console.log(e.target.name);
  }
  const handleLanguageChange = (e) => {
    dispatch({type:"CHANGE_LANGUAGE", payload: e.target.value})
    //console.log(e.target.name);
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
    <Navbar bg="light" expand="lg">
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
                placeholder="search"
                value={searchValue}
                onChange={(e)=> setSearchValue(e.target.value)}/>
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
                align="end"
              >
                <Dropdown.Item
                  onClick={handleFilterChange}
                  name='most-rated'href="#">most rated</Dropdown.Item>
                <Dropdown.Item
                  onClick={handleFilterChange}
                  name='last' href="#">last</Dropdown.Item>
              </DropdownButton>
              <DropdownButton
                variant="outline-secondary"
                title={languageSettings.language}
                id="input-group-dropdown-2"
                align="end"
              >
                <Dropdown.Item
                  onClick={handleLanguageChange}
                  value='eng'href="#">eng</Dropdown.Item>
                <Dropdown.Item
                  onClick={handleLanguageChange}
                  value='rus' href="#">rus</Dropdown.Item>
              </DropdownButton>
              </InputGroup>
            </Nav.Item>
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
