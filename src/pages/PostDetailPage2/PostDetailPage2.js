import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import firebase from '../../services/firebaseConfig';
import GeolocationMap from '../../components/GeolocationMap/GeolocationMap';
import { PostCard, messageApi, contextHolder} from '../../components/PostCard/PostCard';
import ReactSimpleImageViewer from 'react-simple-image-viewer';
import Carousel from 'react-multi-carousel';
import { message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './PostDetailPage2.css';


export const PostDetailPage2 = () => {
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

    const param = useParams();
    const [post, setPost]  = useState();
    const [relatedPosts, setRelatedPosts]  = useState([]);
    const [userLocation, setUserLocation]  = useState();
	  const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);



    const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
                
              setUserLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
              messageApi.open({
                type: 'success',
                content: `Bravo ! votre position a été relevé au lat: ${position.coords.latitude} lng: ${position.coords.longitude}`,
              });
            },
            (error) => {
                messageApi.open({
                    type: 'error',
                    content: "Désolé ! nous ne pouvons pas relever votre position pour l'instant",
                  });
            }
          );
        } else {
            messageApi.open({
                type: 'error',
                content: 'Geolocation is not supported by this browser',
              });
        }
      };

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
      })

         
      }
    }, []);

  
    const handleCarouselChange = (nextSlide) => {
        const selectedPost = relatedPosts[nextSlide - 1];
        if (selectedPost) { 
            setPost(selectedPost); 
        }
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
        <div>
        {isViewerOpen && post && (  <ReactSimpleImageViewer
				src={ post.images }
				currentIndex={ currentImage }
				disableScroll={ false }
				closeOnClickOutside={ true }
				onClose={ closeImageViewer }
				/>
			)}
			{contextHolder}
             <div  style={{height: '380px', width: '100%', zIndex: '4', position: 'absolute', top: '0'}}>
            <div style={{position: 'absolute !important', top: '0 !important', zIndex: '20 !important'}}>
                <button className='back-arrow-btn'>
                    <i class="fa fa-long-arrow-left text-white" style={{fontSize: '36px'}} aria-hidden="true"></i>
                </button>
            </div>
              {post && <Carousel
                responsive={responsive} 
                arrows={false}
                infinite={true}
                autoPlay={true}
                beforeChange={(nextSlide) => handleCarouselChange(nextSlide)} >
                {post.images.map((image, index) =>
                  <div className='p-4' key={index} style={{backgroundImage: `url(${image})`, height: '380px', width: '100%', zIndex: '4'}}>
                    
                  </div>

                  )}
               </Carousel>}
            </div>
           
        </div>
    );
}