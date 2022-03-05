import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { useState, useContext } from 'react';
import { Navbar, Nav, Container, Row, Col, Form} from 'react-bootstrap';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { Context } from './context'

 export const NavbarComponent = () => {

  const { state, setState  } = useContext(Context);
  const [loginData, setLoginData] = useState(
    localStorage.getItem('loginData')
    ? JSON.parse(localStorage.getItem('loginData'))
    : undefined
  );
  const handleFailure = (result) => {
    alert(result);
  };
  const handleLogin = async (googleData) => {

    const res = await fetch('/api/google-login', {
      method: 'POST',
      body: JSON.stringify({
        token: googleData.tokenId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();

    setLoginData(data);
    setState(prevState => ({ ...prevState, isAuthenticated: true, email: data.email }))
    localStorage.setItem('loginData', JSON.stringify(data));
  };

  const handleLogout = () => {
    setState({ isAuthenticated: false });
    localStorage.removeItem('loginData');
    setLoginData(null);
  };

  function responseFacebook(response) {
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
              <Form.Control placeholder="search" />
            </Nav.Item>
          </Nav>
          <Nav>
              {loginData ? (
                <>
                <BootstrapSwitchButton
                  checked={false}
                  onlabel='Light'
                  offlabel='Dark'
                  onstyle="dark"
                  offstyle="light"
                  style="border"
                  width={100}
                  onChange={(checked: boolean) => {
                      setState(prevState =>  ({ ...prevState, theme: checked? "dark" : "light" }))
                  }}
                />
                    <Navbar.Text>
                      Signed in as : {loginData.email}
                    </Navbar.Text>
                  <Nav.Item>
                    <Nav.Link
                      href="#pricing"
                      onClick={handleLogout}>logout
                    </Nav.Link>
                  </Nav.Item>
                </>
              ) : (
                <>
                <FacebookLogin
                  appId="3215882551990420"
                  autoLoad={true}
                  fields="name,email,picture"
                  callback={responseFacebook} />,
                <GoogleLogin
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
