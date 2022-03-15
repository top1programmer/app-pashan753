import { useState, useEffect } from 'react'
import { MyReviews } from './myReviews'

export const AdminPanel = () =>{

  const [allUsers, setAllUsers] = useState([])
  const [showUser, setShowUser] = useState(' ')

  // useEffect(() => {
  //   fetch('/api/get-users', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //   }).then(res => res.json()).then(data => setAllUsers(data.result))
  // }, [allUsers])
  console.log('s', showUser);
  const displayUser = (email) => {
    if(showUser === ' ')
      setShowUser(email)
    else
      setShowUser(' ')
  }
  const getUsers = async () =>  {
    const response = await fetch('/api/get-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => res.json()).then(data => setAllUsers(data.result))
  }

  if(allUsers.length !== undefined && allUsers.length == 0)
    getUsers()

  const usersToRender = allUsers.map(item => (
    <div
      key={item.id}>
      <span>
        <a href={`/reviews/${item.email}`}>
          {item.email}
        </a>
      </span>
    </div>
  ))
  return (
    <>
      {usersToRender}
    </>
  )
}
