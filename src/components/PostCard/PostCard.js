import React, { useCallback, useEffect, useState } from 'react';
import './PostCard.css';
import { Avatar, Card, Space, Tag, Typography } from 'antd';
import { HeartOutlined, UserOutlined } from '@ant-design/icons';
import ReactSimpleImageViewer from 'react-simple-image-viewer';
import firebase from '../../services/firebaseConfig';

const { Text } = Typography;

export const PostCard = ({postToHomePage, post, selectedPost, inFavorite}) => {

	console.log(inFavorite)
	const [currentImage, setCurrentImage] = useState(0);
	const [isViewerOpen, setIsViewerOpen] = useState(false);
   
	const onPostClicked = (item) => {
		postToHomePage(item);
	  };

	  
  const openImageViewer = useCallback((event,index) => {
	setCurrentImage(index);
	setIsViewerOpen(true);
	event.stopPropagation();
  }, []);

  const closeImageViewer = () => {
	setCurrentImage(0);
	setIsViewerOpen(false);
  };

  const addToFavorites = async (event) => {
	event.stopPropagation();
  
	try {
	  const favoritesRef = firebase.firestore().collection('favorites'); // Using post.id as the document ID
	  const postRef = firebase.firestore().collection('posts'); // Using post.id as the document ID
  
	  const querySnapshot = await favoritesRef.where('id', '==', post.id).get();
     
	  if (!querySnapshot.empty) {
		// Post already favorited, remove it from favorites
        await favoritesRef.where('id', '==', post.id).get().then(d => d.forEach(v => v.ref.delete()))
		await postRef.doc(post.id).update({like:  (post.like - 1)})

	  } else {
		// Post not favorited, add it to favorites for the user
		await favoritesRef.add({id:post.id});
		await postRef.doc(post.id).update({like:  firebase.firestore.FieldValue.increment(1)})

  
		console.log('Added to favorites');
	  }
	} catch (error) {
	  console.error('Error adding/removing from favorites: ', error);
	}
  };




   return(
		<div className="PostCard">
			{isViewerOpen && (
			  <div style={{marginTop: '4px !important'}}>	<ReactSimpleImageViewer
				src={ post.images }
				currentIndex={ currentImage }
				disableScroll={ false }
				closeOnClickOutside={ true }
				onClose={ closeImageViewer }
				 
				/> </div>
			)}
			<Card
				bodyStyle={{padding: '6px', boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px', backgroundColor: post?.id === selectedPost?.id ? '#daffca': 'inherit', position: 'relative'}} 
				onClick={() =>  onPostClicked(post)}>
				<button
				   onClick={addToFavorites}
				  style={{position: 'absolute', top: '8px', right: '8px', fontSize:'22px', backgroundColor:'inherit', border: 'none'}}>
					<div className='d-flex justify-content-start align-items-center'>
						<div><span className='text-muted' style={{fontSize: '11px'}}>{post.like}</span></div>
						<div className='ms-1'><HeartOutlined style={{color: inFavorite ? 'orange': null}}  /></div>
					</div>
				</button>
				<Space direction="vertical">
				<Space>
					
					{post.images.map((img, index) => <Avatar shape="square"  style={{width: 120, height: 130, display: index !== 0 && 'none', cursor:'pointer'}} src={img} onClick={(event) =>openImageViewer(event,index)} key={index} />)}

					<div>
					<h3 style={{fontSize: 12, fontWeight: 500}}>{post.title}</h3>
					<Text strong className='text-muted'  style={{fontSize: '11px'}}>CFA {post.price} | Publiée le {post.createdAt}</Text>
					<div className='d-flex align-items-center my-2' >
						<Avatar size={22} icon={<UserOutlined />} />
						<span className='fw-bold ms-1 text-muted'  style={{fontSize: '11px'}}>{post.owner.name}</span>
					</div>
					<Text color='#108ee9' style={{fontSize: '11px'}}><i className='fa fa-map-marker'></i> {post.address}</Text>
					<div className='mt-1'>
						<Space>
						<Tag color='#2db7f5'><i className='fa fa-bed'></i> {post.rooms}</Tag>
						<Tag color='#f50'> <i className='fa fa-bath'></i> {post.bathRooms}</Tag>
						<Tag color='#87d068'><i className='fa fa-money'></i> {post.mode}</Tag>
						</Space>
					</div>
					</div>
				</Space>
				</Space>
            </Card>
		</div>
		)
}