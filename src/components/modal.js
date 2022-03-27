import {Container, Row, Col, Image, Form, Button, Modal} from 'react-bootstrap';
import { useSelector } from 'react-redux'

export const VerticallyCenteredModal = (props) => {

  const languageSettings = useSelector((state) => state.languageSettings)

  const removeReview = async () => {
    props.onHide()
    await props.removeReview();
  }

  return (
    <Modal
      props={props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.modalAction ==='alert'? languageSettings.onMissingText : languageSettings.onRemoveReview}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
        {props.modalAction ==='alert'? languageSettings.enterSomeText : languageSettings.confirmRemove}
        </p>
      </Modal.Body>
      <Modal.Footer>
          <Button
            variant="secondary"
            onClick={props.onHide}>{languageSettings.cancel}</Button>{' '}
          <Button onClick={removeReview}>Remove</Button>{' '}

      </Modal.Footer>
    </Modal>
  );
}
