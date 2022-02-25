import { useState } from "react"
import * as Bootstrap from 'react-bootstrap';
import ReactStars from "react-rating-stars-component";

export const ReviewBlock = () => {
  const [rating, setRating] = useState(0)

  const onStarClick = (newRating) => {
    setRating(newRating)
  }

  return (
  <Bootstrap.Container className='reviewBlock'>
      <div className="review-header">
        <h3>hello</h3>
      <div>
      <ReactStars
          className="rating"
          count={5}
          onChange={onStarClick}
          size={25}
          activeColor="#ffd700"
        />
      </div>
      </div>
      <p>asudghuasgyahcy7qwpctnpw8avcuoa c84ycvn8awpynvcuiagggggggg gggggggggg gggggggggggggggg
      aaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaa
      xxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxx</p>
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
