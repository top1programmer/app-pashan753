import './App.css';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { useState } from 'react';
import * as Bootstrap from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ReviewBlock} from './components/review-block'
import './style/style.css'

function App() {
  const [loginData, setLoginData] = useState(
    localStorage.getItem('loginData')
    ? JSON.parse(localStorage.getItem('loginData'))
    : null
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
    localStorage.setItem('loginData', JSON.stringify(data));
  };

  const handleLogout = () => {
    localStorage.removeItem('loginData');
    setLoginData(null);
  };

  function responseFacebook(response) {
    //  console.log(response)
  }
  const getit = async () => {
    const response = await fetch('/api/getitems', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => res.json()).then(data => console.log(data.result));
  }
  return (
    <div className="App">
      <Bootstrap.Container>
        <Bootstrap.Navbar>
        <Bootstrap.Container>
        <Bootstrap.Navbar.Collapse className="justify-content-end">
          {loginData ? (
            <Bootstrap.Navbar.Text>
              Signed in as: <span>{loginData.email}</span>
              <button onClick={handleLogout}>Logout</button>
            </Bootstrap.Navbar.Text>
          ) : (
            <div>
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
            </div>
          )
        }
      </Bootstrap.Navbar.Collapse>
      </Bootstrap.Container>
      </Bootstrap.Navbar>
      <ReviewBlock/>
      <button onClick={getit}>aaaa</button>
    </Bootstrap.Container>
  </div>
);
}

export default App;
