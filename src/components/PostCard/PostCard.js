import React from 'react';
import './PostCard.css';
import { Avatar, Card, Space, Typography } from 'antd';
import {LikeOutlined, MoreOutlined} from '@ant-design/icons';
import firebase from '../../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import sofa from '../../assets/sofa.svg';
import bed from '../../assets/bed.svg';
import kitchen from '../../assets/kitchen.svg';
import bathroom from '../../assets/bathroom.svg';
import toilet from '../../assets/toilet.svg';

const { Text } = Typography;

export const PostCard = ({postToHomePage, post, selectedPost, inFavorite, openImageViewer, screen}) => {
	const navigate = useNavigate();
   

	  
	  const onPostClicked = (post) => {
		if (post !== null && post !== undefined && post.id !== undefined && post.id !== null && screen === 'home') {
		  postToHomePage(post);
		  navigate('/posts/' + post.id);
		}
	  };
	
	  const addToFavorites = async (event, post) => {
		event.stopPropagation();
	
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
   return(
		<div className="PostCard">
			{post && <Card
				bodyStyle={{padding: '6px', boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px', backgroundColor: post?.id === selectedPost?.id ? '#daffca': 'inherit', position: 'relative'}} 
				onClick={() =>  onPostClicked(post)}>
				{screen === 'home' &&<button
				   onClick={(event) => addToFavorites(event, post)}
				  style={{position: 'absolute', top: '8px', right: '8px', fontSize:'22px', backgroundColor:'inherit', border: 'none'}}>
					<div className='d-flex justify-content-start align-items-center'>
						<div><span className='text-muted' style={{fontSize: '11px'}}>{post.like}</span></div>
						<div className='ms-1'><LikeOutlined style={{color: inFavorite ? 'orange': null}}  /></div>
					</div>
				</button>}

				{screen === 'account' &&<button
				   onClick={(event) => {}}
				  style={{position: 'absolute', top: '8px', right: '8px', fontSize:'22px', backgroundColor:'inherit', border: 'none'}}>
					<div className='d-flex justify-content-start align-items-center'>
						<MoreOutlined  />
					</div>
				</button>}
				<Space direction="vertical">
				<Space>
					
					{post.images.map((img, index) => <Avatar shape="square"  style={{width: 120, height: 130, display: index !== 0 && 'none', cursor:'pointer'}} src={img} onClick={(event) =>openImageViewer(event,index, post)} key={index} />)}

					<div>
					<h3 style={{fontSize: 12, fontWeight: 500}}>{post.title.capitalize()}</h3>
					<div style={{fontSize: '11px'}} className='text-muted'> Publié le {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleString(): 'Inconnu'}</div>
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
				</Space>
            </Card>}
		</div>
		)
}