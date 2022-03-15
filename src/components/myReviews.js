import { useState, useContext } from 'react'
import { Context } from './context'
import { ReviewBlock } from './review-block'
import { EditableReview } from './editable-review'
import { useParams, useNavigate } from "react-router-dom";

export const MyReviews = () => {

  const {state} = useContext(Context)
  const  { userEmail } = useParams()
  const history = useNavigate();
  //console.log('my', state);
  const [reviews, setReviews ] = useState([])
  const [isVisible, setIsVisible ] = useState('none')

  const getReviews = async () => {
    const response = await fetch('/api/get-reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: userEmail? userEmail : state.email})
    }).then(res => res.json()).then(data => {
      data.result.map(item => {
        item.img_source = []
        item.img_source.push(item.source)
      })
      setReviews(data.result)
    });
  }
  const changeVisibility = () => {
    if(isVisible == 'none')
      setIsVisible('block')
    else
      setIsVisible('none')
  }

  const createReview = () => {
    changeVisibility()
    getReviews()
  }

  if(reviews !== undefined && reviews.length == 0)
   getReviews()
  const filtreredReviews = [...reviews]
  if(state.filter === 'last')
    filtreredReviews.sort((a,b) =>  {
      console.log(a.creation_date > b.creation_date);
      return Date.parse(b.creating_date) - Date.parse(a.creating_date)
    })
    //console.log(filtreredReviews);
  const dataToShow = filtreredReviews.map( item => (
   <ReviewBlock
     editable={true}
     key={item.id + item.user_id}
     id={item.id}
     user_id={item.user_id}
     name={item.name}
     text={item.text}
     rate={item.rate}
     isAuthenticated={state.isAuthenticated}
     count_likes={item.count_likes}
     img_source={item.img_source}
   />
  ))
  return (
    <div>
      {userEmail !== undefined && <button onClick={() => history('/')}>back</button>}
      <button onClick={changeVisibility}>+</button>
      <div style={{display: isVisible}}>
        <EditableReview
          create={state.email}
          createReview={createReview}
        />
      </div>
      {dataToShow}
    </div>
  )
}
