import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import firebase from '../../services/firebaseConfig';
import ReactSimpleImageViewer from 'react-simple-image-viewer';
import Carousel from 'react-multi-carousel';
import { Avatar, Modal, message } from 'antd';
import {
  LikeOutlined, 
  MessageOutlined, 
  PhoneOutlined, 
  WhatsAppOutlined } from '@ant-design/icons';
import GeolocationMap from '../../components/GeolocationMap/GeolocationMap';
import PostListMobile from './../../components/PostListMobile/PostListMobile';
import { PostProperties } from '../../components/PostProperties/PostProperties';
import './PostDetailPage.css';


export const PostDetailPage = () => {
    const responsive = {
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 1
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
      }

    const param    = useParams();
    const navigate = useNavigate();
    const [post, setPost]  = useState();
    const [relatedPosts, setRelatedPosts]  = useState([]);
	  const [messageApi, contextHolder] = message.useMessage();
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
	  const [isModalVisible, setIsModalVisible] = useState(false);
    const [images, setImages] = useState([]);


    const onContact = (type) =>{
        if(type === 'whatsapp'){
            window.open(`https://wa.me/${post.owner.phone}`, '_blank');
        }
        if(type === 'phone'){
            window.open(`tel:${post.owner.phone}`);
        }
        if(type === 'email'){
            window.open(`mailto:${post.owner.email}`, '_blank');
    
        }
      }

   

    useEffect(() => {
      if(param.id !== undefined && param.id !== null){
      const postRef = firebase.firestore().collection('posts').doc(param.id);
      postRef.get().then(
        response => {
        const data = response.data();
        setPost({
            id: response.id,
            ...data
        });
        if(data){
            loadRelatedPosts(data.mode, data.type, response.id);
        }
        setImages(data.images);
      })

         
      }
    }, []);

  
   const loadRelatedPosts = (mode, type, uid) => {
    const postRef = firebase
    .firestore()
    .collection('posts')
    .where('mode', '==', mode)
    .where('type','==', type)
    .limit(10);
    
    postRef.get().then(
      response => {
    const dataList = [];

     response.docs.forEach(doc => {
        if(doc.id !== uid){
            dataList.push({
                id: doc.id,
                ...doc.data()
              })
        }
     
     })

     console.log(dataList)
    setRelatedPosts(dataList);
     
    })
    }
    const handleCarouselChange = (nextSlide) => {
        const selectedPost = relatedPosts[nextSlide - 1];
        if (selectedPost) { 
            setPost(selectedPost); 
        }
      };

 const openMapModal = () => {
    setIsModalVisible(true);
 }     	
const handleCancelModal = () => {
		setIsModalVisible(false);
	  };
  
      
  const  openImageViewer = useCallback((event,index, post) => {
	setCurrentImage(index);
    setPost(post);
	  setIsViewerOpen(true);
    event.stopPropagation();
	}, []);
  
	const closeImageViewer = () => {
	  setCurrentImage(0);
	  setIsViewerOpen(false);
	};
    return (
        <>
        {post && 
        <div style={{backgroundColor: '#FFFFFF', minHeight: '100vh', paddingBottom: '60px'}}>
        {isViewerOpen && post && (  <ReactSimpleImageViewer
				src={ post.images }
				currentIndex={ currentImage }
				disableScroll={ false }
				closeOnClickOutside={ true }
				onClose={ closeImageViewer }
				/>
			)}
			{contextHolder}
             <div  style={{height: '340px', width: '100%', zIndex: '4', position: 'relative'}}>
              {post && 
              <div style={{position: 'absolute', top:'0', height: '380px', width: '100%',}}> 
               <Carousel
                responsive={responsive} 
                arrows={true}
                infinite={true}
                autoPlay={true}
                showDots={true} >
                {images.map((image, index) =>
                  <div className='bg-image' key={index} style={{backgroundImage: `url(${image})`, height: '380px', width: '100%', zIndex: '4'}}> </div>
                  )}
                </Carousel> 
               </div> }

               <div className='d-flex justify-content-between align-items-center' 
                    style={{position: 'absolute', top: '20px', left: '20px', width: '90%'}}>
                    <button 
                    className='back-arrow-btn'
                    onClick={() => navigate('/')}>
                        <i class="fa fa-long-arrow-left text-white" style={{fontSize: '36px'}} aria-hidden="true"></i>
                    </button>
                    <button className='map-btn' onClick={() => openMapModal()}>
                        <i class={ "fa fa-map text-white"} style={{fontSize: '26px'}} aria-hidden="true"></i>
                    </button>
                </div>
            </div>

            {post && 
            <div className='p-3'>
                <div className='d-flex justify-content-between align-items-center'>
                   <div className='pe-4'>
                        <p className='fw-bold' style={{fontSize: '20px'}}>{post.price} / {post.priceBy ? post.priceBy.capitalize(): ''}</p>
                        <h5 className='fw-bold text-dark' style={{fontSize: '22px', marginTop: '-10px'}}>{post.title.capitalize()}</h5>
                        <div className='text-muted mt-2'>
                            <i className='fa fa-map-marker'></i>
                            <span className='ms-2'>{post.address}</span>
                        </div>
                        <div className='mt-2 text-muted fw-bold'>
                            Publié le {new Date(post.createdAt.toDate()).toLocaleString()}
                        </div>
                   </div>
                   <div>
                      <LikeOutlined style={{fontSize: '26px'}} /> {post.like}
                   </div>
                </div>

                <PostProperties post={post} />
              
            </div>}

            <div className='p-3'>
               {post.description}
            </div>
           <div className='contact-owner w-100 p-3'>
             <h3 className='fw-bold text-dark mb-3 border-bottom pb-2'>Contacter l'annonceur </h3>
              <div className='d-flex justify-content-between align-items-center'>
                 <div className='d-flex justify-content-start align-items-center' >
                   <Avatar src={post.owner.avatar} alt='N' />
                   <h5 className='ms-2'>{post.owner.name}</h5>
                 </div>
                   <div className='d-flex align-items-center justify-content-center w-50'>
                        <button className='btn btn-outline-none' onClick={() => onContact('whatsapp')}>
                            <WhatsAppOutlined style={{fontSize: '26px'}}  />
                        </button>
                        <button className='btn btn-outline-none' onClick={() => onContact('phone')}>
                            <PhoneOutlined style={{fontSize: '26px'}} />
                        </button>
                        <button className='btn btn-outline-none' onClick={() => onContact('email')}>
                            <MessageOutlined style={{fontSize: '26px'}}  />
                        </button>
					</div>
              </div>
           </div>
           <div className='container mt-5 mb-3'>
             <h3 className='fw-bold text-dark'>Annonces similaires</h3>
              <PostListMobile
                posts={relatedPosts}
                allReadyViewPost={[]}
                display='grid'
               />
           </div>
        </div>}
        {post && <Modal
			title="Authentification"
			visible={isModalVisible}
			onCancel={handleCancelModal}
            style={{position: 'absolute', top: '0'}}
			footer={false}>
			<GeolocationMap  post={post} screen={'Mobile'} />
		</Modal>}
        </>);
}