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
    }).then(res => res.json()).then(data => {
      let resArr = []
      for(let i = 0; i < data.result.length; i++ ){
        if(i == 0){
          resArr.push(data.result[0])
          resArr[0].img_source = []
          resArr[0].img_source.push(resArr[0].source)
          continue
        }
        if(data.result[i].id === resArr[resArr.length - 1].id){
          resArr[resArr.length - 1].img_source.push(data.result[i].source)
        }
        else{
          resArr.push(data.result[i])
          resArr[resArr.length - 1].img_source = []
          resArr[resArr.length - 1].img_source.push(resArr[resArr.length - 1].source)
        }
      }
      console.log(resArr);
      setReviews(resArr)
      // setReviews(data.result)
    })
  }

  if(reviews.length == 0){
    getReviews()
  }
console.log(reviews);
  const dataToShow = reviews.map( item => (
    <ReviewBlock
      img_source={item.img_source}
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
