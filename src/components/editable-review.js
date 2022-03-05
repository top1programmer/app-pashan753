import { useState, useContext, useEffect } from "react"
import {Container, Row, Col, Image, Form} from 'react-bootstrap';
import ReactStars from "react-rating-stars-component";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MarkdownEditor } from './markdown-editor'
import {  faHeart, faCoffee, faPenToSquare  } from '@fortawesome/free-solid-svg-icons'

export const EditableReview = ({args, setEdit}) => {

  const [textValue, setTextValue] = useState(args.text)
  const [nameValue, setNameValue] = useState(args.name)
  const [images, setimages] = useState([1, 2, 3])

  const saveChanges = async () => {
    const request = await fetch('/api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:  JSON.stringify(
        {
          id: args.id,
          name: nameValue,
          text: textValue
        }
      )
    }).then(setEdit(false))
  }
  const removeImg = (e) => {
    console.log(e.target.name);
    setimages(images.filter((item, index) => index !== e.target.name ))
  }
  const imagesToRender = images.map( (item, index) => (
    <div>
    <button
      name={index}
      onClick={removeImg}
      >delete</button>
    <Image
      key={index}
      src={'https://drive.google.com/file/d/1eSSfmG-dbmvXZmAKw-g_atj_nJFWALCC/view?usp=sharing'}/>
    </div>
  ))

  console.log(images);
  return (
    <Container className='reviewBlock'>
      <button onClick={saveChanges}>save</button>
      <div className="review-header">
          <Form.Control
            onChange={(e)=> setNameValue(e.target.value)}
            value={nameValue}
            />
        <div style={{display: "flex"}}>
          <FontAwesomeIcon
            className='red-color'
            icon={  faHeart} />
          <ReactStars
              className="rating"
              count={5}
              value={args.rating}
              edit={false}
              size={25}
              activeColor="#ffd700"
            />
        </div>
      </div>
      <p>
      <MarkdownEditor
        textValue={textValue}
        setTextValue={setTextValue}/>
      </p>
      <div>
        <Form.Control
          value='tags'
        />
      </div>
      <div className='review-images'>
        {imagesToRender}
      </div>
      </Container>
    )
  }
