import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { useDispatch } from 'react-redux';
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button} from 'react-bootstrap';
import '../style/login.css'

export const LoginComponent = ({setLoginData}) => {
  const history = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  function responseFacebook(response) {
    console.log(response);
    const data = {
      name: response.name,
      email: response.email,
      picture: response.picture,
      user_id: response.user_id
    };

    dispatch({type: 'CHANGE_ISAUTHENTICATED', payload:{
      isAuthenticated: true,
      email: data.email,
      user_id: data.user_id,
      role: data.role,
    }})
    localStorage.setItem('loginData', JSON.stringify(data));
    history('/')
  }

  const handleLogin = async (googleData) => {
    await fetch('/api/google-login', {
      method: 'POST',
      body: JSON.stringify({
        token: googleData.tokenId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json()).then(data => {
      dispatch({type: 'CHANGE_ISAUTHENTICATED', payload:{
        isAuthenticated: true,
        email: data.email,
        user_id: data.user_id,
        role: data.role,
      }})
      localStorage.setItem('loginData', JSON.stringify(data));
      history('/')
    });
  };
  const handleFailure = (result) => {
    alert(result);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        password: password,
        email: email
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.json()).then(data => {
      // setLoginData(data);
      dispatch({type: 'CHANGE_ISAUTHENTICATED', payload:{
        isAuthenticated: true,
        email: data.email,
        user_id: data.user_id,
        role: data.role,
      }})
      localStorage.setItem('loginData', JSON.stringify(data));
      history('/')
    })
  }

  return (

    <Form className='loginArea' onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email" placeholder="Enter email"
          onChange={(e)=> setEmail(e.target.value)}/>
        <Form.Text className="text-muted">

        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          onChange={(e)=> setPassword(e.target.value)}
          type="password" placeholder="Password"/>
      </Form.Group>
      <Button variant="primary" type="submit">
        Log in
      </Button>
      <div className='loginWith'>
      <FacebookLogin
        className='loginbtn'
        appId="3215882551990420"
        autoLoad={false}
        fields="name,email,picture"
        callback={responseFacebook} />
      <GoogleLogin
        className='GoogleLogin'
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText="Log in with Google"
        onSuccess={handleLogin}
        onFailure={handleFailure}
        cookiePolicy={'single_host_origin'}
        prompt="select_account"
      ></GoogleLogin>
      </div>
    </Form>

  )
}
