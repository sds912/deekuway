import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import firebase from '../../services/firebaseConfig';
import GeolocationMap from '../../components/GeolocationMap/GeolocationMap';
import { Carousel, message } from 'antd';
import { PostCard } from '../../components/PostCard/PostCard';


export const PostDetailPage = () => {
    const responsive = {
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
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
      getLocation();
      if(param.id !== undefined && param.id !== null){
      const postRef = firebase.firestore().collection('posts').doc(param.id);
      postRef.get().then(
        response => {
        const data = response.data();
        console.log(data);
        setPost(data);
        fetchData(data.type);
      })

         
      }
    }, []);

    const fetchData = async (mode = 'all', search = null) => {
        setLoading(true);
        let query = firebase.firestore().collection('posts');
      
        if (mode === 'location') {
          query = query.where('mode', '==', 'location');
        } else if (mode === 'vente') {
          query = query.where('mode', '==', 'vente');
        }
      
        if (search !== null) {
          query = query.where('title', '>=', search); // Changed '<=' to '>=' for search
        }
      
        query.onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const doc = change.doc;
            const postData = {
              id: doc.id,
              ...doc.data()
            };
      
            if (change.type === 'added') {
              // Handle added document
              setRelatedPosts((prevPosts) => [...prevPosts, postData]);
            } else if (change.type === 'modified') {
              // Handle modified document
              setRelatedPosts((prevPosts) =>
                prevPosts.map((post) => (post.id === postData.id ? postData : post))
              );
            } else if (change.type === 'removed') {
              // Handle removed document
              setRelatedPosts((prevPosts) =>
                prevPosts.filter((post) => post.id !== postData.id)
              );
            }
          });
      
          setLoading(false);
        });
      };

    const handleCarouselChange = (nextSlide) => {
        const selectedPost = relatedPosts[nextSlide - 1];
        if (selectedPost) { 
            setPost(selectedPost); 
        }
      };
    return (
        <div>
			{contextHolder}
            {post && userLocation && post.latitude && post.longitude &&<GeolocationMap post={post} userLocation={userLocation} screen={'Mobile'} /> } 
            {relatedPosts.length > 0 &&
            <div style={{position: 'fixed', bottom: 0, left: 0, right: 0, marginLeft: 'auto', marginRight: 'auto', marginBottom:'4px', height:'120px', width: '95%', marginLeft: 'auto', marginRight:'auto'}}>
            {relatedPosts && <Carousel 
                //responsive={responsive} 
                arrows={false}
                beforeChange={(nextSlide) => handleCarouselChange(nextSlide)} >
                {relatedPosts.map((item, index) =>
                <PostCard key={index}  post={item} selectedPost={post} postToHomePage={() =>{}} inFavorite={false}  />   )}
            </Carousel>}
            </div>}
        </div>
    );
}