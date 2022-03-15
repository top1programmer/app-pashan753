import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { useState, useContext, useEffect } from 'react';
import { Navbar, Nav, Container, Row, Col, Form, Dropdown,
  DropdownButton, FormControl, InputGroup} from 'react-bootstrap';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { Context } from './context'

 export const NavbarComponent = (props) => {

  const { state, setState  } = useContext(Context);
  const [loginData, setLoginData] = useState(
    localStorage.getItem('loginData')
    ? JSON.parse(localStorage.getItem('loginData'))
    : undefined
  );
  const handleFailure = (result) => {
    alert(result);
  };
  useEffect(() => {
    localStorage.setItem('context', JSON.stringify(state))
  },[state])
  const handleLogin = async (googleData) => {

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
      setState(prevState => ({ ...prevState, user_id: data.user_id,
         isAuthenticated: true, email: data.email, role: data.role }))
         console.log('login',state);
      localStorage.setItem('loginData', JSON.stringify(data));
      //localStorage.setItem('context', JSON.stringify(state));
      console.log(localStorage.getItem('context'));
    });
  };

  const handleLogout = () => {
    setState(prevState => ({ ...prevState, user_id: '',
     isAuthenticated: false, email: '' }))
    localStorage.removeItem('context');
    //localStorage.setItem('context', JSON.stringify(state));
    localStorage.removeItem('loginData');
    setLoginData(null);
  };

  const handleFilterChange = (e) => {
    console.log(e.target.name);
    setState(prevState => ({ ...prevState, filter: e.target.name }))
    localStorage.setItem('context', JSON.stringify(state));
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
    setState(prevState => ({ ...prevState, user_id: data.user_id,
      isAuthenticated: true, email: data.email }))
    localStorage.setItem('loginData', JSON.stringify(data));
    localStorage.setItem('context', JSON.stringify(state));
    //  console.log(response)
  }

  return  (
    <Navbar  bg={state.theme}  variant={state.theme}>
      <Container>
        <Nav className="me-auto">
            <Nav.Item as="li">
              <Nav.Link href="/">Home</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link href="/reviews">My revies</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
            <InputGroup className="mb-3">
              <Form.Control placeholder="search" />

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
              checked={state.theme === 'dark' ? true : false}
              onlabel='Light'
              offlabel='Dark'
              onstyle="dark"
              offstyle="light"
              style="border"
              width={100}
              onChange={(checked: boolean) => {
                  setState(prevState =>  ({ ...prevState, theme: checked? "dark" : "light" }))
                  console.log(state);
                      localStorage.setItem('context', JSON.stringify(state));

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
                <>
                <FacebookLogin
                  className='loginbtn'
                  appId="3215882551990420"
                  autoLoad={true}
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
                </>
              )
            }
          </Nav>
    </Container>
  </Navbar>
  )
}
