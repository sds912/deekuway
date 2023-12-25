import React, { useState } from 'react';
import './NavBar.css';
import { Avatar, Modal } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { Authentification } from '../Authentification/Authentification';
import  firebase from '../../services/firebaseConfig';
import { PostForm } from '../PostForm/PostForm';


const NavBar = () => {

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isPostModalVisible, setPostIsModalVisible] = useState(false);


    const openPostOrConnect = () => {
      if(firebase.auth().currentUser){
        setPostIsModalVisible(true);
      }else{
        setIsModalVisible(true);
      }
    };
  
    const handleCancelModal = () => {
      setIsModalVisible(false);
    };

    const handlePostCancelModal = () => {
      setPostIsModalVisible(false);
    };
  
    const closePostOrConnect = () => {
      setIsModalVisible(false);
    };

  return (
    <div className='d-flex bg-light p-2 justify-content-between align-items-center px-5'>
       <div>
        <span>Deekuway</span>
       </div>
       
       <div>
          <button className='btn btn-warning me-5' onClick={openPostOrConnect}>Créer une annonce</button>
          <BellOutlined />
          {firebase.auth().currentUser && <Avatar size={26} icon={<UserOutlined />} className='ms-3' />}
          
       </div>
       <Modal
        title="Authentification"
        visible={isModalVisible}
        onCancel={handleCancelModal}
        footer={false}
        style={{top: 20}}
      >
        <Authentification />
      </Modal>

      <Modal
        title="Ajouter une annonce"
        visible={isPostModalVisible}
        onCancel={handlePostCancelModal}
        footer={false}
        style={{top: 20}}
      >
        <PostForm />
      </Modal>
    </div>
  );
};

export default NavBar;
