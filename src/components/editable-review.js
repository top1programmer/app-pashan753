import { useState, useContext, useEffect, useCallback } from "react"
import {Container, Row, Col, Image, Form, Button} from 'react-bootstrap';
import ReactStars from "react-rating-stars-component";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faHeart, faPenToSquare, faXmark  } from '@fortawesome/free-solid-svg-icons'
import { MarkdownEditor } from './markdown-editor'
import {useDropzone} from 'react-dropzone'
import { useSelector } from 'react-redux';

export const EditableReview = (props) => {

  const [textValue, setTextValue] = useState(props.text || '')
  const [nameValue, setNameValue] = useState(props.name || '')
  const [tags, setTags] = useState(props.tags? props.tags.join(' ') : '')
  const [images, setImages] = useState(props.images || [] )
  const [files, setFiles] = useState([])
  const user_id = useSelector((state) => state.user_id)
  const language = useSelector((state) => state.language)
  const theme = useSelector((state) => state.theme)
  const [imagesToRemove, setImagesToRemove] = useState([])

  let languageSettings = require(`../languageSettings/${language}.json`)
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

  const removeUploadedImage = (index) => {
    let tempArr = [...files]
    tempArr = tempArr.filter((item, ind) => ind !== index)
    setFiles(tempArr)
  }
  const uploadedImages = files.map((file, index) => (
    <span className='imageCard' style={{position: 'relative'}}>
      <img src={file} key={index} style={{ width: "200px" }} alt="preview" />
      <span
       onClick={() => removeUploadedImage(index)}
       className='removeImageBtn'>&#215;
      </span>
    </span>
  ))
  //
  // let ttt = 'asfaff\nadaga\n\n\n'
  // let xxx = ttt.replace(/(?:\r\n|\r|\n)/g, '(#xpzR2)');
  // console.log('xxx',xxx);
  // let bbb = xxx.replace(/\(#xpzR2\)+/g, '\n')
  // console.log('bbb', bbb);

  const handleTagInput = (e) => {

    setTags(e.target.value)
  }
  const removeReview = async () => {
    if(props.id){
      await fetch('/api/remove-review', {
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
      props.setEdit(false)
    })
  } else props.setEdit(false)
  }

  const saveChanges = async () => {
    let tagsForSave = tags.replace(/ +/g, " ").trim().split(' ')
    props.setEdit(false)
    if(props.create){
      await fetch('/api/create-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            user_id: user_id,
            name: nameValue,
            text: textValue.replace(/(?:")/g, '(#xpzR2)'),
            files: files,
            tagsToInsert: tagsForSave,
          }
        )
      }).then(/*props.setEdit(false)*/ )
    }
    else {
      let tagsToRemove = props.tags.filter(item => !tagsForSave.includes(item))
      let tagsToInsert = tagsForSave.filter(item => !props.tags.includes(item))

      await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body:  JSON.stringify(
          {
            id: props.id,
            name: nameValue,
            text: textValue.replace(/(?:\r\n|\r|\n)+/g, '(#xpzR2)'),
            files: files,
            imagesToRemove: imagesToRemove,
            tagsToRemove: tagsToRemove,
            tagsToInsert: tagsToInsert,
          }
        )
      }).then(props.setEdit(false))
    }
  }
  const removeImg = (index) => {

    let tempArr = [...images]
    setImagesToRemove([...imagesToRemove,tempArr.splice(index, 1)[0] ])
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
    <div className={props.create ? "reviewBlock" : ""}>
      <Button
        variant="primary"
        onClick={saveChanges}>{props.create? languageSettings.create : languageSettings.save}</Button>
      <Button
        variant="light"
        onClick={() => props.setEdit(false)}>{languageSettings.cancel}</Button>
      <Button
        onClick={removeReview}
        variant='danger'><FontAwesomeIcon icon={faXmark} /></Button>
      <Container>
        <Form.Control
          className={theme}
          placeholder={languageSettings.enterName}
          onChange={(e)=> setNameValue(e.target.value)}
          value={nameValue}/>
        <p>
          <MarkdownEditor
            placeholder={languageSettings.enterText}
            textValue={textValue}
            setTextValue={setTextValue}/>
        </p>
        <div>
          <Form.Control
            className={theme}
            placeholder={languageSettings.enterTags}
            onChange={handleTagInput}
            value={tags}
          />
        </div>
        <div className="dropzone"{...getRootProps()}>
          <input {...getInputProps()} />
          <p>{languageSettings.dropFiles}</p>
        </div>
        <div>{files.length > 0 && uploadedImages}</div>
        <div className='review-images'>
        {imagesToRender}
        </div>
      </Container>
    </div>
  )
}
