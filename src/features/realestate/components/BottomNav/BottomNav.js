import React, { useState } from 'react';
import './BottomNav.css';
import { HeartOutlined, HomeOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { PostForm } from '../PostForm/PostForm';
import  firebase from '../../services/firebaseConfig';
import { useNavigate,Link, useLocation } from 'react-router-dom';

export const BottomNav = () => {
	const  navigate = useNavigate();
	const [isPostModalVisible, setPostIsModalVisible] = useState(false);
	const location = useLocation();

	const redirectToAccount = () => {
		firebase.auth().onAuthStateChanged(user => {
			
			// Assuming you retrieve the user ID from Firebase Auth
			if (user && user.uid) {
			navigate(`/account/${user.uid}`)
			}else{
               navigate('/login');
			}
		})
		
	  };

	const openPostOrConnect = () => {
		firebase.auth().onAuthStateChanged(user => {
			if(user){
				setPostIsModalVisible(true);
			  }else{
				navigate('/login');
			  }
		})
	
	  }
  
	  const handlePostCancelModal = () => {
		setPostIsModalVisible(false);
	  };


    return(
		

		<div className="BottomNav">
		<div className='d-flex justify-content-between align-items-center'>
			<div style={{width: '30%'}} className='d-flex justify-content-between align-items-center'>
				<div className='text-center'>
				<Link to={'/'} className={ location.pathname ===  '/' ? 'nav-bottom-active text-center nav-bottom-link ': 'text-center nav-bottom-link text-muted' } >
					<span className='nav-btn' ><HomeOutlined style={{fontSize: '22px'}}  /></span>
				</Link>
				
				</div>
				<div className='text-center'>
				<Link to={'/favorites'} className={ location.pathname ===  '/favorites' ? 'nav-bottom-active text-center nav-bottom-link': 'text-center nav-bottom-link text-muted'} >
					<span className='nav-btn' ><HeartOutlined style={{fontSize: '22px'}}  /></span>
				</Link>
				</div>
			</div>
			<div>
				<button className='plus-btn' onClick={() => openPostOrConnect()}><PlusOutlined style={{fontSize: '22px'}}  /></button>
			</div>
			<div style={{width: '30%'}} className='d-flex justify-content-between align-items-center'>
			<div>
			<Link to={'/services'} className={ location.pathname ===  '/services' ? 'nav-bottom-active text-center nav-bottom-link': 'text-center nav-bottom-link text-muted'} >
				<span className='nav-btn' ><i className='fa fa-suitcase' style={{fontSize: '22px'}}  aria-hidden="true" /></span>
			</Link>
			</div>
			<div onClick={() => redirectToAccount()} className={ location.pathname.includes('account') ? 'nav-bottom-active text-center nav-bottom-link': 'text-center nav-bottom-link text-muted'}>
				<span className='nav-btn'><UserOutlined style={{fontSize: '22px'}}  /></span>

			</div>
			</div>
			
		</div>
		<Modal
			title="Ajouter une annonce"
			visible={isPostModalVisible}
			onCancel={handlePostCancelModal}
			maskClosable={true}
			bodyStyle={{padding:'4px'}}
			footer={false}>
			<PostForm closeModel={handlePostCancelModal} />
		</Modal>
		</div>)
}