import React, { useState } from 'react';
import './PostCard.css';
import { Avatar, Card, Dropdown, Modal, Space, Tag, Typography, message } from 'antd';
import {CloseCircleOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined, LikeOutlined, MoreOutlined} from '@ant-design/icons';
import firebase from '../../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import sofa from '../../assets/sofa.svg';
import bed from '../../assets/bed.svg';
import kitchen from '../../assets/kitchen.svg';
import bathroom from '../../assets/bathroom.svg';
import toilet from '../../assets/toilet.svg';
import Loader from '../Loader/Loader';
import Moment from 'react-moment';

const { Text } = Typography;

export const PostCard = ({
	postToHomePage, 
	post,
	selectedPost,
	reloadData,
	inFavorite, 
	openImageViewer, 
	screen}) => {
	const items = [
		{
		  label: <div>
			<EditOutlined />
			<span  className='ms-2'>Modifier</span> 
		  </div>,
		  key: 'edit',
		},
		{
			type: 'divider',
		},
		{
		  label: <div className='text-danger'>
			<DeleteOutlined />
			<span className='ms-2'>Supprimer</span>
			
		  </div>,
		  key: 'delete',
		}
		
	  ];
	const navigate = useNavigate();
	const [messageApi, mcontextHolder] = message.useMessage();
	const [loading, setLoading] = useState(false);
	const [modal, contextHolder] = Modal.useModal();

   

	  
	  const onPostClicked = (post) => {
		if (post !== null && post !== undefined && post.id !== undefined && post.id !== null && screen === 'home') {
		  postToHomePage(post);
		  navigate('/posts/' + post.id);
		}
	  };
	
	  const addToFavorites = async (event, post) => {
		event.stopPropagation();
		reloadData();
		message.success('Ajouté à vos favories !')
	
		try {
		  const favoritesRef = firebase.firestore().collection('favorites');
		  const postRef = firebase.firestore().collection('posts');
	
		  // Check if the post is already in favorites for the current user
		  const querySnapshot = await favoritesRef
		  .where('postUid', '==', post.id)
		  .where('owner.uid', '==', firebase.auth().currentUser.uid).get();
	
		  if (!querySnapshot.empty) {
			// Post already favorited by the user, remove it from favorites
             querySnapshot
			 .docs
			 .forEach( async (doc) => {
				if(doc.data().id === post.id){
					await favoritesRef.doc(doc.id).delete();
			        await postRef.doc(post.id).update({ like: firebase.firestore.FieldValue.increment(-1)});
				}
			 })
			
		  } else {
			// Post not favorited by the user, add it to favorites
			post.like = 1;
			await favoritesRef.add({
				postUid: post.id,
				...post
			});
	
			await postRef.doc(post.id).update({ like: firebase.firestore.FieldValue.increment(1) });
		  }
		} catch (error) {
		  console.error('Error adding/removing from favorites: ', error);
		}
	  };

	  const openEdit = (post) => {

	  }

	  const deletePost = async (post) => {
		
			setLoading(true);
			firebase.auth().onAuthStateChanged( async user => {
				try {
					const postRef = firebase.firestore().collection('posts').doc(post.id);
					const favoritesRef = firebase.firestore().collection('favorites');
			  
					// Delete the post from Firestore
					await postRef.delete();
			
					// Delete the post from favorites if it exists there
					const favoriteQuerySnapshot = await favoritesRef
					  .where('postUid', '==', post.id)
					  .where('owner.uid', '==', user.uid)
					  .get();
					if (!favoriteQuerySnapshot.empty) {
					  favoriteQuerySnapshot.forEach(async (doc) => {
						await favoritesRef.doc(doc.id).delete();
						setLoading(false);
						reloadData();
						message.success('Supprimé avec succès !');
					  });
					}else{
						setLoading(false);
						reloadData();
						message.success('Supprimé avec succès !');
					}
				  } catch (error) {
					setLoading(false);
					message.error('Erreur de suppression !')
				  }
			})
			
		
      
		
	  }

	  const confirm = (post) => {
	const confirmRef =  modal.confirm({
		  title: 'Confirmation',
		  icon: <ExclamationCircleOutlined />,
		  content: 'Voulez-vous supprimer cette annonce ?',
		  okText:     'Supprimer',
		  cancelText: 'Annuler',
	      okButtonProps: {
			className: 'btn btn-danger'
		  },
		  onOk: () => {
			deletePost(post);
		  },
		  onCancel: () =>{
             confirmRef.destroy()
		  }
		});
	  };

	  const deletePostFromFavorite = async (post) => {
        setLoading(true);
		firebase.auth().onAuthStateChanged( async user => {
			try {
				const favoritesRef = firebase.firestore().collection('favorites');
				const favoriteQuerySnapshot = await favoritesRef
				  .where('postUid', '==', post.id)
				  .where('owner.uid', '==', user.uid)
				  .get();
		  
				if (!favoriteQuerySnapshot.empty) {
				  favoriteQuerySnapshot.forEach(async (doc) => {
					await favoritesRef.doc(doc.id).delete();
					setLoading(false);
					reloadData();
				    message.success('Retiré de vos favoriés !');
					
				  });
				}
			  } catch (error) {
				setLoading(false);
				message.error('Erreur de suppression !');
			  }
		})
		
		
	  }
   return(
		<div className="PostCard">
			{loading && <Loader />}
			{contextHolder}
			{post && 
			<Card
			    className='PostCard'
				bodyStyle={{
					padding: '6px', 
					boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px', 
					backgroundColor: post?.id === selectedPost?.id ? '#daffca': 'inherit', 
					position: 'relative'}} 
				onClick={() =>  onPostClicked(post)}>
				{screen === 'home' &&
				<button
				    onClick={(event) => addToFavorites(event, post)}
				    style={{position: 'absolute', top: '8px', right: '8px', fontSize:'22px', backgroundColor:'inherit', border: 'none'}}>
					<div className='d-flex justify-content-start align-items-center'>
						<div><span className='text-muted' style={{fontSize: '11px'}}>{post.like}</span></div>
						<div className='ms-1'><LikeOutlined style={{color: inFavorite ? 'orange': null}}  /></div>
					</div>
				</button>}

				{screen === 'account' &&
				<div style={{position: 'absolute', top: '8px', right: '8px', fontSize:'22px', backgroundColor:'inherit', border: 'none'}}>
					<Dropdown
						menu={{
						items,
						onClick: (e) => {
                          if(e.key === 'edit'){
							openEdit(post);
						  } if(e.key === 'delete'){
							confirm(post);
						  }
						}
						}}
						trigger={['click']}>
						<button className='btn btn-outline pr-3' style={{width: '20px'}} onClick={(e) => e.preventDefault()}>
						<Space>
							<MoreOutlined style={{fontSize: '22px', fontWeight: '700'}} />
						</Space>
						</button>
					</Dropdown>
				</div>}

				{screen === 'favorite' &&
				<button
				   onClick={(event) => {
					event.stopPropagation();
					deletePostFromFavorite(post);
				   }}
				  style={{position: 'absolute', top: '8px', right: '8px', fontSize:'22px', backgroundColor:'inherit', border: 'none'}}>
					<div className='d-flex justify-content-start align-items-center'>
						<CloseCircleOutlined  />
					</div>
				</button>}
				<Space direction="horizontal" style={{
					position: 'relative !important'
				}}>
				{post.images.map((img, index) => 
					<Avatar 
					shape="square"  
					style={{width: 120, height: 130, display: index !== 0 && 'none', cursor:'pointer'}} 
					src={img} 
					onClick={(event) =>openImageViewer(event,index, post)} key={index} /> 
					)}
				    <Tag style={{position: 'absolute',  left: '12px', top: '12px', fontSize: '7px !important'}} color="#108ee9">{post.mode.toUpperCase()}</Tag>

					<div>
					<h3 style={{fontSize: 12, fontWeight: 500}}>{post.title.capitalize()}</h3>
					<div style={{fontSize: '11px'}} className='text-muted'> Publié le  {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleString(): 'Inconnu'}</div>
					<div>
					 	<Text strong className='text-muted'  style={{fontSize: '12px'}}>CFA {post.price} / {post.priceBy}</Text>
					</div>
					<Text color='#108ee9' style={{fontSize: '11px'}}><i className='fa fa-map-marker'></i> {post.address}</Text>
					<div className='mt-1 w-100  d-flex'>
						{post.rooms     > 0  && <div className='d-flex align-items-center'> <img src={bed} alt='bed' style={{width: '12px'}} className='me-2'  /> {post.rooms}</div>}
						{post.salon     > 0  && <div className='ms-3 d-flex align-items-center'> <img src={sofa} alt='sofa' style={{width: '16px'}} className='me-2' />  {post.salon}</div>}
						{post.bathRooms > 0  && <div className='ms-3 d-flex align-items-center'> <img src={bathroom} alt='bathroom' style={{width: '12px'}}  className='me-2'  />  {post.bathRooms}</div>}
						{post.toilet    > 0  && <div className='ms-3 d-flex align-items-center'> <img src={toilet} alt='bathroom' style={{width: '12px'}} className='me-2'  />  {post.toilet}</div>}
						{post.kitchen   > 0  && <div className='ms-3 d-flex align-items-center'> <img src={kitchen} alt='kitchen' style={{width: '12px'}} className='me-2'  />  {post.kitchen}</div>}
					</div>
					</div>
				</Space>
            </Card>}
		</div>
		)
}