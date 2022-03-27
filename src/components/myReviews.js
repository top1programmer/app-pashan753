import { useState, useContext, useEffect } from 'react'
import { ReviewBlock } from './review-block'
import { EditableReview } from './editable-review'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faArrowLeft, faPlus  } from '@fortawesome/free-solid-svg-icons'
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Button} from 'react-bootstrap';
import { useHttp } from '../hooks/http.hook'

export const MyReviews = (props) => {

  const [reviews, setReviews ] = useState([])
  const [tags, setTags] = useState([])
  const [isVisible, setIsVisible ] = useState(false)
  const stateRedux = useSelector((state) => state)
  const  { userId } = useParams()
  const history = useNavigate();
  const request = useHttp()
  let languageSettings = require(`../languageSettings/${stateRedux.language}.json`)
  useEffect(()=> {
      getReviews()
      getTags()
  }, [stateRedux.textToSearch, stateRedux.filter])

  const getTags = async ( ) => {
    const data = await request('/api/get-tag-cloud', 'POST' )
    setTags(data)
    console.log(data);
  }

  const getReviews = async () => {
    try {
      const data = await request('/api/get-reviews', 'POST', {
        textToSearch: stateRedux.textToSearch,
        user_id: userId? userId : stateRedux.user_id,
      })
      setReviews(data)
  }
  catch(err) {console.log(err.message)}
  }

  const changeVisibility = () => {
    setIsVisible(!isVisible)
  }

  const createReview = (user_id, id, name, text, creating_date) => {
    changeVisibility()
    setReviews([{
      user_id, id, name, text, creating_date
    }, ...reviews])
  }

  const removeReview = ( id) => {
    console.log(id);
    let tempArr = reviews.filter(item => item.id !== id)
    setReviews(tempArr)
  }

  const updateReview = ( id, name, text, category) => {
    console.log(id);
    let index = reviews.findIndex( item => item.id === id)
    let tempArr = [...reviews]
    console.log(tempArr);
    tempArr[index].name = name
    tempArr[index].text = text
    tempArr[index].category = category
    console.log(tempArr);
    setReviews(tempArr)
  }

  const filtreredReviews = [...reviews]
  if(stateRedux.filter === 'last'){
    filtreredReviews.sort((a,b) =>  {
      console.log(a.creation_date > b.creation_date);
      return Date.parse(b.creating_date) - Date.parse(a.creating_date)
    })
  } else if( stateRedux.filter === 'most-rated'){
    filtreredReviews.sort((a,b) =>  b.rate - a.rate)
  }

  const dataToShow = filtreredReviews.map( item => (
   <ReviewBlock
    category={item.category}
    editable={true}
    key={item.id}
    id={item.id}
    user_id={item.user_id}
    name={item.name}
    text={item.text}
    rating={item.rating}
    isAuthenticated={stateRedux.isAuthenticated}
    removeReview={removeReview}
    updateReview={updateReview}
    img_source={item.img_source}
   />
  ))
  return (
    <Container>
    <div>
    {tags.map((item, key) => (
      <span
        onClick={() => { history('/', { state: { tag: item.tag_value } })}}
        key={item.id}
        className='tag'>{item.tag_value}</span>
    ))}
    </div>
      {userId !== undefined &&
        <Button
          onClick ={() => history('/')}
          variant="secondary">Back</Button>
      }
      <Button
        onClick={changeVisibility}
        variant="secondary">Add review</Button>
      { isVisible && <EditableReview
          setEdit={setIsVisible}
          create={stateRedux.email}
          createReview={createReview}/>
      }
      {reviews.length? dataToShow : <h2>{languageSettings.noReviews}</h2>}
    </Container>
  )
}
