import {useState, useContext, useEffect } from 'react'
import { ReviewBlock } from './review-block'
import { useSelector, useDispatch } from 'react-redux';
import { useHttp } from '../hooks/http.hook'
import { useParams, useLocation } from "react-router-dom";

export const Main = ( props) => {
  const request = useHttp()
  const { state } = useLocation();

  const isAuthenticated = useSelector((state) => state.isAuthenticated)
  const textToSearch = useSelector((state) => state.textToSearch)
  const filter = useSelector((state) => state.filter)
  const [reviews, setReviews] = useState([])
  useEffect(()=> {
    if(state && state.tag)
      getReviewsByTag()
    else
      getReviews()
  }, [textToSearch, isAuthenticated])

  const getReviews = async () => {
    const data = await request('/api/get-reviews', 'POST', {
      textToSearch: textToSearch || '',
    })
    setReviews(data)
  }

  const getReviewsByTag = async () => {
    const data = await request('/api/getReviewsByTag', 'POST', {
      tag: state.tag,
    })
    setReviews(data)
  }

  const filtreredReviews = [...reviews]
  if(filter === 'last'){
    filtreredReviews.sort((a,b) =>  {
      return Date.parse(b.creating_date) - Date.parse(a.creating_date)
    })
  } else if(filter === 'most-rated'){
    filtreredReviews.sort((a,b) =>  b.rate - a.rate)
  }

  const dataToShow = filtreredReviews.map( item => (
    <ReviewBlock
      category={item.category}
      key={item.id}
      id={item.id}
      user_id={item.user_id}
      name={item.name}
      text={item.text}
      all_likes={item.all_likes}
      rating={item.rate}
      isAuthenticated={isAuthenticated}
    />
  ))

  return (
    <>
      {dataToShow}
    </>
  )
}
