import { useState, useEffect } from "react"
import { useSelector } from 'react-redux';
import { EditableReview } from './editable-review'
import { StarRating } from './star-rating'
import {Container, Row, Col, Image} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faHeart, faPenToSquare  } from '@fortawesome/free-solid-svg-icons'
import MDEditor from '@uiw/react-md-editor';
import { useHttp } from '../hooks/http.hook'
import { useParams, useNavigate } from "react-router-dom";

export const ReviewBlock = (props) => {

  const user_id = useSelector((state) => state.user_id)
  const isAuthenticated = useSelector((state) => state.isAuthenticated)
  const textToSearch = useSelector((state) => state.textToSearch)
  const [rating, setRating] = useState(0)
  const [likes, setLikes] = useState(0)
  const [edit, setEdit] = useState(false)
  const [isShown, setIsShown] = useState(false)
  const [tags, setTags] = useState([])
  const [images, setImages] = useState([])
  const [isLiked, setIsLiked] = useState(false)
  const history = useNavigate();
  const request = useHttp()
  useEffect(()=> {
    getRating()
    getTags()
    getImages()
  }, [props.isAuthenticated])
  const onStarClick = (newRating) => {
    setRating(newRating)
  }

  const getTags = async () => {
    const data = await request('/api/get-tags', 'POST', { review_id: props.id })
     setTags(data)
  }

  const getImages = async () => {
    const data = await request('/api/get-images', 'POST', { review_id: props.id })
     setImages(data)
  }

  const getRating = async () => {
    const data = await request('/api/get-rating', 'POST', {review_id: props.id, user_id: props.user_id })
    console.log(data);
    setRating(data.rating)
    setIsLiked(data.all_likes)
    setIsLiked(data.isUser)
  }

  const removeReview = (id) => {
    console.log('reveerev');
    props.removeReview(id)
  }
  const updateReview = (id, name, text, category) => {
    console.log(id, name, text);
    props.updateReview(id, name, text, category)
  }
  const changeRating = async (e, newRating) => {
    if(isAuthenticated){
      e.stopPropagation()
      if(newRating) setRating(newRating)
      else setIsLiked(!isLiked)
      const data = await request('/api/change-rating', 'POST', {
        review_id: props.id,
        user_id: props.user_id,
        isLiked: isLiked,
        rating: newRating? newRating : rating,
      })
    }
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
      onClick={() => { history('/', { state: { tag: item.tag_value } })}}
      key={item.id}
      className='tag'>{item.tag_value}</span>
  ))
  return (
    <div
      className='reviewBlock'
      onClick={() => setIsShown(!isShown)}>

    { !edit ?
      (<Container>
        <Row className="review-header" rating={rating}>
        <Col md={7} sm={10}>
          <h3>{props.name}</h3>
        </Col>
        <Col md={5} sm={10}>
          <div style={{display: "flex", alignItems: "center"}}>
            {props.all_likes}
            <FontAwesomeIcon
              name='likeButton'
              style={{color: isLiked? 'red' : 'gray'}}
              onClick={changeRating}
              className='red-color'
              icon={  faHeart} />
              {rating}

                <StarRating
                  isAuthenticated={isAuthenticated}
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
          </Col>
        </Row>
        <div>
          {"Category:" + props.category}
        </div>
        <div>{tagsToRender}</div>
        {isShown && <>
          <MDEditor.Markdown source={
            props.text.replace(/\(#xpzR2\)+/g, '"').replace(textToSearch, `<span className="findedText">${textToSearch}</span>`)
          } />
          <div className='review-images'>
            {imagesToRender}
          </div></>}
      </Container>) : (
      <EditableReview
        category={props.category}
        setEdit={setEdit}
        removeReview={removeReview}
        updateReview={updateReview}
        id={props.id}
        name={props.name}
        text={props.text}
        rating={props.rating}
        tags={tags.map(item => item =item.tag_value)}
        images={images}
        />
    )}
  </div>
  );
}
