import { useState, useContext, useEffect } from "react"
import { useSelector } from 'react-redux';
import { EditableReview } from './editable-review'
import { StarRating } from './star-rating'
import {Container, Row, Col, Image} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faHeart, faCoffee, faPenToSquare  } from '@fortawesome/free-solid-svg-icons'
import MDEditor from '@uiw/react-md-editor';

export const ReviewBlock = (props) => {

  const user_id = useSelector((state) => state.user_id)
  const isAuthenticated = useSelector((state) => state.isAuthenticated)
  const [rating, setRating] = useState(0)
  const [edit, setEdit] = useState(false)
  const [isShown, setIsShown] = useState(false)
  const [tags, setTags] = useState([])
  const [images, setImages] = useState([])
  const [isLiked, setIsLiked] = useState(false)
  useEffect(()=> {
    getRating()
    getTags()
    getImages()
  }, [props.isAuthenticated])
  const onStarClick = (newRating) => {
    setRating(newRating)
  }

  const getTags = async () => {
    await fetch('/api/get-tags', {
      method: 'POST',
      body: JSON.stringify({
        review_id: props.id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json()).then(data => setTags(data.result))
  }
  const getImages = async () => {
    await fetch('/api/get-images', {
      method: 'POST',
      body: JSON.stringify({
        review_id: props.id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json()).then(data => setImages(data.result))
  }

  const getRating = async () => {
    await fetch('/api/get-rating', {
      method: 'POST',
      body: JSON.stringify({
        review_id: props.id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json()).then(data => {
      setRating(data.result.reduce((agr, item) => agr + item.rating, 0) /( data.result.length || 1))
       if(data.result.find(item => item.user_id == user_id ) && data.result.find(item => item.user_id == user_id ).like_value > 0)
        setIsLiked(true)
    })
  }

  const changeRating = async (e, newRating) => {
    e.stopPropagation()
    if(newRating) setRating(newRating)
    else setIsLiked(!isLiked)
    await fetch('/api/change-rating', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:  JSON.stringify(
        {
        review_id: props.id,
        user_id: props.user_id,
        isLiked: isLiked,
        rating: newRating,
      }
    )
    })
  }

  let imagesToRender = images.map(item => (
    <Image
      key={item.id}
      fluid={true}
      rounded={true}
      src={item.source}/>
  ))
  let tagsToRender = tags.map(item => (
    <span
    key={item.id}
    className='tag'>{item.tag_value}</span>
  ))
  return (
    <>
    { !edit ?
      (<Container
        className='reviewBlock'
        onClick={() => setIsShown(!isShown)}>
        <div className="review-header" rating={rating}>
          <h3>{props.name}</h3>
          <div style={{display: "flex"}}>
            <FontAwesomeIcon
              name='likeButton'
              style={{color: isLiked? 'red' : 'gray'}}
              onClick={changeRating}
              className='red-color'
              icon={  faHeart} />
              <StarRating
                isAuthenticated={isAuthenticated}
                changeRating={changeRating}
                rating={rating}/>
                <StarRating
                  count={5}
                  size={25}
                  value={rating}
                  activeColor ={'#febc0b'}
                  inactiveColor={'#ddd'}
                  changeRating={changeRating}  />

              { props.editable ?
                (<FontAwesomeIcon
                    style={{color: '#505'}}
                    onClick={() => {
                    setEdit(!edit)}}
                    icon={faPenToSquare}/>) : (<></>)
              }
          </div>
        </div>
        <div>{tagsToRender}</div>
        {isShown && <>
          <MDEditor.Markdown source={props.text} />
          <div className='review-images'>
            {imagesToRender}
          </div></>}
    </Container>) : (
      <EditableReview
        setEdit={setEdit}
        id={props.id}
        name={props.name}
        text={props.text}
        rating={props.rating}
        tags={tags.map(item => item =item.tag_value)}
        images={images}
        />
    )}
    </>
  );
}
