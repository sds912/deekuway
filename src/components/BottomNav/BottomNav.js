import React, { useState } from 'react';
import './BottomNav.css';
import { HomeOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { PostForm } from '../PostForm/PostForm';
import  firebase from '../../services/firebaseConfig';
import { Authentification } from '../Authentification/Authentification';
import { useNavigate,Link } from 'react-router-dom';

export const BottomNav = () => {
	let navigate = useNavigate();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isPostModalVisible, setPostIsModalVisible] = useState(false);

	const redirectToAccount = () => {
		const userId = firebase.auth().currentUser?.uid; // Assuming you retrieve the user ID from Firebase Auth
		if (userId) {
		  navigate(`/account/${userId}`)
		}
	  };

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


    return(
		<div className="BottomNav">
			<div className='d-flex justify-content-between'>
				<div>
				 <Link to={'/'} ><button className='btn'><HomeOutlined  /></button></Link>
				</div>
				<div>
					<button className='plus-btn' onClick={() => openPostOrConnect()}><PlusOutlined /></button>
				</div>
				<div>
					<button className='btn' onClick={() => redirectToAccount()}><UserOutlined /></button>
				</div>
			</div>
			<Modal
				title="Authentification"
				visible={isModalVisible}
				onCancel={handleCancelModal}
				footer={false}>
				<Authentification />
           </Modal>
			<Modal
				title="Ajouter une annonce"
				visible={isPostModalVisible}
				onCancel={handlePostCancelModal}
				footer={false}
				style={{top: 20}}>
				<PostForm closeModel={handlePostCancelModal} />
			</Modal>
		</div>)
}