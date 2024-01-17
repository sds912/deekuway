import React from 'react';
import './HomePage.css';
import GeolocationMap from '../../components/GeolocationMap/GeolocationMap';
import PostList from '../../components/PostList/PostList';
import { useState } from 'react';
import { useEffect } from 'react';
import { message } from 'antd';
import NavBar from '../../components/NavBar/NavBar';

const  HomePage = () => {
	const [post, setPost] = useState(null);
	const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
	const [messageApi, contextHolder] = message.useMessage();

const handlePostFromPostList = (post) => {setPost(post);};

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
  },[]);

	return(
       <>
	   <NavBar />
		<div className="HomePage container p-4 px-0 pt-2 " style={{height: '100vh !important'}}>
			{contextHolder}
			<div className='row px-0'>
				<div className='col-12 col-md-7  bg-muted p-2' >
					<PostList postToHomePage={handlePostFromPostList}  />
				</div>
				<div className='col-12 col-md-5' >
					<GeolocationMap post={post} userLocation={userLocation} />
			    </div>
			</div>
		</div>
		</>
	)
	
}

export default HomePage;