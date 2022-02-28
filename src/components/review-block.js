import { useState, useContext, useEffect } from "react"
import * as Bootstrap from 'react-bootstrap';
import ReactStars from "react-rating-stars-component";
import { Context } from './context'

export const ReviewBlock = (props) => {
  const { isAuthenticated} = useContext(Context)
  const [rating, setRating] = useState(0)
  const onStarClick = (newRating) => {
    setRating(newRating)
  }
  useEffect(() => {

  }, [props.isAuthenticated])
  console.log('rev',props.isAuthenticated);
  return (
  <Bootstrap.Container className='reviewBlock'>
      <div className="review-header">
        <h3>{props.name}</h3>
      <div>
      <ReactStars
          className="rating"
          count={5}
          value={props.rate}
          onChange={onStarClick}
          edit={props.isAuthenticated}
          size={25}
          activeColor="#ffd700"
        />
      </div>
      </div>
      <p>{props.text}</p>
      <div>tags</div>
      <Bootstrap.Row className='review-images'>
      <Bootstrap.Image
        fluid={true}

        rounded={true}
        src={'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg'}/>
        <Bootstrap.Image src={'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg'}/>
        <Bootstrap.Image src={'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg'}/>
      </Bootstrap.Row>
  </Bootstrap.Container>
  );
}
