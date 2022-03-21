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
  console.log('s', stateRedux);
  const dispatch = useDispatch()
  // const { state, setState  } = useContext(Context);
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
    console.log(e.target.name);
    // setState(prevState => ({ ...prevState, filter: e.target.name }))
    // localStorage.setItem('context', JSON.stringify(state));
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
    // localStorage.setItem('context', JSON.stringify(state));
  }

  return  (
    <Navbar  bg={stateRedux.theme}  variant={stateRedux.theme}>
      <Container>
        <Nav className="me-auto">
            {stateRedux.role !== 'admin' && stateRedux.isAuthenticated && <><Nav.Item as="li">
              <Nav.Link href="/">Home</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link href="/reviews">My revies</Nav.Link>
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
                Button
              </Button>
              <DropdownButton
                variant="outline-secondary"
                title="filter"
                id="input-group-dropdown-2"
                align="end"
              >
                <Dropdown.Item
                  onClick={handleFilterChange}
                  name='most-rated'href="#">most rated</Dropdown.Item>
                <Dropdown.Item
                  onClick={handleFilterChange}
                  name='last' href="#">last</Dropdown.Item>
                <Dropdown.Item
                  onClick={handleFilterChange}
                  name='else' href="#">Something else here</Dropdown.Item>
              </DropdownButton>
              </InputGroup>
            </Nav.Item>
            <Nav.Item>
            <BootstrapSwitchButton
              checked={stateRedux.theme === 'dark' ? true : false}
              onlabel='Light'
              offlabel='Dark'
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
                      Signed in as : {loginData.email}
                    </Navbar.Text>
                  <Nav.Item>
                    <Nav.Link
                      onClick={handleLogout}>logout
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
