import {useState, useContext, useEffect } from 'react'
import { ReviewBlock } from './review-block'
import { useSelector, useDispatch } from 'react-redux';

export const Main = ( ) => {

  const stateRedux = useSelector((state) => state)
  const [reviews, setReviews] = useState([])
  useEffect(()=> {
      getReviews()
  }, [stateRedux.textToSearch])
  const getReviews = async () => {
    const response = await fetch('/api/get-reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        textToSearch: stateRedux.textToSearch,
      })
    }).then(res => res.json()).then(data => {

      if(data)
        setReviews(data.result)
    })
  }

  const dataToShow = reviews.map( item => (
    <ReviewBlock
      img_source={item.img_source}
      key={item.id}
      id={item.id}
      user_id={item.user_id}
      name={item.name}
      text={item.text}
      rating={item.rating}
      isAuthenticated={stateRedux.isAuthenticated}
    />
  ))

  return (
    <>
      {dataToShow}
    </>
  )
}
