import React, { useCallback,  useState } from 'react';
import './PostCard.css';
import { Avatar, Card, Space, Tag, Typography } from 'antd';
import { HeartOutlined, UserOutlined } from '@ant-design/icons';
import ReactSimpleImageViewer from 'react-simple-image-viewer';
import firebase from '../../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import sofa from '../../assets/sofa.svg';
import bed from '../../assets/bed.svg';
import kitchen from '../../assets/kitchen.svg';
import bathroom from '../../assets/bathroom.svg';
import toilet from '../../assets/toilet.svg';

const { Text } = Typography;

export const PostCard = ({postToHomePage, post, selectedPost, inFavorite}) => {
	const [currentImage, setCurrentImage] = useState(0);
	const [isViewerOpen, setIsViewerOpen] = useState(false);
	const navigate = useNavigate();
   
	const onPostClicked = (post) => {
		if(post !== null && post !== undefined && post.id !== undefined && post.id !== null){
			postToHomePage(post);
			navigate('/posts/'+post.id);
		}
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
					<div style={{fontSize: '11px'}} className='text-muted'> Publié le {new Date(post.createdAt.toDate()).toLocaleString()}</div>
					<Text strong className='text-muted'  style={{fontSize: '11px'}}>CFA {post.price}</Text>
					<div className='d-flex align-items-center my-2' >
						<Avatar size={22} icon={<UserOutlined />} />
						<span className='fw-bold ms-1 text-muted'  style={{fontSize: '11px'}}>{post.owner.name}</span>
					</div>
					<Text color='#108ee9' style={{fontSize: '11px'}}><i className='fa fa-map-marker'></i> {post.address}</Text>
					<div className='mt-1'>
						<Space>
						{post.rooms     > 0  && <span> <img src={bed} alt='bed' style={{width: '12px'}} /> {post.rooms}</span>}
						{post.salon     > 0  && <span className='ms-3'> <img src={sofa} alt='sofa' style={{width: '12px'}} />  {post.salon}</span>}
						{post.bathRooms > 0  && <span className='ms-3'> <img src={bathroom} alt='bathroom' style={{width: '12px'}} />  {post.bathRooms}</span>}
						{post.toilet    > 0  && <span className='ms-3'> <img src={toilet} alt='bathroom' style={{width: '12px'}} />  {post.toilet}</span>}
						{post.kitchen   > 0  && <span className='ms-3'> <img src={kitchen} alt='kitchen' style={{width: '12px'}} />  {post.kitchen}</span>}
						</Space>
					</div>
					</div>
				</Space>
				</Space>
            </Card>
		</div>
		)
}