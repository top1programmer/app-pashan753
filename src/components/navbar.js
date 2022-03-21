import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { useState, useContext, useEffect } from 'react';
import { Navbar, Nav, Container, Row, Col, Form, Dropdown,
  DropdownButton, FormControl, InputGroup, Button} from 'react-bootstrap';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { Context } from './context'
import { useSelector, useDispatch } from 'react-redux';


 export const NavbarComponent = (props) => {

  const stateRedux = useSelector((state) => state)
  const dispatch = useDispatch()
  const [loginOptions, setLoginOptions] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [loginData, setLoginData] = useState(
    localStorage.getItem('loginData')
    ? JSON.parse(localStorage.getItem('loginData'))
    : undefined
  );
  const handleFailure = (result) => {
    alert(result);
  };


  let languageSettings = require(`../languageSettings/${stateRedux.language}.json`)
  console.log(languageSettings);
  console.log(stateRedux.language);
  useEffect(() => {
    // console.log('dodo');
    // languageSettings = require(`../languageSettings/${stateRedux.language}.json`)
  },[stateRedux.language])

  const handleLogin = async (googleData) => {
    console.log(googleData);
    const request = await fetch('/api/google-login', {
      method: 'POST',
      body: JSON.stringify({
        token: googleData.tokenId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json()).then(data => {
      console.log('log', data);
      setLoginData(data);
      dispatch({type: 'CHANGE_ISAUTHENTICATED', payload:{
        isAuthenticated: true,
        email: data.email,
        user_id: data.user_id,
        role: data.role,
      }})
      localStorage.setItem('loginData', JSON.stringify(data));
      console.log(localStorage.getItem('context'));
    });
  };

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
  };

  const handleFilterChange = (e) => {
    dispatch({type:"CHANGE_FILTER", payload: e.target.name})
    //console.log(e.target.name);
  }
  const handleLanguageChange = (e) => {
    dispatch({type:"CHANGE_LANGUAGE", payload: e.target.value})
    //console.log(e.target.name);
  }

  function responseFacebook(response) {
    console.log(response);
    const data = {
      name: response.name,
      email: response.email,
      picture: response.picture,
      user_id: response.user_id
    };

    setLoginData(data);
    dispatch({type: 'CHANGE_ISAUTHENTICATED', payload:{
      isAuthenticated: true,
      email: data.email,
      user_id: data.user_id,
      role: data.role,
    }})
    localStorage.setItem('loginData', JSON.stringify(data));
  }

  return  (
    <Navbar
      bg={stateRedux.theme}
      variant={stateRedux.theme}>
      <Container>
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
                {languageSettings.search}
              </Button>
              <DropdownButton
                variant="outline-secondary"
                title={languageSettings.filter}
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
              <Form.Select
                onChange={handleLanguageChange}
                aria-label="Default select example">
                <option></option>
                <option value="rus">rus</option>
                <option value="eng">eng</option>
              </Form.Select>
              </InputGroup>
            </Nav.Item>
            <Nav.Item>
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
          <Nav>
              {loginData ? (
                <>
                  <Navbar.Text>
                    {languageSettings.singnedInAs} : {loginData.email}
                  </Navbar.Text>
                  <Nav.Item>
                    <Nav.Link
                      onClick={handleLogout}>{languageSettings.logout}
                    </Nav.Link>
                  </Nav.Item>
                </>
              ) : (
                <div>
                  <FacebookLogin
                    className='loginbtn'
                    appId="3215882551990420"
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={responseFacebook} />
                  <GoogleLogin
                    className='loginbtn'
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    buttonText="Log in with Google"
                    onSuccess={handleLogin}
                    onFailure={handleFailure}
                    cookiePolicy={'single_host_origin'}
                    prompt="select_account"
                  ></GoogleLogin>
                </div>
              )
            }
          </Nav>
    </Container>
  </Navbar>
  )
}
