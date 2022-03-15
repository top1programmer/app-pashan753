import { useState, useContext, useEffect, useCallback } from "react"
import {Container, Row, Col, Image, Form, Button} from 'react-bootstrap';
import ReactStars from "react-rating-stars-component";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MarkdownEditor } from './markdown-editor'
import {  faHeart, faPenToSquare, faXmark  } from '@fortawesome/free-solid-svg-icons'
import useDrivePicker from 'react-google-drive-picker'
import {useDropzone} from 'react-dropzone'
import { Context } from './context'
export const EditableReview = (props) => {

  const [textValue, setTextValue] = useState(props.text || ' ')
  const [nameValue, setNameValue] = useState(props.name || ' ')
  const [images, setimages] = useState([1, 2, 3])
  const [files, setFiles] = useState([])
  const {state} = useContext(Context)

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
         setFiles(prevState => [...prevState, reader.result])
      }
      console.log('file', file.data);
      reader.readAsDataURL(file)
    })
    console.log('accepted', acceptedFiles);
    console.log('rejected', rejectedFiles);
  }, [])
  const { getRootProps, getInputProps } = useDropzone({onDrop})
  useEffect(() => {
    console.log(files);
  }, [files])
  const uploadedImages = files.map((file, index) => (
      <img src={file} key={index} style={{ width: "200px" }} alt="preview" />
  ))

  const removeReview = async () => {
    const request = await fetch('/api/remove-review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          id: props.id
        }
      )
    }).then((data)=>{
      props.createReview()
      setTextValue('')
      setNameValue('')
    })
  }
  const saveChanges = async () => {
    if(props.create){
      console.log('create', props.create);
      const request = await fetch('/api/create-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            user_id: state.user_id,
            name: nameValue,
            text: textValue,
            files: files,
          }
        )
      }).then((data)=>{
        props.createReview()
        setTextValue('')
        setNameValue('')
      })
    }
    else {
      const request = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body:  JSON.stringify(
          {
            id: props.id,
            name: nameValue,
            text: textValue,
            files: files,
          }
        )
      }).then(res => res.json()).then( it => {
        console.log(it);
        props.setEdit(false)})
    }
  }
  const removeImg = (e) => {
    setimages(currentImg => currentImg.filter((img, i) => i !== e.target.name))
  }

  const imagesToRender = images.map( (item, index) => (
    <>
      <Image
        key={index}
        src={'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg'}/>
    </>
  ))

  // <Button onClick={() => handleOpenPicker()}>Open Picker</Button>
  return (
    <Container className='reviewBlock'>
      <Button
        variant="primary"
        onClick={saveChanges}>Save</Button>
      <Button
        variant="light"
        onClick={() => props.setEdit(false)}>Cancel</Button>
      <Button
        onClick={removeReview}
        variant='danger'><FontAwesomeIcon icon={faXmark} /></Button>
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
              value={props.rating}
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
      <div style={{height: '300px', border: '1px dashed black'}}{...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drop files here</p>
      </div>
      <div>{files.length > 0 && uploadedImages}</div>
      <div className='review-images'>
      {imagesToRender}
      </div>
      </Container>
    )
  }
