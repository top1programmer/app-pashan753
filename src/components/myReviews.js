import { useState, useContext, useEffect } from 'react'
import { ReviewBlock } from './review-block'
import { EditableReview } from './editable-review'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faArrowLeft, faPlus  } from '@fortawesome/free-solid-svg-icons'
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col} from 'react-bootstrap';

export const MyReviews = (props) => {

  const stateRedux = useSelector((state) => state)
  let languageSettings = require(`../languageSettings/${stateRedux.language}.json`)
  const  { userEmail } = useParams()
  const history = useNavigate();
  const [reviews, setReviews ] = useState([])
  const [isVisible, setIsVisible ] = useState(false)
  useEffect(()=> {
      getReviews()
  }, [stateRedux.textToSearch, stateRedux.filter])
  const getReviews = async () => {
    try {
      const response = await fetch('/api/get-reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userEmail? userEmail : stateRedux.email,
        textToSearch: stateRedux.textToSearch,
        user_id: stateRedux.user_id
      })
    }).then(res => res.json()).then(data => {
      if(data)
      setReviews(data.result)
    })
  }
  catch(err) {console.log(err.message)}
  }

  const changeVisibility = () => {
    setIsVisible(!isVisible)
  }

  const createReview = () => {
    changeVisibility()
    // setReviews(prevState => {{
    //
    // }, ...prevState);
    getReviews()
  }

  const filtreredReviews = [...reviews]
  if(stateRedux.filter === 'last'){
    filtreredReviews.sort((a,b) =>  {
      console.log(a.creation_date > b.creation_date);
      return Date.parse(b.creating_date) - Date.parse(a.creating_date)
    })
  } else if( stateRedux.filter === 'most-rated'){
    filtreredReviews.sort((a,b) =>  {
      console.log(a.creation_date > b.creation_date);
      return Date.parse(b.creating_date) - Date.parse(a.creating_date)
    })
  }

  const dataToShow = filtreredReviews.map( item => (
   <ReviewBlock
     editable={true}
     key={item.id}
     id={item.id}
     user_id={item.user_id}
     name={item.name}
     text={item.text}
     rating={item.rating}
     isAuthenticated={stateRedux.isAuthenticated}

     img_source={item.img_source}
   />
  ))
  return (
    <Row>
    <Col xs={1}>
      {userEmail !== undefined &&
          <FontAwesomeIcon
            className='backToAdminBtn'
            onClick ={() => history('/')}
            icon={faArrowLeft} />}
            <FontAwesomeIcon
              className='backToAdminBtn'
              onClick={changeVisibility}
              icon={faPlus} />

      </Col>
      <Col xs={11} style={{display: isVisible}}>
      { isVisible && <EditableReview
          setEdit={setIsVisible}
          create={stateRedux.email}
          createReview={createReview}
                      />}
      {reviews.length? dataToShow : <h2>{languageSettings.noReviews}</h2>}
      </Col>
    </Row>
  )
}
