import { useState, useEffect, useCallback } from 'react'
import { MyReviews } from './myReviews'
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark  } from '@fortawesome/free-solid-svg-icons'
import { Button} from 'react-bootstrap';
import { useHttp } from '../hooks/http.hook'
export const AdminPanel = () =>{

  const [allUsers, setAllUsers] = useState([])
  const [showUser, setShowUser] = useState(' ')
  const languageSettings = useSelector((state) => state.languageSettings)
  const theme = useSelector((state) => state.theme)
  const request = useHttp()
  useEffect(() => {
    getUsers()
  }, [])
  const displayUser = (email) => {
    if(showUser === ' ')
      setShowUser(email)
    else
      setShowUser(' ')
  }
  const getUsers = async () =>  {
    const data = await request('/api/get-users', 'POST')
    console.log(data);
    console.log(allUsers);
    setAllUsers(data)
  }

  const makeAdmin = async (e) => {
    const data = await request('/api/make-admin', 'POST', {id: e.target.name})
    let tempArr = [...allUsers]
    tempArr = tempArr.map(item => {
      if(item.id === e.target.name)
        item.role = "admin"
    })
    setAllUsers(tempArr)
    console.log(data);
  }
  const removeUser = async (e) => {
    console.log(e.target.id);
    let tempArr = allUsers.filter(item => item.id != e.target.id)
    console.log(tempArr);
    setAllUsers(tempArr)
    //const data = await request('/api/remove-user', 'POST', {id: e.target.name})
    //console.log(data);
  }

  const usersToRender = allUsers.map(item => (
    <div
      className="userList"
      key={item.id}>
        <a href={`/reviews/${item.id}`}>
        <span>
          { item.role === 'admin' ? `${item.email} (admin)` : item.email}
          </span>
        </a>
      <div>
      {item.role !== 'admin' && <Button
        variant={theme}
        name={item.id}
        onClick={makeAdmin}>{languageSettings.makeAdmin}</Button>}
      <Button
        id={item.id}
        onClick={removeUser}
        variant={theme}><FontAwesomeIcon icon={faXmark} /></Button>
</div>
    </div>
  ))
  return (
    <>
      {usersToRender}
    </>
  )
}
