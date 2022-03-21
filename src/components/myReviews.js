import { useState, useContext, useEffect } from 'react'
import { ReviewBlock } from './review-block'
import { EditableReview } from './editable-review'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faArrowLeft, faPlus  } from '@fortawesome/free-solid-svg-icons'
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col} from 'react-bootstrap';

export const MyReviews = (props) => {
  // let arr1 = [1, 2, 3, 4, 5, 6]
  // console.log([...arr1.slice(0, 2), ...arr1.slice(3, arr1.length)]);
  // console.log(arr1.splice(2, 1));
  const stateRedux = useSelector((state) => state)

  const  { userEmail } = useParams()
  const history = useNavigate();
  //console.log('my', state);
  const [reviews, setReviews ] = useState([])
  const [isVisible, setIsVisible ] = useState(false)
  useEffect(()=> {
      getReviews()
  }, [stateRedux.textToSearch, stateRedux.filter])
  const getReviews = async () => {
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

    //console.log(filtreredReviews);
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
  // style={{position: 'absolute', width: '80%',display: 'flex', justifyContent: 'space-between'}}
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
      {dataToShow}
      </Col>
    </Row>
  )
}
