import React, { useEffect, useState } from 'react';
import './NavBar.css';
import { Avatar, Dropdown, Modal, Space, message } from 'antd';
import { BellOutlined, LockOutlined, UnlockFilled, UserOutlined } from '@ant-design/icons';
import { Authentification } from '../Authentification/Authentification';
import  firebase from '../../services/firebaseConfig';
import { PostForm } from '../PostForm/PostForm';
import logo from '../../../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { WARNING } from '../../../../app-constant';

const items = [
  {
    label: <div>
    <UserOutlined />
    <span  className='ms-2'>Mon compte</span> 
    </div>,
    key: 'account',
  },
  {
    type: 'divider',
  },
  {
    label: <div className='text-danger'>
    <UnlockFilled />
    <span className='ms-2'>Se déconnecter</span>
    
    </div>,
    key: 'disconnect',
  }
  
  ];

const NavBar = () => {

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isPostModalVisible, setPostIsModalVisible] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();



    const openPostOrConnect = () => {
      firebase.auth().onAuthStateChanged(user => {
        if(user){
          setPostIsModalVisible(true);
        }else{
          navigate('login');
        }
      })
     
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

  
    useEffect(() => {
      firebase.auth().onAuthStateChanged(setCurrentUser);
    },[])

  return (
    <div className='d-flex bg-light p-2 justify-content-between align-items-center px-5'>
       <div>
       <img width={65} src={logo} alt='logo' />
       </div>
       
       <div>

          <button className='btn fw-bold text-white me-5 ' style={{
            width: '150px',
            height: '36px',
            backgroundColor: WARNING
            }} onClick={openPostOrConnect}>
              Publier une annonce</button>
          <BellOutlined style={{fontSize: '22px'}} />
          {currentUser && 
          <Dropdown
						menu={{
						items,
						onClick: (e) => {
              if(e.key === 'account'){
							  navigate('/account/'+currentUser.uid);
						  } if(e.key === 'disconnect'){
                console.log('ok')
							  firebase.auth().signOut().then(() =>{
                  message.success('vous êtes déconnecté avec succès')
                })
                .catch(error =>{
                  message.error("Erreur de déconnexion")
                })
						  }
						}
						}}
						trigger={['click']}>
						<span className='pr-3' onClick={(e) => e.preventDefault()}>
						<Space>
              <Avatar  icon={<UserOutlined />} className='mx-4' />
						</Space>
						</span>
					</Dropdown>}
          {currentUser && <LockOutlined 
          onClick={() => {
           firebase.auth().signOut()
           .then(res => {
            message.success("Vous êtes déconnecté(e) ")
           })
           .catch(error => {
            message.error("Une erreur c'est produit")
           })
          }} size={36} /> }
          {!currentUser && 
          <button className='btn btn-outline' onClick={() => {
            navigate('/login')
          }}>
            Se connecter
          </button>}
          
       </div>
       <Modal
        title="Authentification"
        visible={isModalVisible}
        onCancel={handleCancelModal}
        footer={false}
        style={{top: 20}}
      >
        <Authentification closeModal={handleCancelModal} />
      </Modal>

      <Modal
        title="Ajouter une annonce"
        visible={isPostModalVisible}
        onCancel={handlePostCancelModal}
        footer={false}
        style={{top: 20}}
        
      >
        <PostForm closeModel={handlePostCancelModal} />
      </Modal>
    </div>
  );
};

export default NavBar;
