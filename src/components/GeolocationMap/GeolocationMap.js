import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow,  DirectionsRenderer} from '@react-google-maps/api';
import './GeolocationMap.css';
import markerIcon from '../../assets/marker.png';
import userMarkerIcon from '../../assets/user-marker.png';
import { useCallback } from 'react';
import ReactSimpleImageViewer from 'react-simple-image-viewer';
import { Avatar, message } from 'antd';
import { ArrowLeftOutlined, MessageOutlined, PhoneOutlined, UserOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const defaultPosition = {lat: 14.698220, lng:-17.437160 }

const GeolocationMap = ({ post, screen}) => {
  const [map, setMap] = useState(null);
  const [mapUp, setMapUp] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [directions, setDirections] = useState(null);
  const navigate = useNavigate();
 const [messageApi, contextHolder] = message.useMessage();
 const [userLocation, setUserLocation]  = useState(null);




  const directionsCallback = (response) => {
    if (response !== null && response.status === 'OK') {
      setDirections(response);
    } else {
      console.error('Directions request failed');
    }
  };
 

  const openImageViewer = useCallback((index) => {
	  setCurrentImage(index);
	  setIsViewerOpen(true);
	}, []);
  
	const closeImageViewer = () => {
	  setCurrentImage(0);
	  setIsViewerOpen(false);
	};


  const handleMarkerClick = marker => {
    setSelectedMarker(marker);
  };


  // Function to set the map instance
  const onLoad = mapInstance => {
    setMap(mapInstance); 
  };

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

  const getLocation = () => {
	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(
		(position) => {
			
		  setUserLocation({
			latitude: position.coords.latitude,
			longitude: position.coords.longitude,
		  });

		  if (map) {
			if(post){
				map.panTo({ lat:post?.latitude, lng: post?.longitude });
			} else if(userLocation.latitude !== null){
				map.panTo({ lat: position.coords.latitude, lng: position.coords.longitude});
			}else{
				map.panTo(defaultPosition);
			}
		  if (window.google && window.google.maps) {
			setMapUp(true);
		  }
		  if (post && userLocation) {
			const directionsService = new window.google.maps.DirectionsService();
			directionsService.route(
			  {
				destination: {lat: post?.latitude, lng: post?.longitude},
				origin: { lat: position.coords.latitude, lng: position.coords.longitude},
				travelMode: 'DRIVING' // Change travel mode as needed (DRIVING, WALKING, BICYCLING, TRANSIT)
			  },
			  directionsCallback
			);
		  }
		} 
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

  // Update the map center whenever the lat or lng changes
  useEffect(() => {
	getLocation();
  }, [map,post]);

  return (
	<div  className='GeolocationMap bg-white' style={{height: screen === 'Mobile' ? '100vh': '100%', width: screen === 'Mobile' && '100vw', top: screen === 'Mobile' && '0'}}>
		{isViewerOpen && (
				<ReactSimpleImageViewer
				src={ post.images }
				currentIndex={ currentImage }
				disableScroll={ false }
				closeOnClickOutside={ true }
				onClose={ closeImageViewer }
				/>
			)}
			{userLocation && post && <GoogleMap
				mapContainerStyle={{ width: '100%', height: '100%' }}
				center={post !== null ?{lat: post?.latitude, lng: post?.longitude}: userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude}: defaultPosition}
				zoom={16}
				onLoad={onLoad}>
				{directions && <DirectionsRenderer directions={directions} options={{suppressMarkers: true}} />}
				{ selectedMarker && 
					<InfoWindow
						position={{lat : post?.latitude + 0.0007, lng: post.longitude}} onCloseClick={() => setSelectedMarker(null)} >
						<div className='card border-none' style={{width: '240px'}}>
                            <div className='card-head' style={{position: 'relative'}} >
								<div style={{position: 'absolute', top: 0, padding: '4px'}} className='d-flex align-items-center' >
								   <Avatar size="large" icon={<UserOutlined />} />
								   <span className='text-white fw-bold'>{post.owner.name}</span>
								</div>
								{post.images.map((img, index) => <img onClick={() => openImageViewer(index)} className='img-fluid' style={{width: "100%", height: "140px", display: index !== 0 && 'none', cursor:'pointer'}} src={img} alt={post.title} key={index} />)}
							</div>
							<div className='card-body'> 
								<span className='fw-bold'> {post.title}</span>
								<div className='mt-2 d-flex'>
									<p><i className='fa fa-map-marker'></i></p>
									<p className='ms-2'>{post.address}</p>
								</div>
								<div className='d-flex align-items-center justify-content-center'>
								<button className='btn btn-outline-none' onClick={() => onContact('whatsapp')}>
									<WhatsAppOutlined />
								</button>
								<button className='btn btn-outline-none' onClick={() => onContact('phone')}>
									<PhoneOutlined />
								</button>
								<button className='btn btn-outline-none' onClick={() => onContact('email')}>
									<MessageOutlined />
								</button>
								</div>
							</div>
						</div>
					</InfoWindow>} 
				{/* Display marker at the specified position */}
				
				{ (mapUp && post) &&  
				<Marker
				    key={post.id}
					position={{ lat: post.latitude, lng: post.longitude}}
					icon={{
					url: markerIcon,  
					scaledSize:  new window.google.maps.Size(50, 50)
					}}
					onClick={handleMarkerClick}
					onLoad={handleMarkerClick}
				/>} 

	            { (mapUp) &&  
					<Marker
						key={'currentUser'}
						position={{ lat: userLocation.latitude, lng: userLocation.longitude}}
						icon={{
						url: userMarkerIcon,  
						scaledSize:  new window.google.maps.Size(50, 50)
						}}
					/>} 				
			</GoogleMap>}
			{
			!(userLocation && post) &&<GoogleMap
			 center={defaultPosition}
			 zoom={8}
			 mapContainerStyle={{ width: '100%', height: '100%' }}

			>

			</GoogleMap>}
	</div>
  );
};

export default GeolocationMap;
