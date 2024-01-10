import React, { useState } from 'react';
import './BottomNav.css';
import { HeartOutlined, HomeOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { PostForm } from '../PostForm/PostForm';
import  firebase from '../../services/firebaseConfig';
import { Authentification } from '../Authentification/Authentification';
import { useNavigate,Link, useLocation } from 'react-router-dom';

export const BottomNav = () => {
	let navigate = useNavigate();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isPostModalVisible, setPostIsModalVisible] = useState(false);
	const location = useLocation();

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


    return(
		<div className="BottomNav border-top">
			<div className='d-flex justify-content-between align-items-center'>
				<div style={{width: '36%'}} className='d-flex justify-content-between align-items-center'>
					<div>
					<Link to={'/'} className={ location.pathname ===  '/' ? 'nav-bottom-active text-center nav-bottom-link ': 'text-center nav-bottom-link text-muted' } >
						<span className='nav-btn' ><HomeOutlined style={{fontSize: '22px'}}  /></span>
						<span className='mt-3' style={{fontSize: '12px'}}>Acceuil</span>
					</Link>
					
					</div>
					<div className='text-center'>
					<Link to={'/favorites'} className={ location.pathname ===  '/favorites' ? 'nav-bottom-active text-center nav-bottom-link': 'text-center nav-bottom-link text-muted'} >
						<span className='nav-btn' ><HeartOutlined style={{fontSize: '22px'}}  /></span>
						<span className='mt-3' style={{fontSize: '12px'}}>Favories</span>
					</Link>
					</div>
				</div>
				<div>
					<button className='plus-btn' onClick={() => openPostOrConnect()}><PlusOutlined style={{fontSize: '22px'}}  /></button>
				</div>
				<div style={{width: '36%'}} className='d-flex justify-content-between align-items-center'>
				<div>
				 <Link to={'/services'} className={ location.pathname ===  '/services' ? 'nav-bottom-active text-center nav-bottom-link': 'text-center nav-bottom-link text-muted'} >
					<span className='nav-btn' ><i class="fa fa-briefcase" style={{fontSize: '22px'}}  aria-hidden="true"></i></span>
					<span className=' mt-3' style={{fontSize: '12px'}}>Agences</span>
				</Link>
				</div>
				<div onClick={() => redirectToAccount()} className={ location.pathname.includes('account') ? 'nav-bottom-active text-center nav-bottom-link': 'text-center nav-bottom-link text-muted'}>
					<span className='nav-btn'><UserOutlined style={{fontSize: '22px'}}  /></span>
					<span className='mt-3' style={{fontSize: '12px'}}>Mon compte</span>

				</div>
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
				maskClosable={true}
				bodyStyle={{padding:'4px'}}
				footer={false}>
				<PostForm closeModel={handlePostCancelModal} />
			</Modal>
		</div>)
}