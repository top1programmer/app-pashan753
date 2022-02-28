import {useState, useContext, useEffect } from 'react'
import { Context } from './context'
import { ReviewBlock } from './review-block'

export const Main = ( ) => {

  const {isAuthenticated} = useContext(Context)
  const [allReviews, setAllReviews] = useState([])

  const getReviews = async () => {
    const response = await fetch('/api/get-reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => res.json()).then(data => setAllReviews(data.result));
  }
   if(allReviews.length == 0)
    getReviews()
    console.log('main', isAuthenticated);
  const dataToShow = allReviews.map( item => (
    <ReviewBlock
      name={item.name}
      text={item.text}
      rate={item.rate}
      isAuthenticated={isAuthenticated}
    />
  ))
  return (
    <>
      {dataToShow}
    </>
  )
}
