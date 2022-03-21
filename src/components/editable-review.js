import { useState, useContext, useEffect, useCallback } from "react"
import {Container, Row, Col, Image, Form, Button} from 'react-bootstrap';
import ReactStars from "react-rating-stars-component";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faHeart, faPenToSquare, faXmark  } from '@fortawesome/free-solid-svg-icons'
import { MarkdownEditor } from './markdown-editor'
import {useDropzone} from 'react-dropzone'
import { Context } from './context'

export const EditableReview = (props) => {

  const [textValue, setTextValue] = useState(props.text || ' ')
  const [nameValue, setNameValue] = useState(props.name || ' ')
  const [tags, setTags] = useState(props.tags.join(' ') || ' ')
  const [images, setImages] = useState(props.images)
  const [files, setFiles] = useState([])
  const [imagesToRemove, setImagesToRemove] = useState([])
  const {state} = useContext(Context)
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
         setFiles(prevState => [...prevState, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const { getRootProps, getInputProps } = useDropzone({onDrop})
  useEffect(() => {
    console.log(files);
  }, [files])
  const uploadedImages = files.map((file, index) => (
      <img src={file} key={index} style={{ width: "200px" }} alt="preview" />
  ))
  const handleTagInput = (e) => {

    setTags(e.target.value)
  }
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
    let tagsForSave = tags.replace(/ +/g, " ").split(' ')
    let tagsToRemove = props.tags.filter(item => !tagsForSave.includes(item))
    let tagsToInsert = tagsForSave.filter(item => !props.tags.includes(item))
    props.setEdit(false)
    if(props.create){
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
            tagsToRemove: tagsToRemove,
            tagsToInsert: tagsToInsert,
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
            imagesToRemove: imagesToRemove,
            tagsToRemove: tagsToRemove,
            tagsToInsert: tagsToInsert,
          }
        )
      }).then(res => res.json()).then(props.setEdit(false))
    }
  }
  const removeImg = (index) => {

    let tempArr = [...images]
    setImagesToRemove([...imagesToRemove,tempArr.splice(index, 1)[0] ])
    console.log('temp',tempArr);
    console.log('rem', imagesToRemove);
    setImages(tempArr)

  }

  let imagesToRender = images.map((item, index) => (
    <span className='imageCard' style={{position: 'relative'}}>
   <Image
     key={item.id}
     fluid={true}
     rounded={true}
     src={item.source}/>
     <span
      onClick={() => removeImg(index)}
      className='removeImageBtn'>&#215;
     </span>
     </span>
 ))
  return (
    <Container className='reviewBlock'>
      <Button
        variant="primary"
        onClick={saveChanges}>{props.create? "Create" : "Save"}</Button>
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
            icon={ faHeart} />
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
          onChange={handleTagInput}
          value={tags}
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
