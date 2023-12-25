import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

function TakePhoto(props) {
  const [photoTaken, setPhotoTaken] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [photoDataUri, setPhotoDataUri] = useState('');

  function handleTakePhoto(dataUri) {
    setPhotoDataUri(dataUri);
    setPhotoTaken(true);
    setModalVisible(true);
  }

  function handleValidate() {
    // Do something with the photo data (photoDataUri)
    console.log('Photo validated:', photoDataUri);
    setModalVisible(false);
    setPhotoTaken(false);
  }

  function handleCancel() {
    setModalVisible(false);
    setPhotoTaken(false);
    setPhotoDataUri('');
  }

  return (
    <div style={{width: '340px'}}>
      <Camera  
	  isFullscreen={false}
	  idealFacingMode="environment"
	  onTakePhoto={(dataUri) => { handleTakePhoto(dataUri); }}
	  isImageMirror={false}
	  isMaxResolution={false}
	  isImageCapture={true}
	  sizeFactor={1}
	  imageCompression={0.97}
	  imageType="jpg"
	  isDisplayStartCameraError={true}
	  idealResolution={{ width: 340, height: 480 }}/>
      <Modal
        visible={modalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="validate" type="primary" onClick={handleValidate}>
            Validate
          </Button>,
        ]}
      >
        {photoTaken && <img src={photoDataUri} alt="Captured" style={{ maxWidth: '100%' }} />}
      </Modal>
    </div>
  );
}

export default TakePhoto;
