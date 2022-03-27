import { useState, useContext, useEffect, useCallback } from "react"
import {Container, Row, Col, Image, Form, Button} from 'react-bootstrap';
import ReactStars from "react-rating-stars-component";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faHeart, faPenToSquare, faXmark  } from '@fortawesome/free-solid-svg-icons'
import { MarkdownEditor } from './markdown-editor'
import { VerticallyCenteredModal } from './modal'
import {useDropzone} from 'react-dropzone'
import { useSelector } from 'react-redux';
import { useHttp } from '../hooks/http.hook'

export const EditableReview = (props) => {

  const [textValue, setTextValue] = useState(props.text || '')
  const [nameValue, setNameValue] = useState(props.name || '')
  const [categoryValue, setCategoryValue] = useState(props.category || '')
  const [tags, setTags] = useState(props.tags? props.tags.join(' ') : '')
  const [images, setImages] = useState(props.images || [] )
  const [imagesToRemove, setImagesToRemove] = useState([])
  const [files, setFiles] = useState([])
  const user_id = useSelector((state) => state.user_id)
  const languageSettings = useSelector((state) => state.languageSettings)
  const theme = useSelector((state) => state.theme)
  const request = useHttp()
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
      props.setEdit(false)
      props.removeReview(props.id)
      await request('/api/remove-review', 'POST', { id: props.id })
    }

    else props.setEdit(false)
  }

  const saveChanges = async () => {
    if(nameValue !== '' && textValue !== ''){
      let tagsForSave = tags.replace(/ +/g, " ").trim().split(' ')
      console.log('tttt', tagsForSave);
      props.setEdit(false)
      if(!props.id){
        const data = await request('/api/create-review', 'POST', {
          user_id: user_id,
          name: nameValue,
          text: textValue.replace(/(?:")/g, '(#xpzR2)'),
          files: files,
          tagsToInsert: tagsForSave,
          category: categoryValue
        })
        props.setEdit(false)
        props.createReview(user_id, data, nameValue, textValue, Date.now() )
      }
      else {
        let tagsToRemove = props.tags.filter(item => !tagsForSave.includes(item))
        let tagsToInsert = tagsForSave.filter(item => !props.tags.includes(item))
        props.setEdit(false)
        console.log(props.updateReview);
        props.updateReview(props.id, nameValue, textValue, categoryValue )
        await request('/api/save', 'POST', {
          id: props.id,
          name: nameValue,
          text: textValue.replace(/(?:")/g, '(#xpzR2)'),
          files: files,
          imagesToRemove: imagesToRemove,
          tagsToRemove: tagsToRemove,
          tagsToInsert: tagsToInsert,
          category: categoryValue
        })
      }
    }
  }
  const removeImg = (index) => {

    let tempArr = [...images]
    setImagesToRemove([...imagesToRemove,tempArr.splice(index, 1)[0] ])
    setImages(tempArr)
  }

  let imagesToRender = images.map((item, index) => (
    <span
      key={item.id}
      className='imageCard'
      style={{position: 'relative'}}>
   <Image
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
        onClick={ removeReview}
        variant='danger'><FontAwesomeIcon icon={faXmark} /></Button>
      <Container>
        <Form.Control
          className={theme}
          placeholder={languageSettings.enterName}
          onChange={(e)=> setNameValue(e.target.value)}
          value={nameValue}/>
          <Form.Select
            value={props.category}
            size="sm"
            aria-label={categoryValue || "choose category"}
            onChange={(e)=> setCategoryValue(e.target.value)}>
            <option>Open this select menu</option>
            <option value="music">music</option>
            <option value="books">books</option>
            <option value="films">films</option>
            <option value="comics">comics</option>
          </Form.Select>

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
