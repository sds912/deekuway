import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import firebase from '../../services/firebaseConfig';
import ReactSimpleImageViewer from 'react-simple-image-viewer';
import Carousel from 'react-multi-carousel';
import { Avatar, Modal, message } from 'antd';
import './PostDetailWPage.css';
import { LikeOutlined, MessageOutlined, PhoneOutlined, WhatsAppOutlined } from '@ant-design/icons';
import sofa from '../../assets/sofa.svg';
import bed from '../../assets/bed.svg';
import kitchen from '../../assets/kitchen.svg';
import bathroom from '../../assets/bathroom.svg';
import toilet from '../../assets/toilet.svg';
import GeolocationMap from '../../components/GeolocationMap/GeolocationMap';
import NavBar from '../../components/NavBar/NavBar';
import PostList from '../../components/PostList/PostList';

export const PostDetailWPage = () => {
    const responsive = {
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 1
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        },

        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 1
          },
          desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1
          },
        
      }

    const param    = useParams();
    const navigate = useNavigate();
    const [post, setPost]  = useState();
    const [relatedPosts, setRelatedPosts]  = useState([]);
	const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);


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
        })
        loadRelatedPosts(data.mode, data.type, response.id);
      })

         
      }
    }, []);

  
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
  
	const closeImageViewer = () => {
	  setCurrentImage(0);
	  setIsViewerOpen(false);
	};
    return (
        <div className='bg-white'>
        <NavBar />

        <div className='row'>
        <div className='col-6'>
            {post && 
        <div 
       
        style={{backgroundColor: '#FFFFFF', minHeight: '100vh', paddingBottom: '60px'}}>
        {isViewerOpen && post && (  
        <ReactSimpleImageViewer
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
                key={'99'}
                responsive={responsive} 
                arrows={true}
                infinite={true}
                autoPlay={true}
                showDots={true}
                beforeChange={(nextSlide) => handleCarouselChange(nextSlide)} >
                {post.images.map((image, index) =>
                  <img className='bg-image' src={image} alt={post.title} key={index} style={{ height: '380px', width: '100%', zIndex: '200'}} /> 
                  )}
                </Carousel> 
               </div> }

             

               <div className='d-flex justify-content-between align-items-center' 
                    style={{position: 'absolute', top: '20px', left: '20px', width: '90%'}}>
                    <button 
                    className='back-arrow-btn'
                    onClick={() => navigate('/')}>
                        <i className="fa fa-long-arrow-left text-white" style={{fontSize: '36px'}} aria-hidden="true"></i>
                    </button>
                    <button className='map-btn' onClick={() => openMapModal()}>
                        <i className="fa fa-map text-white" style={{fontSize: '26px'}} aria-hidden="true"></i>
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

                <div>
                    <h4 className='mt-5 mb-2 text-muted fw-bold'>Composition</h4>
                    <div className='row'>
                      {post.bedRooms > 0&& 
                      <div className='col-4 mt-3'>
                         <div className='facilitie-item'>
                             <img width={22} src={bed} alt='bedroom' />
                             <h6 className='text-dark fw-bold mt-3'>Chambre(s)</h6>
                             <span className='text-muted'>{post.bedRooms}</span>
                         </div>
                      </div>}
                      {post.otherRooms && post.otherRooms.includes('sallon')  &&
                      <div className='col-4 mt-3'>
                         <div className='facilitie-item'>
                             <img width={22} src={sofa} alt='salon' />
                             <h6 className='text-dark fw-bold mt-3'>Salon(s)</h6>
                             <span className='text-muted'>{1}</span>
                         </div>
                      </div>}
                      {post.otherRooms && post.otherRooms.includes('bathroom') > 0 && 
                      <div className='col-4 mt-3'>
                         <div className='facilitie-item'>
                             <img width={22} src={bathroom} alt='bathroom' />
                             <h6 className='text-dark fw-bold mt-3'>Salle(s) de bain</h6>
                             <span className='text-muted'>{1}</span>
                         </div>
                      </div>}
                      {post.otherRooms && post.otherRooms.includes('toilet') && 
                      <div className='col-4 mt-3'>
                         <div className='facilitie-item'>
                             <img width={22} src={toilet} alt='toilet' />
                             <h6 className='text-dark fw-bold mt-3'>Toilette(s)</h6>
                             <span className='text-muted'>{1}</span>
                         </div>
                      </div>}
                      {post.otherRooms && post.otherRooms.includes('kitchen') &&
                        <div className='col-4 mt-3'>
                         <div className='facilitie-item'>
                             <img width={22} src={kitchen} alt='kitchen' />
                             <h6 className='text-dark fw-bold mt-3'>Cuisine(s)</h6>
                             <span className='text-muted'>1</span>
                         </div>
                      </div>}

                    </div>
                </div>
              
            </div>}

            <div className='p-3'>
               {post.description}
            </div>
          
        </div>}

        {post && post.owner && <div className='contact-owner  p-3'>
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
           </div>}

        </div>
            <div className='col-6'>
            <div className='card card-body' style={{
                width: '100%',
                right: '0',
                height: '80vh'
            }}>
             <GeolocationMap  post={post} screen={'web'} />
            </div>    
            </div>

            {relatedPosts.length > 0 &&
            <div className='container'>
               <PostList
               posts={relatedPosts}
               allReadyViewed={[]}
               display='grid'

                />
            </div>}
        </div>
    
        </div>);
}