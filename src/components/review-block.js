import { useState, useContext, useEffect } from "react"
import { EditableReview } from './editable-review'
import {Container, Row, Col, Image} from 'react-bootstrap';
import { Context } from './context'
import ReactStars from "react-rating-stars-component";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faHeart, faCoffee, faPenToSquare  } from '@fortawesome/free-solid-svg-icons'
import MDEditor from '@uiw/react-md-editor';

export const ReviewBlock = (props) => {
  const { state } = useContext(Context)
  const [rating, setRating] = useState(props.rate)
  const [edit, setEdit] = useState(false)
  const [isLiked, setIsLiked] = useState(props.count_likes == 0? false : true)
  console.log('item rerendered');
  console.log(props.isAuthenticated);
  useEffect(()=> {
  }, [props.isAuthenticated])
  const onStarClick = (newRating) => {
    setRating(newRating)
  }
  const handleLike = async () => {
    const tempState = isLiked
    setIsLiked(!isLiked)
    const request = await fetch('/api/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:  JSON.stringify(
        {
        review_id: props.id,
        user_id: props.user_id,
        isLiked: tempState,
      }
    )
    })
    console.log(isLiked);

  }


  let stars = {
    className:"rating",
    count: 5,
    value: rating,
    onChange: onStarClick,
    edit: props.isAuthenticated? true: false,
    size: 25,
    activeColor: "#ffd700"

  };

  // <ReactStars
  //     className="rating"
  //     count={5}
  //     value={rating}
  //     onChange={onStarClick}
  //     edit={props.isAuthenticated}
  //     size={25}
  //     activeColor="#ffd700"
  //   />
  let imagesToRender = props.img_source.map(item => (
    <Image
      fluid={true}
      rounded={true}
      src={item}/>
  ))
  return (
    <>
    { !edit ?
      (<Container className='reviewBlock'>
        <div className="review-header">
          <h3>{props.name}</h3>
          <div style={{display: "flex"}}>
            <FontAwesomeIcon
              style={{color: isLiked? 'red' : 'gray'}}
              onClick={handleLike}
              className='red-color'
              icon={  faHeart} />
            <ReactStars {...stars}       />
              { props.editable ?
                (<FontAwesomeIcon
                    style={{color: '#505'}}
                    onClick={() => setEdit(!edit)}
                    icon={faPenToSquare}/>) : (<></>)
              }
          </div>
        </div>
        <MDEditor.Markdown source={props.text} />
        <div>tags</div>
        <div className='review-images'>
          {imagesToRender}
        </div>
    </Container>) : (
      <EditableReview
        setEdit={setEdit}
        id={props.id}
        name={props.name}
        text={props.text}
        rate={props.rate}
        />
    )}
    </>
  );
}
