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
  useEffect(()=> {console.log('aa');}, [state.isAuthenticated])
  const onStarClick = (newRating) => {
    setRating(newRating)
  }

  const handleLike = async () => {
    const request = await fetch('/api/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:  JSON.stringify(
        {
        id: props.id,
        user_id: props.user_id
      }
    )
    })
  }
  return (
    <>
    { !edit ?
      (<Container className='reviewBlock'>
        <div className="review-header">
          <h3>{props.name}</h3>
          <div style={{display: "flex"}}>
            <FontAwesomeIcon
              onClick={handleLike}
              className='red-color'
              icon={  faHeart} />
            <ReactStars
                className="rating"
                count={5}
                value={rating}
                onChange={onStarClick}
                edit={state.isAuthenticated}
                size={25}
                activeColor="#ffd700"
              />
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
          <Image
            fluid={true}
            rounded={true}
            src={'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg'}/>
          <Image src={'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg'}/>
          <Image src={'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg'}/>
        </div>
    </Container>) : (
      <EditableReview
        setEdit={setEdit}
        args={props}/>
    )}
    </>
  );
}
