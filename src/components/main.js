import {useState, useContext, useEffect } from 'react'
import { Context } from './context'
import { ReviewBlock } from './review-block'

export const Main = ( ) => {

  const {state} = useContext(Context)
  const [reviews, setReviews] = useState([])

  const getReviews = async () => {
    const response = await fetch('/api/get-reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => res.json()).then(data => setReviews(data.result));
  }
  console.log(reviews);
   if(reviews.length == 0)
    getReviews()
  const dataToShow = reviews.map( item => (
    <ReviewBlock
      key={item.id}
      id={item.id}
      user_id={item.user_id}
      name={item.name}
      text={item.text}
      rate={item.rate}
      isAuthenticated={state.isAuthenticated}
    />
  ))
  return (
    <>
      {dataToShow}
    </>
  )
}
