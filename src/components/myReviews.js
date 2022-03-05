import { useState, useContext } from 'react'
import { Context } from './context'
import { ReviewBlock } from './review-block'

export const MyReviews = () => {

  const {state} = useContext(Context)
  console.log('my', state);
  const [reviews, setReviews ] = useState([])
  const getReviews = async () => {
    const response = await fetch('/api/get-reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: state.email})
    }).then(res => res.json()).then(data => setReviews(data.result));
  }
  if(reviews.length == 0)
   getReviews()
  const dataToShow = reviews.map( item => (
   <ReviewBlock
     editable={true}
     key={item.id + item.user_id}
     id={item.id}
     user_id={item.user_id}
     name={item.name}
     text={item.text}
     rate={item.rate}
     isAuthenticated={state.isAuthenticated}
   />
  ))
  return (
    <div>
      {dataToShow}
    </div>
  )
}
